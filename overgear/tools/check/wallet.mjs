#!/usr/bin/env node
// The balance of a logged-in visitor, in a real browser. A desktop: the header has one button with the money and the OG Coins, which opens the page Wallet; its button Top up opens the top-up: an amount is typed,
// paying closes the dialog, says so in a toast and the balance in the header grows; an amount under the minimum is refused with a sentence. A phone: the row Wallet of the account tab shows the same amounts
// and opens the same page; the header of a phone has no balance of its own.
//
//   node overgear/tools/check/wallet.mjs http://localhost:8000
import { launch, ready } from '../../../tools/lib/sweep.mjs';

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
  await ready(page);
  return { page, errors };
};

{
  const { page, errors } = await open({ width: 1440, height: 800 });
  const button = page.getByRole('button', { name: /^Balance / });
  expectThat((await button.count()) === 1, 'desktop: the header has no balance button');
  expectThat(/\$48\.50/.test((await button.textContent()) || '') && /3\.20/.test((await button.textContent()) || ''), 'desktop: the button does not show the money and the OG Coins');
  await button.click();
  await page.waitForTimeout(600);
  expectThat(/#\/wallet$/.test(page.url()), 'desktop: the button does not open the page Wallet');
  await page.locator('[data-test-id=wallet-top-up-page]').click();
  await page.waitForTimeout(400);
  const dialog = page.getByRole('dialog', { name: 'Top Up Balance' });
  expectThat((await dialog.count()) === 1, 'desktop: the button Top up does not open the top-up');
  await page.locator('#og-topup-amount').fill('50');
  await page.locator('[data-test-id=topup-submit]').click();
  await page.waitForTimeout(1300);
  expectThat((await dialog.count()) === 0, 'desktop: paying does not close the dialog');
  expectThat(/\$98\.50/.test((await button.textContent()) || ''), 'desktop: the balance of the header does not grow by the top-up');
  expectThat((await page.locator('[data-slot=toast]').allTextContents()).some((t) => t.includes('$50.00 added')), 'desktop: no toast says the balance grew');
  await page.locator('[data-test-id=wallet-top-up-page]').click();
  await page.waitForTimeout(300);
  await page.locator('#og-topup-amount').fill('2');
  await page.locator('[data-test-id=topup-submit]').click();
  await page.waitForTimeout(300);
  expectThat((await page.getByText('The minimum is $5').count()) === 1 && (await dialog.count()) === 1, 'desktop: an amount under the minimum is not refused with a sentence');
  expectThat(!errors.length, `desktop: errors ${errors.join('; ')}`);
}

{
  const { page, errors } = await open({ width: 390, height: 800 }, '#/account');
  expectThat((await page.getByRole('button', { name: /^Balance / }).count()) === 0, 'phone: the header of a phone has a balance button');
  const row = page.locator('[data-test-id=account-menu-wallet]');
  expectThat((await row.count()) === 1 && /\$48\.50/.test(await row.textContent()) && /3\.20/.test(await row.textContent()), 'phone: the account tab has no row Wallet with the money and the OG Coins');
  await row.click();
  await page.waitForTimeout(600);
  expectThat(/#\/wallet$/.test(page.url()), 'phone: the row Wallet does not open the page Wallet');
  await page.locator('[data-test-id=wallet-top-up-page]').click();
  await page.waitForTimeout(400);
  expectThat((await page.getByRole('dialog', { name: 'Top Up Balance' }).count()) === 1, 'phone: the Top up button does not open the top-up');
  await page.locator('#og-topup-amount').fill('25');
  await page.locator('[data-test-id=topup-submit]').click();
  await page.waitForTimeout(1300);
  expectThat(/\$73\.50/.test(await page.locator('[data-test-id=wallet-balance]').textContent()), 'phone: the page does not show the grown balance');
  expectThat(!errors.length, `phone: errors ${errors.join('; ')}`);
}

await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nWallet: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log('Wallet: the balance and the top-up work on a desktop and on a phone.');
