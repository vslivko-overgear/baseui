#!/usr/bin/env node
// A hint (the question mark beside a label) works where there is no hover (rule U10): on a phone a tap opens a dialog with the text, with no header and a button that closes it;
// with a mouse it is a tooltip and opens no dialog. It opens the hint of the cashback in the checkout of the example, on a phone and on a desktop.
//
//   node tools/check/hint.mjs http://localhost:8000
import { launch, arg } from '../lib/sweep.mjs';

const base = arg(2, 'http://localhost:8000');
const line = (key, title, price) => ({ key, id: 'venomous-abyss-heroic', title, sub: 'Piloted, heroic', price, qty: 1, eta: '3 hours' });
const STATE = JSON.stringify({ cart: [line('a', 'Venomous Abyss Heroic', 89)], wishlist: [], orders: [], user: { name: 'Dana', email: 'dana@example.com' }, promo: '' });
const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const problems = [];

for (const [width, phone] of [[390, true], [1440, false]]) {
  const where = phone ? 'phone' : 'desktop';
  const page = await (await browser.newContext({ viewport: { width, height: 800 }, hasTouch: phone })).newPage();
  await page.addInitScript((s) => { if (!localStorage.getItem('baseui-overgear')) localStorage.setItem('baseui-overgear', s); }, STATE);
  await page.goto(`${base}/overgear/example/index.html#/checkout`);
  await page.waitForTimeout(1500);
  const hint = page.locator('[data-slot="hint"]').first();
  if (!(await hint.count())) { problems.push(`${where}: no hint on the page`); await page.close(); continue; }
  await hint.scrollIntoViewIfNeeded();
  if (phone) {
    await hint.tap();
    await page.waitForTimeout(600);
    const dialog = await page.evaluate(() => { const d = document.querySelector('[role="dialog"]'); return d ? { text: d.textContent, header: !!d.querySelector('.bui-dialog__header'), close: [...d.querySelectorAll('button')].some((b) => /close/i.test(b.textContent)), tooltip: !!document.querySelector('[role="tooltip"]') } : null; });
    if (!dialog) problems.push('phone: a tap on the hint opens nothing');
    else {
      if (!/Cashback is credited/.test(dialog.text)) problems.push(`phone: the dialog of the hint has not the text of the hint (${dialog.text})`);
      if (dialog.header) problems.push('phone: the dialog of the hint has a header');
      if (!dialog.close) problems.push('phone: the dialog of the hint has no Close button');
      if (dialog.tooltip) problems.push('phone: a tooltip shows on a phone');
      await page.getByRole('button', { name: 'Close' }).last().click();
      await page.waitForTimeout(600);
      if (await page.locator('[role="dialog"]').count()) problems.push('phone: the Close button does not close the dialog of the hint');
    }
  } else {
    await hint.hover();
    await page.waitForTimeout(700);
    const tip = await page.evaluate(() => ({ tooltip: /Cashback is credited/.test(document.querySelector('[role="tooltip"]')?.textContent || ''), dialog: !!document.querySelector('[role="dialog"]') }));
    if (!tip.tooltip) problems.push('desktop: the hint shows no tooltip on hover');
    if (tip.dialog) problems.push('desktop: the hint opens a dialog');
  }
  await page.close();
}
// every tag of the cashback (the light yellow badge) explains itself: it is inside a hint, and a tap on it opens the same dialog
for (const hash of ['#/offer/venomous-abyss-heroic', '#/checkout', '#/cart']) {
  const page = await (await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true })).newPage();
  await page.addInitScript((s) => { if (!localStorage.getItem('baseui-overgear')) localStorage.setItem('baseui-overgear', s); }, STATE);
  await page.goto(`${base}/overgear/example/index.html${hash}`);
  await page.waitForTimeout(1500);
  const tags = await page.evaluate(() => [...document.querySelectorAll('.bui-badge--warning-light')].map((b) => !!b.closest('[data-slot="hint"]')));
  if (!tags.length) problems.push(`phone ${hash}: no tag of the cashback on the page`);
  if (tags.some((x) => !x)) problems.push(`phone ${hash}: a tag of the cashback does not explain itself (it is not a hint)`);
  const tag = page.locator('[data-slot="hint"] .bui-badge--warning-light').first();
  if (await tag.count()) {
    await tag.scrollIntoViewIfNeeded();
    await tag.tap();
    await page.waitForTimeout(600);
    const text = await page.evaluate(() => document.querySelector('[role="dialog"]')?.textContent || '');
    if (!/Cashback is credited/.test(text)) problems.push(`phone ${hash}: a tap on the tag of the cashback does not open its hint (${text.slice(0, 40)})`);
  }
  await page.close();
}
await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nHint: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log('Hint: a dialog with the text and a Close button on a phone, a tooltip with a mouse.');
