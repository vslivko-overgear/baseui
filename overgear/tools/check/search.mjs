#!/usr/bin/env node
// The search of the header, in a real browser. A desktop: typing opens a dropdown of suggestions under the field, the arrows move along them, Enter opens the one they are on, Escape closes the
// dropdown and leaves the text; the suggestions are one list, with no group titles; the page behind is dimmed and the dropdown has no outline. A phone: the field opens a screen of its own that covers the bottom bar, with the field in focus and no ring round it, as rule OG4 says; typing fills it with suggestions, Enter runs the search and closes it.
//
//   node overgear/tools/check/search.mjs http://localhost:8000
import { launch, ready } from '../../../tools/lib/sweep.mjs';

const base = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '');
const url = `${base}/overgear/example/index.html`;
const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const problems = [];
// one list with no group titles: a single list, and nothing in an item but its row (a title of a group would be a text that is not a row)
const oneList = (page) => page.evaluate(() => document.querySelectorAll('.og-sg').length === 1 && [...document.querySelectorAll('.og-sg > li')].every((li) => li.children.length === 1 && li.firstElementChild.getAttribute('role') === 'option' && li.textContent === li.firstElementChild.textContent));
const expectThat = (ok, what) => { if (!ok) problems.push(what); };

{
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 800 }, reducedMotion: 'reduce' })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url);
  await ready(page);
  const field = page.getByRole('combobox', { name: 'Search' });
  await field.click();
  await page.waitForTimeout(200);
  expectThat((await page.locator('.og-sg__row').count()) > 0, 'desktop: the focused empty field shows no recent or popular suggestions');
  expectThat(await oneList(page), 'desktop: the empty field shows its suggestions in groups with titles, or in more than one list');
  await field.fill('dia');
  await page.waitForTimeout(200);
  const rows = await page.locator('.og-sg__row').allTextContents();
  expectThat(rows.some((t) => t.startsWith('Diablo')), `desktop: "dia" does not suggest Diablo (${rows.join(' | ')})`);
  expectThat(rows.at(-1)?.startsWith('Search for'), 'desktop: the last suggestion is not the search of the text');
  expectThat(await oneList(page), 'desktop: the suggestions are in groups with titles');
  const box = await page.locator('.og-search__panel').boundingBox();
  const bar = await field.boundingBox();
  expectThat(box && bar && box.y >= bar.y + bar.height && Math.abs(box.x - (await page.locator('.og-search').boundingBox()).x) < 2, 'desktop: the dropdown is not under the field');
  expectThat((await page.locator('.og-scrim--search').count()) === 1 && (await page.locator('.og-scrim--search').evaluate((el) => getComputedStyle(el).backgroundColor)) !== 'rgba(0, 0, 0, 0)', 'desktop: the page behind the dropdown is not dimmed');
  expectThat((await page.locator('.og-search__panel').evaluate((el) => getComputedStyle(el).borderTopWidth)) === '0px', 'desktop: the dropdown has an outline');
  expectThat(await page.evaluate(() => { const p = document.querySelector('.og-search__panel').getBoundingClientRect(); const top = document.elementFromPoint(p.x + 40, p.y + 30); return !!top?.closest('.og-search__panel'); }), 'desktop: the dropdown is under the dimming');
  await field.press('ArrowDown');
  expectThat((await page.locator('.og-sg__row[data-active]').count()) === 1 && !!(await field.getAttribute('aria-activedescendant')), 'desktop: the arrow does not mark a suggestion');
  await field.press('Enter');
  await page.waitForTimeout(500);
  expectThat(/#\/games\/diablo/.test(await page.evaluate(() => location.hash)), 'desktop: Enter on a game suggestion does not open the game');
  await page.goto(`${url}#/`);
  await ready(page);
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
  const page = await (await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, reducedMotion: 'reduce' })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url);
  await ready(page);
  const rect = (selector) => page.evaluate((q) => { const r = document.querySelector(q).getBoundingClientRect(); return [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 10) / 10); }, selector);
  const headerLook = await page.evaluate(() => { const cell = document.querySelector('.og-header .og-search .bui-field__cell'); return { background: getComputedStyle(cell).backgroundColor, text: getComputedStyle(document.querySelector('.og-header .og-search input')).fontSize }; });
  const logo = await rect('.og-brand__mark');
  const headerField = await rect('.og-header .og-search .bui-field');
  await page.locator('.og-search input').first().click();
  await page.waitForTimeout(400);
  const screen = page.getByRole('dialog', { name: 'Search' });
  expectThat((await screen.count()) === 1, 'phone: the field does not open the screen of the search');
  expectThat(await page.evaluate(() => !!document.activeElement?.closest('.og-searchscreen')), 'phone: the field of the screen is not in focus');
  const covered = await page.evaluate(() => { const r = document.querySelector('.og-searchscreen').getBoundingClientRect(); const top = document.elementFromPoint(195, innerHeight - 20); return r.width >= innerWidth - 1 && r.height >= innerHeight - 1 && !!top?.closest('.og-searchscreen'); });
  expectThat(covered, 'phone: the screen does not cover the whole window, the bottom bar included');
  expectThat(JSON.stringify(await rect('.og-searchscreen__back')) === JSON.stringify(logo), `phone: the back button is not in the rectangle of the logo (${await rect('.og-searchscreen__back')} against ${logo})`);
  const screenField = await rect('.og-searchscreen .bui-field');
  expectThat(screenField[0] === headerField[0] && screenField[1] === headerField[1] && screenField[3] === headerField[3], `phone: the field is not at the place and of the height of the one of the header (${screenField} against ${headerField})`);
  // OG4: no ring on the field of the search screen, and focus changes nothing else in it: the size of its text and its background are those of the field of the header
  const look = (selector) => page.evaluate((q) => { const cell = document.querySelector(`${q} .bui-field__cell`); const input = document.querySelector(`${q} input`); return { outline: getComputedStyle(cell).outlineStyle, background: getComputedStyle(cell).backgroundColor, text: getComputedStyle(input).fontSize }; }, selector);
  const onScreen = await look('.og-searchscreen');
  expectThat(onScreen.outline === 'none', 'phone: the field of the search screen has an outline (OG4)');
  expectThat(onScreen.text === headerLook.text, `phone: the text of the field jumps from ${headerLook.text} to ${onScreen.text} when the screen opens (OG4)`);
  expectThat(onScreen.background === headerLook.background, 'phone: the background of the field changes when the screen opens or the field has focus (OG4)');
  expectThat(await oneList(page), 'phone: the suggestions have group titles');
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
