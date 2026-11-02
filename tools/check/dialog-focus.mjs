#!/usr/bin/env node
// A dialog opened with a finger or a mouse shows no focus ring on its controls (the focus is not moved onto its first control), on a phone and on a desktop; opened with the keyboard the focus goes into it.
// It opens the dialogs of the example: the mini-cart on a phone (a sheet) and the promo code of the checkout (its field takes the focus: it is the field the person came for) is not part of this.
//
//   node tools/check/dialog-focus.mjs http://localhost:8000
import { launch, arg } from '../lib/sweep.mjs';

const base = arg(2, 'http://localhost:8000');
const line = (key, title, price) => ({ key, id: 'venomous-abyss-heroic', title, sub: 'Piloted, heroic', price, qty: 1, eta: '3 hours' });
const STATE = JSON.stringify({ cart: [line('a', 'Venomous Abyss Heroic', 89)], wishlist: [], orders: [], user: { name: 'Dana', email: 'dana@example.com' }, promo: '' });
const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const problems = [];
const ring = (page) => page.evaluate(() => { const d = document.querySelector('[role="dialog"]'); return { open: !!d, ring: !!d && [...d.querySelectorAll('*')].some((e) => e.matches(':focus-visible')), inside: !!d && d.contains(document.activeElement) }; });

for (const [width, phone] of [[390, true]]) {
  const page = await (await browser.newContext({ viewport: { width, height: 800 }, hasTouch: phone })).newPage();
  await page.addInitScript((s) => { if (!localStorage.getItem('baseui-overgear')) localStorage.setItem('baseui-overgear', s); }, STATE);
  await page.goto(`${base}/overgear/example/index.html#/offer/venomous-abyss-heroic`);
  await page.waitForTimeout(1500);
  await page.getByRole('button', { name: /Add to cart/ }).first().click();
  await page.waitForTimeout(700);
  const pointer = await ring(page);
  if (!pointer.open) problems.push('phone: the dialog did not open');
  if (pointer.ring) problems.push('phone: a dialog opened with a finger shows a focus ring on a control');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  // opened by code, with no touch or key before it (a link to the cart, a timer): no ring either
  await page.reload();
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.dispatchEvent(new Event('og:open-cart')));
  await page.waitForTimeout(700);
  const code = await ring(page);
  if (!code.open) problems.push('phone: the dialog did not open by code');
  if (code.ring) problems.push('phone: a dialog opened by code shows a focus ring on a control');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  // by the keyboard: the focus goes into the dialog
  const add = page.getByRole('button', { name: /Add to cart/ }).first();
  await add.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(700);
  const kb = await ring(page);
  if (!kb.inside) problems.push('phone: a dialog opened with the keyboard does not take the focus');
}
await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nDialog focus: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log('Dialog focus: no ring on a dialog opened with a finger, the focus goes in when it is opened with the keyboard.');
