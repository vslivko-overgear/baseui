#!/usr/bin/env node
// The checkout and the promo code, in a real browser. A desktop: the button back (a button with its own background) and the logo are in a row with a divider under it, no band; the title
// "Secure Checkout" is plain under the divider; there is no "Review order" and no "Order summary" heading. The promo code is a row of a list, text on the left and a chevron on the right, with no icon;
// it opens a dialog: a wrong code is refused and the dialog stays, a right one closes it; the discount is green (the success color) in the summary; with a code applied the row has the code
// on the right and a cross that takes it off. The payment methods are tiles under their own heading "Payment method", after the items: each a radio in an outline, the chosen one with 2px in the selected
// color and the others with the standard outline (a button shows the other methods); the items are cards of their own; the summary sticks 24px from the top, not further.
//
//   node overgear/tools/check/checkout.mjs http://localhost:8000
import { launch } from '../../../tools/lib/sweep.mjs';

const base = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '');
const line = (key, title, price) => ({ key, id: 'venomous-abyss-heroic', title, sub: 'Piloted, heroic', price, qty: 1, eta: '3 hours' });
const STATE = JSON.stringify({ cart: [line('a', 'Venomous Abyss Heroic', 89), line('b', 'Mythic+ Bundle', 149), line('c', 'Power Leveling', 39), line('d', 'Gold 500K', 24), { ...line('e', 'Raid pack', 189), qty: 3 }], wishlist: [], orders: [], user: { name: 'Dana', email: 'dana@example.com' }, promo: '' });
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
      const top = document.querySelector('.og-checkout__top');
      const back = top?.querySelector('[aria-label="Back"]');
      const logo = top?.querySelector('.og-checkout__logo');
      const divider = top?.nextElementSibling;
      const title = [...document.querySelectorAll('h1')].find((h) => h.textContent === 'Secure Checkout');
      return {
        hasTop: !!top, backBeforeLogo: !!back && !!logo && back.getBoundingClientRect().left < logo.getBoundingClientRect().left,
        backBackground: back ? getComputedStyle(back).backgroundColor : null, noBand: !document.querySelector('.og-checkout__bar'),
        dividerAfter: !!divider?.classList.contains('bui-divider'), dividerFull: !!divider && Math.round(divider.getBoundingClientRect().width) === innerWidth,
        titleBelow: !!title && !!divider && title.getBoundingClientRect().top >= divider.getBoundingClientRect().bottom, headings: [...document.querySelectorAll('h1, h2')].map((h) => h.textContent),
      };
    });
    expectThat(layout.hasTop && layout.backBeforeLogo, 'desktop: the button back and the logo are not in a row, the button first');
    expectThat(!!layout.backBackground && layout.backBackground !== 'rgba(0, 0, 0, 0)', 'desktop: the button back has no background of its own');
    expectThat(layout.noBand && layout.dividerAfter && layout.dividerFull, 'desktop: under the logo there is a band, not a divider the width of the screen');
    expectThat(await page.evaluate(() => document.querySelector('.og-checkout__top [data-slot=icon-button]')?.getBoundingClientRect().height <= 40), 'desktop: the button back is not smaller than 48px');
    expectThat(layout.titleBelow, 'desktop: "Secure Checkout" is not a plain title under the divider');
    expectThat(!layout.headings.includes('Order summary') && !layout.headings.some((h) => h.startsWith('Review order')), `desktop: a heading is there that should not be (${layout.headings.join(', ')})`);
  } else {
    expectThat(!(await page.getByRole('heading', { name: /Review order/ }).count()), 'phone: the "Review order" heading is there');
    const bar = () => page.evaluate(() => ({ h1: document.querySelectorAll('.og-checkout__title').length, op: +getComputedStyle(document.querySelector('.bui-navbar__title')).opacity, text: document.querySelector('.bui-navbar__title').textContent }));
    const top = await bar();
    expectThat(top.h1 === 1 && top.op === 0, `phone: at the start the page has its title and the bar has none (${JSON.stringify(top)})`);
    await page.evaluate(() => window.scrollTo(0, 600)); await page.waitForTimeout(500);
    const down = await bar();
    expectThat(down.op === 1 && down.text === 'Secure Checkout', `phone: scrolled, the bar does not show "Secure Checkout" (${JSON.stringify(down)})`);
    await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
  }
  const head = await page.evaluate(() => { const h = document.querySelector('.og-checkout__title'); const c = h?.nextElementSibling; const probe = document.createElement('span'); probe.style.color = 'var(--baseui-text-and-icon-secondary)'; document.body.append(probe); const sec = getComputedStyle(probe).color; probe.remove(); return c ? { text: c.textContent, below: c.getBoundingClientRect().top >= h.getBoundingClientRect().bottom, secondary: getComputedStyle(c).color === sec } : null; });
  expectThat(head && head.text === '7 items' && head.below && head.secondary, `${where}: under "Secure Checkout" there is no secondary count of the items (${JSON.stringify(head)})`);
  const qty = await page.evaluate(() => [...document.querySelectorAll('.og-lines--surface > .og-line')].map((l) => { const q = l.querySelector('.og-line__qty'); const meta = [...l.querySelectorAll('.og-line__meta')].at(-1).getBoundingClientRect(); const body = l.querySelector('.og-line__body').getBoundingClientRect(); const price = l.querySelector('.og-line__price').getBoundingClientRect(); const bin = l.querySelector('[data-slot=icon-button]').getBoundingClientRect(); const r = q?.getBoundingClientRect(); return { has: !!q, after: !!r && r.top >= meta.bottom && r.left >= body.left - 1 && r.right <= body.right + 1, priceTop: price.top - l.getBoundingClientRect().top < 40 && bin.top >= meta.bottom && Math.abs(bin.right - price.right) <= 8 }; }));
  expectThat(qty.every((x) => x.priceTop) && qty.filter((x) => x.has).length === 1 && qty.at(-1).has && qty.at(-1).after, `${where}: the price is not on top and the bin at the bottom, both at the right edge, or the quantity is not a row after the delivery time, only on the line of several units (${JSON.stringify(qty)})`);
  const strip = await page.evaluate(() => {
    const tiles = [...document.querySelectorAll('.og-methodcard')];
    const items = [...document.querySelectorAll('.og-lines--surface > .og-line')];
    const heading = [...document.querySelectorAll('h2')].find((h) => h.textContent === 'Payment method');
    const look = (el) => { const c = getComputedStyle(el); return { width: parseFloat(c.borderTopWidth), color: c.borderTopColor, shadow: c.boxShadow }; };
    const probe = (name) => { const p = document.createElement('span'); p.style.color = `var(${name})`; document.body.append(p); const c = getComputedStyle(p).color; p.remove(); return c; };
    const on = tiles.find((t) => t.dataset.checked !== undefined); const off = tiles.find((t) => t.dataset.checked === undefined);
    return {
      count: tiles.length, rows: new Set(tiles.map((t) => Math.round(t.getBoundingClientRect().top))).size, button: document.querySelector('.og-co__pay > .bui-button')?.dataset.variant,
      gapIn: heading ? tiles[0].getBoundingClientRect().top - heading.getBoundingClientRect().bottom : 0,
      gapOut: heading && items.length ? heading.getBoundingClientRect().top - items.at(-1).getBoundingClientRect().bottom : 0,
      radios: tiles.every((t) => t.querySelector('input[type=radio]')) && document.querySelector('[role=radiogroup]')?.getAttribute('aria-label') === 'Payment method',
      headed: !!heading && heading.getBoundingClientRect().top >= items.at(-1).getBoundingClientRect().bottom && heading.getBoundingClientRect().bottom <= tiles[0].getBoundingClientRect().top,
      on: look(on), off: look(off), selected: probe('--baseui-extensions-border-selected'), standard: probe('--baseui-border-primary'),
      items: items.map((l) => { const r = l.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, radius: parseFloat(getComputedStyle(l).borderTopLeftRadius), background: getComputedStyle(l).backgroundColor }; }),
    };
  });
  if (!phone) {
    const terms = await page.evaluate(() => { const c = document.querySelector('.og-caption--legal'); const b = c?.parentElement.querySelector('.bui-button'); return c && b ? { size: parseFloat(getComputedStyle(c).fontSize), gap: c.getBoundingClientRect().top - b.getBoundingClientRect().bottom } : null; });
    expectThat(terms && terms.size === 12 && terms.gap >= 15 && terms.gap <= 17, `desktop: the terms are not 12px and 16px from the pay button (${JSON.stringify(terms)})`);
  }
  const sum = (m) => m.width + (/\s(\d+)px\s+inset$/.exec(m.shadow)?.[1] ? +/\s(\d+)px\s+inset$/.exec(m.shadow)[1] : 0);
  expectThat(strip.count === 6 && strip.radios, `${where}: the payment methods are not six radio tiles with the others behind a button (${strip.count} tiles)`);
  expectThat(strip.button === 'secondary', `${where}: the button for the other methods is not secondary (${strip.button})`);
  if (where === 'desktop') {
    expectThat(strip.rows === 2, `desktop: six methods do not stand in two rows (${strip.rows})`);
    expectThat(strip.gapOut >= 40 && strip.gapIn >= 20, `desktop: the heading is not spaced from the items (${strip.gapOut}px) and from the methods (${strip.gapIn}px)`);
  }
  expectThat(strip.headed, `${where}: the payment methods have no heading "Payment method" of their own after the items`);
  await page.getByRole('button', { name: 'Show other payment methods' }).click();
  await page.waitForTimeout(200);
  expectThat((await page.locator('.og-methodcard').count()) === 8, `${where}: the button does not show the other payment methods`);
  expectThat(sum(strip.on) === 2 && strip.on.color === strip.selected, `${where}: the chosen method does not have a 2px outline in the selected color (${JSON.stringify(strip.on)})`);
  expectThat(sum(strip.off) === 1 && strip.off.color === strip.standard, `${where}: a method that is not chosen does not have the standard 1px outline (${JSON.stringify(strip.off)})`);
  expectThat(strip.items.length >= 2 && strip.items.every((it, i, all) => it.radius >= 12 && it.background !== 'rgba(0, 0, 0, 0)' && (i === 0 || it.top > all[i - 1].bottom)), `${where}: the items are not cards of their own, apart from each other`);
  const fee = () => page.locator('.og-sum__row', { hasText: 'Payment fee' }).textContent();
  const before = await fee();
  await page.locator('.og-methodcard', { hasText: 'Klarna' }).click();
  await page.waitForTimeout(200);
  expectThat((await fee()) !== before && (await page.locator('.og-methodcard[data-checked]').count()) === 1 && (await page.locator('.og-methodcard[data-checked]').textContent()).includes('Klarna'), `${where}: choosing another method does not move the outline and change the fee`);
  if (!phone) {
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(250);
    const top = await page.evaluate(() => Math.round(document.querySelector('.og-checkout .og-sticky').getBoundingClientRect().top));
    expectThat(top <= 32, `desktop: the summary sticks ${top}px from the top, further than 32px`);
    await page.evaluate(() => window.scrollTo(0, 0));
  }
  const row = page.locator('[data-slot="list-item"]', { hasText: 'Apply promo code' });
  expectThat((await row.count()) === 1, `${where}: the promo code is not a row of a list`);
  const shape = await row.evaluate((el) => { const icons = el.querySelectorAll('svg').length; const text = el.querySelector('span'); const chevron = el.querySelector('svg:last-of-type'); return { icons, chevronRight: !!chevron && !!text && chevron.getBoundingClientRect().left > text.getBoundingClientRect().right }; }).catch(() => ({ icons: -1, chevronRight: false }));
  expectThat(shape.icons === 1 && shape.chevronRight, `${where}: the promo row is not a text on the left and a chevron on the right and nothing else (${JSON.stringify(shape)})`);
  const pr = await page.evaluate(() => {
    const row = [...document.querySelectorAll('[data-slot="list-item"]')].find((e) => e.textContent.includes('Apply promo code'));
    const probe = document.createElement('span'); probe.style.color = 'var(--baseui-text-and-icon-secondary)'; document.body.append(probe); const sec = getComputedStyle(probe).color; probe.remove();
    const sum = document.querySelector('.og-sticky .bui-card, .og-sticky [data-slot=card]');
    const card = row.closest('.og-coupon'); const cr = card.getBoundingClientRect(); const rr = row.querySelector('button').getBoundingClientRect(); const carded = !!card && Math.abs(rr.width - cr.width) < 2 && Math.abs(rr.height - cr.height) < 2;   // the whole card is the button
    return { color: getComputedStyle(row.querySelector('[data-slot="list-item-title"]')).color, sec, carded, under: row.getBoundingClientRect().top >= sum.getBoundingClientRect().bottom, right: row.getBoundingClientRect().left >= sum.getBoundingClientRect().left - 1 };
  });
  expectThat(pr.color === pr.sec && pr.carded, `${where}: the promo row is not secondary, on a card that is one button (${JSON.stringify(pr)})`);
  expectThat(pr.under && pr.right, `${where}: the promo row is not under the summary, in its column (${JSON.stringify(pr)})`);
  expectThat((await page.locator('.bui-collapsible').count()) === 0, `${where}: the promo code is a collapsible section`);
  const promo = row.getByRole('button');
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
  const applied = page.locator('[data-slot="list-item"]', { hasText: 'Promo code' });
  expectThat((await applied.count()) === 1 && (await applied.textContent()).includes('WELCOME10') && (await applied.getByRole('button', { name: 'Remove the promo code' }).count()) === 1, `${where}: with a code applied the row has no "Promo code", the code and a cross`);
  await applied.getByRole('button', { name: 'Remove the promo code' }).click();
  await page.waitForTimeout(400);
  expectThat((await page.locator('[data-slot="list-item"]', { hasText: 'Apply promo code' }).count()) === 1 && (await page.locator('.og-sum__row--discount').count()) === 0, `${where}: the cross does not take the code off`);
  expectThat(!errors.length, `${where}: errors ${errors.join('; ')}`);
  await page.close();
}

await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nCheckout: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log('Checkout: the top with a divider, the items as cards, the payment methods under their heading, the promo code as a row with a dialog, and the green discount.');
