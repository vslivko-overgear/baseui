#!/usr/bin/env node
// Runs the constitution audit (src/constitution/audit.js, the rules marked check: auto) on the example products and on the showcase of Overgear, in a real browser,
// and prints what it finds. Needs Playwright (npm i -D playwright) and the repository served over HTTP:
//
//   python3 -m http.server 8000 &
//   node tools/check/constitution.mjs http://localhost:8000 [path …]     # default: the pages of Overgear and the form templates below
//
// Each page is checked on a wide and a narrow screen. The exit code is 1 when something is found, so it can run in CI.
import { launch, sweep, report, arg } from '../lib/sweep.mjs';

const base = arg(2, 'http://localhost:8000');
const PAGES = ['overgear/#/theme', 'overgear/#/typography', 'overgear/#/colors', 'overgear/example/#/', 'overgear/example/#/games/wow', 'overgear/example/#/offer/venomous-abyss-heroic', 'overgear/example/#/catalog', 'overgear/example/#/catalog/wow', 'overgear/example/#/account', 'overgear/example/#/info/terms', 'templates/frame/?t=contact-form', 'templates/frame/?t=two-column-form', 'templates/frame/?t=checkout-form', 'templates/frame/?t=checkout-wizard', 'templates/frame/?t=settings-form', 'templates/frame/?t=login-simple'];
const paths = process.argv.slice(3).length ? process.argv.slice(3) : PAGES;

const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const audit = (page) => page.evaluate(async () => {
  const m = await import('/src/constitution/audit.js');
  const tabs = await import('/src/constitution/audit-tabs.js');
  // the static audit first, then the one that presses the tabs (D17); it puts the page back
  return [...m.auditConstitution(document.body), ...(await tabs.auditTabs(document.body))].map((v) => ({ id: v.id, note: v.note }));
});
const key = (r) => `${r.id.padEnd(4)} ${r.note}`;
const found = await sweep({ browser, base, paths, widths: [1500, 390], settle: 1800, audit, key });

// The pages of the example as a logged-in visitor with a cart (the header has a balance, the cart and the checkout have lines): the pages above have a visitor with nothing in them.
// Only when no path was given on the command line.
// The orders are the seed of the example (made here, so the audit knows their links): the list, and the page of an order in a few statuses.
import { seedOrders } from '../../overgear/example/order-seed.js';
const SEED = seedOrders(Date.now());
const linkOf = (status, og) => SEED.find((o) => o.status === status && (og === undefined || !!o.og === og)).link;
const LOGGED_IN = ['overgear/example/#/', 'overgear/example/#/cart', 'overgear/example/#/checkout', 'overgear/example/#/account', 'overgear/example/#/orders', 'overgear/example/#/orders?demo=error', 'overgear/example/#/orders?demo=empty',
  `overgear/example/#/order/${linkOf('status/NEW', true)}`, `overgear/example/#/order/${linkOf('status/IN_PROGRESS', true)}`, `overgear/example/#/order/${linkOf('status/CONFIRM_DELIVERY')}`, `overgear/example/#/order/${linkOf('status/COMPLETED', true)}`,
  `overgear/example/#/order/${linkOf('status/UNDER_REVIEW')}`, `overgear/example/#/order/${linkOf('status/CANCELLED')}`, 'overgear/example/#/checkout/result/success', 'overgear/example/#/checkout/result/check', 'overgear/example/#/checkout/result/error'];
let more = 0;
if (!process.argv.slice(3).length) {
  const line = (key, title, price) => ({ key, id: 'venomous-abyss-heroic', title, sub: 'Piloted, heroic', price, qty: 1, eta: '3 hours' });
  const state = JSON.stringify({ cart: [line('a', 'Venomous Abyss Heroic', 89), line('b', 'Mythic+ Bundle', 149)], wishlist: [], orders: SEED, user: { name: 'Dana', email: 'dana@example.com' }, promo: '' });
  const again = await sweep({ browser, base, paths: LOGGED_IN, widths: [1500, 390], settle: 1800, audit, key, init: [(s) => { if (!localStorage.getItem('baseui-overgear')) localStorage.setItem('baseui-overgear', s); }, state] });
  for (const [k, where] of again) { if (!found.has(k)) found.set(k, new Set()); for (const w of where) found.get(k).add(`${w} (logged in)`); }
  more = LOGGED_IN.length;
}
await browser.close();
process.exit(report(found, { name: 'Constitution audit', pages: paths.length + more, clean: 'nothing found', noun: 'finding' }));
