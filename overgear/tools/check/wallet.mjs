#!/usr/bin/env node
// The balance of a logged-in visitor, in a real browser. A desktop: the header has one button with the money and the OG Coins and a plus, which opens the top-up; a preset fills the amount,
// paying closes the dialog, says so in a toast and the balance in the header grows; an amount under the minimum is refused with a sentence. A phone: the account tab has a card with the same
// amounts and a Top up button that opens the same dialog; the header of a phone has no balance of its own.
//
//   node overgear/tools/check/wallet.mjs http://localhost:8000
import { launch } from '../../../tools/lib/sweep.mjs';

const base = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '');
const url = `${base}/overgear/example/index.html`;
// a browser that kept its state before the wallet existed: logged in, and no wallet in it
const STATE = JSON.stringify({ cart: [], wishlist: [], orders: [], user: { name: 'Dana', email: 'dana@example.com' }, promo: '' });
const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const problems = [];
const expectThat = (ok, what) => { if (!ok) problems.push(what); };
const open = async (viewport, hash = '') => {
  const page = await (await browser.newContext({ viewport, hasTouch: viewport.width < 500 })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript((s) => { if (!localStorage.getItem('baseui-overgear')) localStorage.setItem('baseui-overgear', s); }, STATE);
  await page.goto(`${url}${hash}`);
  await page.waitForTimeout(1500);
  return { page, errors };
};

{
  const { page, errors } = await open({ width: 1440, height: 800 });
  const button = page.getByRole('button', { name: /^Balance .* Top up$/ });
  expectThat((await button.count()) === 1, 'desktop: the header has no balance button');
  expectThat(/\$48\.50/.test((await button.textContent()) || '') && /3\.20/.test((await button.textContent()) || ''), 'desktop: the button does not show the money and the OG Coins');
  await button.click();
  await page.waitForTimeout(400);
  const dialog = page.getByRole('dialog', { name: 'Top up your balance' });
  expectThat((await dialog.count()) === 1, 'desktop: the button does not open the top-up');
  await page.getByText('$50', { exact: true }).click();
  expectThat((await page.locator('#og-topup-amount').inputValue()) === '50', 'desktop: a preset does not fill the amount');
  await page.getByRole('button', { name: 'Pay $50.00' }).click();
  await page.waitForTimeout(1300);
  expectThat((await dialog.count()) === 0, 'desktop: paying does not close the dialog');
  expectThat(/\$98\.50/.test((await button.textContent()) || ''), 'desktop: the balance of the header does not grow by the top-up');
  expectThat((await page.locator('[data-slot=toast]').allTextContents()).some((t) => t.includes('$50.00 added')), 'desktop: no toast says the balance grew');
  await button.click();
  await page.waitForTimeout(300);
  await page.locator('#og-topup-amount').fill('2');
  await page.getByRole('button', { name: /^Pay/ }).click();
  await page.waitForTimeout(300);
  expectThat((await page.getByText('The minimum is $5').count()) === 1 && (await dialog.count()) === 1, 'desktop: an amount under the minimum is not refused with a sentence');
  expectThat(!errors.length, `desktop: errors ${errors.join('; ')}`);
}

{
  const { page, errors } = await open({ width: 390, height: 800 }, '#/account');
  expectThat((await page.getByRole('button', { name: /^Balance .* Top up$/ }).count()) === 0, 'phone: the header of a phone has a balance button');
  const card = page.locator('.og-balance');
  expectThat((await card.count()) === 1 && /\$48\.50/.test(await card.textContent()) && /3\.20/.test(await card.textContent()), 'phone: the account tab has no card with the money and the OG Coins');
  await page.getByRole('button', { name: 'Top up' }).click();
  await page.waitForTimeout(400);
  expectThat((await page.getByRole('dialog', { name: 'Top up your balance' }).count()) === 1, 'phone: the Top up button does not open the top-up');
  await page.getByRole('button', { name: 'Pay $25.00' }).click();
  await page.waitForTimeout(1300);
  expectThat(/\$73\.50/.test(await card.textContent()), 'phone: the card does not show the grown balance');
  expectThat(!errors.length, `phone: errors ${errors.join('; ')}`);
}

await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nWallet: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log('Wallet: the balance and the top-up work on a desktop and on a phone.');
