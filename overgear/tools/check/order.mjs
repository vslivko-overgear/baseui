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
// the mini-cart has no summary block and no title of the page: the price, the bonus and the button are the pinned bar of the phone, and the promo code is a card in the list
const MINI_WITHOUT = new Set(['title', 'count', 'summary', 'sumRow', 'sumBig', 'sumSoft', 'pay']);
// the bar exists on a phone in the checkout and the cart; on a desktop only the mini-cart has it, so there it is compared with the one of the phone
const BAR = ['paybar', 'payAmount', 'payBadge', 'payButton'];
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
  paybar: '.og-paybar',
  payAmount: '.og-paybar__amount',
  payBadge: '.og-paybar .bui-badge, .og-paybar [data-slot=badge]',
  payButton: '.og-paybar .bui-button',
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
  const c = document.querySelector('.og-coupon');
  out._couponHeight = c ? Math.round(c.getBoundingClientRect().height) : null;
  return out;
}, { SHARED, LOOK, phone });

let barBase = {};   // the look of the pay bar in the checkout of a phone
for (const [width, phone] of [[390, true], [1440, false]]) {
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
  if (phone) barBase = base0;
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
      if (part.startsWith('_')) continue;
      if (name === 'mini-cart' && part === 'paybar') continue;   // the bar of the panel is pinned in the panel, not in the screen: its parts are compared
      const a = (name === 'mini-cart' && BAR.includes(part) ? barBase : base0)[part]; const b = mine[part];
      if (!a) continue;   // the checkout does not have it
      if (!b) { if (!(name === 'mini-cart' && MINI_WITHOUT.has(part))) problems.push(`${where}: the ${name} has no "${part}" as the checkout has`); continue; }
      for (const k of Object.keys(a)) {
        if (a[k] !== b[k]) problems.push(`${where}: "${part}" of the ${name} differs from the checkout in ${k} (${b[k]} against ${a[k]})`);
      }
    }
  }
  for (const [name, mine] of [['checkout', base0], ['cart', cartLooks], ['mini-cart', miniLooks]]) {
    if (mine._couponHeight !== 56) problems.push(`${where}: the promo code row of the ${name} is ${mine._couponHeight}px high, not as high as the large button (56px)`);
  }
  if (opened) {
    // the mini-cart: the pay bar (the price, the bonus, the button) pinned at the bottom of the panel, the promo code in the list that scrolls, no summary block
    const mini = await home.evaluate(() => {
      const d = document.querySelector('.og-drawer').getBoundingClientRect(); const bar = document.querySelector('.og-drawer .og-paybar')?.getBoundingClientRect();
      const body = document.querySelector('.og-drawer__body'); const coupon = document.querySelector('.og-drawer .og-coupon');
      return { pinned: !!bar && Math.abs(bar.bottom - d.bottom) <= 1, hasAll: !!document.querySelector('.og-drawer .og-paybar__amount') && !!document.querySelector('.og-drawer .og-paybar .bui-badge, .og-drawer .og-paybar [data-slot=badge]') && !!document.querySelector('.og-drawer .og-paybar .bui-button'), couponInList: !!coupon && body.contains(coupon), summary: !!document.querySelector('.og-drawer .og-sum__row') };
    });
    if (!mini.pinned || !mini.hasAll) problems.push(`${where}: the mini-cart has no pay bar (price, bonus, button) pinned at the bottom (${JSON.stringify(mini)})`);
    if (!mini.couponInList) problems.push(`${where}: the promo code of the mini-cart is not a card in the list that scrolls`);
    if (mini.summary) problems.push(`${where}: the mini-cart has a summary block`);
  }
  await ctx.close();
}

await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nOrder: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log('Order: the checkout, the cart and the mini-cart look the same in their shared parts, and "Add to cart" opens the mini-cart on a desktop and on a phone.');
