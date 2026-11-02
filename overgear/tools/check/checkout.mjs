#!/usr/bin/env node
// The checkout of a desktop and the promo code, in a real browser. The band is under the logo and holds the button back and the logo, the title "Secure Checkout" is plain under it, there is no
// "Order summary" heading; the promo code is a button that opens a dialog: a wrong code is refused and the dialog stays, a right one closes it, and the discount is green (the success color) in the summary.
//
//   node overgear/tools/check/checkout.mjs http://localhost:8000
import { launch } from '../../../tools/lib/sweep.mjs';

const base = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '');
const line = (key, title, price) => ({ key, id: 'venomous-abyss-heroic', title, sub: 'Piloted, heroic', price, qty: 1, eta: '3 hours' });
const STATE = JSON.stringify({ cart: [line('a', 'Venomous Abyss Heroic', 89), line('b', 'Mythic+ Bundle', 149)], wishlist: [], orders: [], user: { name: 'Dana', email: 'dana@example.com' }, promo: '' });
const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const problems = [];
const expectThat = (ok, what) => { if (!ok) problems.push(what); };

for (const [width, phone] of [[1440, false], [390, true]]) {
  const page = await (await browser.newContext({ viewport: { width, height: 900 }, hasTouch: phone })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript((s) => { if (!localStorage.getItem('baseui-overgear')) localStorage.setItem('baseui-overgear', s); }, STATE);
  await page.goto(`${base}/overgear/example/index.html#/checkout`);
  await page.waitForTimeout(1500);
  const where = phone ? 'phone' : 'desktop';
  if (!phone) {
    const layout = await page.evaluate(() => {
      const band = document.querySelector('.og-checkout__bar')?.getBoundingClientRect();
      const title = [...document.querySelectorAll('h1')].find((h) => h.textContent === 'Secure Checkout');
      const back = document.querySelector('.og-checkout__bar [aria-label="Back"]');
      const logo = document.querySelector('.og-checkout__bar .og-checkout__logo');
      return { hasBand: !!band, titleInBand: !!title?.closest('.og-checkout__bar'), titleBelow: !!title && !!band && title.getBoundingClientRect().top >= band.bottom, backIn: !!back, logoIn: !!logo, backBeforeLogo: !!back && !!logo && back.getBoundingClientRect().left < logo.getBoundingClientRect().left, headings: [...document.querySelectorAll('h1, h2')].map((h) => h.textContent) };
    });
    expectThat(layout.hasBand && layout.backIn && layout.logoIn && layout.backBeforeLogo, 'desktop: the band under the logo does not hold the button back and the logo');
    expectThat(!layout.titleInBand && layout.titleBelow, 'desktop: "Secure Checkout" is not a plain title under the band');
    expectThat(!layout.headings.includes('Order summary'), 'desktop: the "Order summary" heading is there');
  }
  const promo = page.getByRole('button', { name: 'Apply promo code' });
  expectThat((await promo.count()) === 1, `${where}: the promo code is not a button`);
  expectThat((await page.locator('.bui-collapsible').count()) === 0, `${where}: the promo code is a collapsible section`);
  await promo.click();
  await page.waitForTimeout(400);
  const dialog = page.getByRole('dialog', { name: 'Promo code' });
  expectThat((await dialog.count()) === 1, `${where}: the button does not open a dialog`);
  await page.locator('#og-promo-code').fill('nope');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await page.waitForTimeout(300);
  expectThat((await page.getByText('This code does not work').count()) === 1 && (await dialog.count()) === 1, `${where}: a wrong code is not refused under the field with the dialog staying`);
  await page.locator('#og-promo-code').fill('welcome10');
  await page.getByRole('button', { name: 'Apply', exact: true }).click();
  await page.waitForTimeout(900);
  expectThat((await dialog.count()) === 0, `${where}: a right code does not close the dialog`);
  const green = await page.evaluate(() => { const row = document.querySelector('.og-sum__row--discount'); if (!row) return null; const probe = document.createElement('span'); probe.style.color = 'var(--baseui-extensions-text-and-icon-success)'; document.body.append(probe); const success = getComputedStyle(probe).color; probe.remove(); return { row: getComputedStyle(row).color, label: getComputedStyle(row.querySelector('.og-sum__label')).color, value: getComputedStyle(row.lastElementChild).color, success, text: row.textContent }; });
  expectThat(!!green && green.row === green.success && green.label === green.success && green.value === green.success, `${where}: the discount is not in the success color (${JSON.stringify(green)})`);
  expectThat(!!green && /−\$\d/.test(green.text), `${where}: the discount row has no amount`);
  expectThat((await page.getByRole('button', { name: 'Promo code WELCOME10' }).count()) === 1, `${where}: the button does not say which code is applied`);
  expectThat(!errors.length, `${where}: errors ${errors.join('; ')}`);
  await page.close();
}

await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nCheckout: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log('Checkout: the band, the title, the promo code in a dialog and the green discount.');
