#!/usr/bin/env node
// The checkout, the cart (a page) and the mini-cart (the side panel) share their parts (overgear/example/order.jsx): the lines of the items, the summary, the promo code row, the title with the count, the pay bar.
// The checkout is the latest base. This check takes the look of each shared part in the checkout (colors, sizes, radii, fonts, paddings) and expects the cart and the mini-cart to look the same,
// on a desktop and on a phone; and it expects "Add to cart" to open the mini-cart on a phone too. A part restyled in one place only (a class of a surface, a copy of a component) fails here.
//
//   node overgear/tools/check/order.mjs http://localhost:8000
import { launch } from '../../../tools/lib/sweep.mjs';

const base = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '');
const line = (key, title, price) => ({ key, id: 'venomous-abyss-heroic', title, sub: 'Piloted, heroic', price, qty: 1, eta: '3 hours' });
const STATE = JSON.stringify({ cart: [line('a', 'Venomous Abyss Heroic', 89), { ...line('b', 'Mythic+ Bundle', 149), qty: 3 }], wishlist: [], orders: [], user: { name: 'Dana', email: 'dana@example.com' }, promo: '' });
const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const problems = [];

// what a part looks like: the style properties that make it look the way it does
const LOOK = ['backgroundColor', 'borderTopLeftRadius', 'paddingTop', 'paddingLeft', 'color', 'fontSize', 'fontWeight', 'lineHeight', 'height'];
const SHARED = {
  line: '.og-lines--surface > .og-line',
  lineTitle: '.og-line__title',
  linePrice: '.og-line__price',
  lineMeta: '.og-line__meta',
  linePic: '.og-line__pic',
  qty: '.og-line__qty',
  summary: '.og-sticky > .bui-card:first-child, .og-drawer__foot .bui-card:first-child',
  sumRow: '.og-sum__row:not(.og-sum__row--big):not(.og-sum__row--soft)',
  sumBig: '.og-sum__row--big',
  sumSoft: '.og-sum__row--soft',
  coupon: '.og-coupon',
  couponText: '.og-coupon [data-slot="list-item-title"]',
  pay: '.og-sticky .bui-card:first-child .bui-button[data-variant="primary"], .og-drawer__foot .bui-button[data-variant="primary"]',
  title: '.og-order__title',
  count: '.og-order__title + .og-caption',
};
const looks = (page, phone) => page.evaluate(({ SHARED, LOOK, phone }) => {
  const out = {};
  for (const [name, sel] of Object.entries(SHARED)) {
    const el = [...document.querySelectorAll(sel)].find((e) => e.getBoundingClientRect().width > 0);
    if (!el) { out[name] = null; continue; }
    const cs = getComputedStyle(el); const o = {};
    for (const k of LOOK) o[k] = k === 'height' ? Math.round(el.getBoundingClientRect().height) : cs[k];
    if (name === 'summary' || name === 'sumRow' || name === 'sumBig' || name === 'sumSoft' || name === 'coupon' || name === 'couponText' || name === 'title' || name === 'count') delete o.height;
    out[name] = o;
  }
  return out;
}, { SHARED, LOOK, phone });

for (const [width, phone] of [[1440, false], [390, true]]) {
  const where = phone ? 'phone' : 'desktop';
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: phone });
  const open = async (hash) => {
    const page = await ctx.newPage();
    await page.addInitScript((s) => { if (!localStorage.getItem('baseui-overgear')) localStorage.setItem('baseui-overgear', s); }, STATE);
    await page.goto(`${base}/overgear/example/index.html${hash}`);
    await page.waitForTimeout(1300);
    return page;
  };
  const checkout = await open('#/checkout');
  const base0 = await looks(checkout, phone);
  const cart = await open('#/cart');
  const cartLooks = await looks(cart, phone);
  // the mini-cart: opened by the event that "Add to cart" sends; on a phone too
  const home = await open('#/offer/venomous-abyss-heroic');
  await home.getByRole('button', { name: /Add to cart/ }).first().click();
  await home.waitForTimeout(700);
  const opened = await home.locator('.og-drawer').count();
  if (!opened) problems.push(`${where}: "Add to cart" does not open the mini-cart`);
  const miniLooks = opened ? await looks(home, phone) : {};
  for (const [name, mine] of [['cart', cartLooks], ['mini-cart', miniLooks]]) {
    for (const part of Object.keys(SHARED)) {
      const a = base0[part]; const b = mine[part];
      if (!a) continue;   // the checkout does not have it (the title and the count are not in the mini-cart)
      if (!b) { if (!(name === 'mini-cart' && (part === 'title' || part === 'count' || part === 'pay' && phone))) problems.push(`${where}: the ${name} has no "${part}" as the checkout has`); continue; }
      for (const k of Object.keys(a)) {
        if (name === 'mini-cart' && part === 'summary' && k === 'backgroundColor') continue;
        if (a[k] !== b[k]) problems.push(`${where}: "${part}" of the ${name} differs from the checkout in ${k} (${b[k]} against ${a[k]})`);
      }
    }
  }
  await ctx.close();
}

await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nOrder: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log('Order: the checkout, the cart and the mini-cart look the same in their shared parts, and "Add to cart" opens the mini-cart on a desktop and on a phone.');
