#!/usr/bin/env node
// The search of the header, in a real browser. A desktop: typing opens a dropdown of suggestions under the field, the arrows move along them, Enter opens the one they are on, Escape closes the
// dropdown and leaves the text. A phone: the field opens a screen of its own that covers the bottom bar, with the field in focus; typing fills it with suggestions, Enter runs the search and closes it.
//
//   node overgear/tools/check/search.mjs http://localhost:8000
import { launch } from '../../../tools/lib/sweep.mjs';

const base = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '');
const url = `${base}/overgear/example/index.html`;
const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const problems = [];
const expectThat = (ok, what) => { if (!ok) problems.push(what); };

{
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 800 } })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url);
  await page.waitForTimeout(1500);
  const field = page.getByRole('combobox', { name: 'Search' });
  await field.click();
  await page.waitForTimeout(200);
  expectThat((await page.locator('.og-sg__row').count()) > 0, 'desktop: the focused empty field shows no recent or popular suggestions');
  await field.fill('dia');
  await page.waitForTimeout(200);
  const rows = await page.locator('.og-sg__row').allTextContents();
  expectThat(rows.some((t) => t.startsWith('Diablo')), `desktop: "dia" does not suggest Diablo (${rows.join(' | ')})`);
  expectThat(rows.at(-1)?.startsWith('Search for'), 'desktop: the last suggestion is not the search of the text');
  const box = await page.locator('.og-search__panel').boundingBox();
  const bar = await field.boundingBox();
  expectThat(box && bar && box.y >= bar.y + bar.height && Math.abs(box.x - (await page.locator('.og-search').boundingBox()).x) < 2, 'desktop: the dropdown is not under the field');
  await field.press('ArrowDown');
  expectThat((await page.locator('.og-sg__row[data-active]').count()) === 1 && !!(await field.getAttribute('aria-activedescendant')), 'desktop: the arrow does not mark a suggestion');
  await field.press('Enter');
  await page.waitForTimeout(500);
  expectThat(/#\/games\/diablo/.test(await page.evaluate(() => location.hash)), 'desktop: Enter on a game suggestion does not open the game');
  await page.goto(`${url}#/`);
  await page.waitForTimeout(1200);
  await field.click();
  await field.fill('raid');
  await field.press('Escape');
  await page.waitForTimeout(200);
  expectThat((await page.locator('.og-search__panel').count()) === 0 && (await field.inputValue()) === 'raid', 'desktop: Escape does not close the dropdown and keep the text');
  await field.press('Enter');
  await page.waitForTimeout(400);
  expectThat((await page.evaluate(() => location.hash)).startsWith('#/search?q=raid'), 'desktop: Enter without a chosen suggestion does not run the search');
  expectThat(!errors.length, `desktop: errors ${errors.join('; ')}`);
}

{
  const page = await (await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url);
  await page.waitForTimeout(1500);
  await page.locator('.og-search input').first().click();
  await page.waitForTimeout(400);
  const screen = page.getByRole('dialog', { name: 'Search' });
  expectThat((await screen.count()) === 1, 'phone: the field does not open the screen of the search');
  expectThat(await page.evaluate(() => !!document.activeElement?.closest('.og-searchscreen')), 'phone: the field of the screen is not in focus');
  const covered = await page.evaluate(() => { const r = document.querySelector('.og-searchscreen').getBoundingClientRect(); const top = document.elementFromPoint(195, innerHeight - 20); return r.width >= innerWidth - 1 && r.height >= innerHeight - 1 && !!top?.closest('.og-searchscreen'); });
  expectThat(covered, 'phone: the screen does not cover the whole window, the bottom bar included');
  await page.keyboard.type('path');
  await page.waitForTimeout(300);
  expectThat((await page.locator('.og-sg__row').allTextContents()).some((t) => t.startsWith('Path of Exile')), 'phone: "path" does not suggest Path of Exile');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  expectThat((await page.evaluate(() => location.hash)).startsWith('#/search?q=path') && (await screen.count()) === 0, 'phone: Enter does not run the search and close the screen');
  await page.locator('.og-search input').first().click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: 'Close the search' }).click();
  await page.waitForTimeout(300);
  expectThat((await screen.count()) === 0, 'phone: the back button does not close the screen');
  expectThat(!errors.length, `phone: errors ${errors.join('; ')}`);
}

await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nSearch: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log('Search: the dropdown on a desktop and the screen on a phone work.');
