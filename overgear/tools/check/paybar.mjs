#!/usr/bin/env node
// The pay bar of a phone: in the cart and in the checkout the button that pays is pinned to the bottom of the screen (in the cart over the bottom bar of the tabs), with what is to pay beside it;
// it stays where it is while the page scrolls, the content can be scrolled clear of it, and the page has no second button for the same action. On a desktop there is no bar: the button stays in the summary.
//
//   node overgear/tools/check/paybar.mjs http://localhost:8000
import { launch } from '../../../tools/lib/sweep.mjs';

const base = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '');
const url = `${base}/overgear/example/index.html`;
const line = (key, title, price) => ({ key, id: 'venomous-abyss-heroic', title, sub: 'Piloted, heroic', price, qty: 1, eta: '3 hours' });
const STATE = JSON.stringify({ cart: [line('a', 'Venomous Abyss Heroic', 89), line('b', 'Mythic+ Bundle', 149), line('c', 'Power Leveling', 39), line('d', 'Gold 500K', 24)], wishlist: [], orders: [], user: { name: 'Dana', email: 'dana@example.com' }, promo: '' });
const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const problems = [];
const expectThat = (ok, what) => { if (!ok) problems.push(what); };
const open = async (viewport, hash) => {
  const page = await (await browser.newContext({ viewport, hasTouch: viewport.width < 500 })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript((s) => { if (!localStorage.getItem('baseui-overgear')) localStorage.setItem('baseui-overgear', s); }, STATE);
  await page.goto(`${url}${hash}`);
  await page.waitForTimeout(1500);
  return { page, errors };
};
const bar = (page) => page.evaluate(() => { const p = document.querySelector('.og-paybar'); if (!p) return null; const r = p.getBoundingClientRect(); const tabs = document.querySelector('.og-bottom'); return { top: Math.round(r.top), bottom: Math.round(r.bottom), vh: innerHeight, tabsTop: tabs ? Math.round(tabs.getBoundingClientRect().top) : null, text: p.textContent, button: p.querySelector('button')?.textContent.trim() }; });
const primaries = (page, name) => page.evaluate((n) => [...document.querySelectorAll('.bui-button[data-variant="primary"]')].filter((b) => b.textContent.trim() === n && b.getBoundingClientRect().width > 0).length, name);

for (const [hash, action, label, tabs] of [['#/cart', 'Secure checkout', 'Subtotal', true], ['#/checkout', 'Pay', 'Amount to pay', false]]) {
  const { page, errors } = await open({ width: 390, height: 800 }, hash);
  const first = await bar(page);
  expectThat(!!first, `phone ${hash}: no pay bar`);
  if (first) {
    expectThat(first.button === action && first.text.includes(label) && /\$\d/.test(first.text), `phone ${hash}: the bar does not hold "${label}", an amount and "${action}" (${first.text})`);
    expectThat(tabs ? first.bottom <= first.tabsTop + 1 : first.bottom === first.vh, `phone ${hash}: the bar is not ${tabs ? 'over the bottom bar of the tabs' : 'at the bottom of the screen'} (${first.bottom} against ${tabs ? first.tabsTop : first.vh})`);
    expectThat((await primaries(page, action)) === 1, `phone ${hash}: the page has a second "${action}" button`);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    const last = await bar(page);
    expectThat(last && last.top === first.top, `phone ${hash}: the bar moves with the page`);
    // the end of the page is clear of the bar: the last content is above it
    const clear = await page.evaluate(() => { const p = document.querySelector('.og-paybar').getBoundingClientRect().top; const leaves = [...document.querySelectorAll('.og > *:not(.og-bottom):not(.og-header) *, .og-checkout *')].filter((e) => !e.children.length && !e.closest('.og-paybar') && !e.closest('.og-bottom') && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().height > 0 && getComputedStyle(e).position !== 'fixed'); const bottom = Math.max(...leaves.map((e) => e.getBoundingClientRect().bottom)); return { bottom: Math.round(bottom), bar: Math.round(p) }; });
    expectThat(clear.bottom <= clear.bar + 1, `phone ${hash}: the end of the page is behind the bar (the last content ends at ${clear.bottom}, the bar starts at ${clear.bar})`);
  }
  if (hash === '#/checkout' && first) {
    await page.getByRole('button', { name: 'Pay', exact: true }).click();
    await page.waitForTimeout(800);
    expectThat(/#\/order\//.test(await page.evaluate(() => location.hash)), 'phone #/checkout: the button of the bar does not pay');
  }
  expectThat(!errors.length, `phone ${hash}: errors ${errors.join('; ')}`);
  await page.close();
}

for (const [hash, action] of [['#/cart', 'Secure checkout'], ['#/checkout', 'Pay']]) {
  const { page } = await open({ width: 1440, height: 800 }, hash);
  expectThat((await page.locator('.og-paybar').count()) === 0, `desktop ${hash}: there is a pay bar`);
  expectThat((await primaries(page, action)) === 1, `desktop ${hash}: the button is not in the summary`);
  await page.close();
}

await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nPay bar: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log('Pay bar: pinned in the cart and in the checkout of a phone, in the summary on a desktop.');
