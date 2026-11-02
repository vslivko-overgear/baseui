#!/usr/bin/env node
// The column of games of the desktop catalog scrolls, in both places it appears: the catalog page and the panel that the Catalog button of the header opens. It turns the wheel over the list
// and expects the list (not the page) to move; a list that is cut off (overflow: hidden) or taller than its box without a scroll stays where it is.
// On a phone the catalog is that column as a page: a search and a sort, one row for each game, no pictures and no chips, the list scrolls with the page, and a row opens the game.
//
//   node overgear/tools/check/catalog.mjs http://localhost:8000
import { launch } from '../../../tools/lib/sweep.mjs';

const base = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '');
const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const problems = [];
for (const height of [900, 620]) {
  for (const place of ['page', 'panel']) {
    const page = await (await browser.newContext({ viewport: { width: 1440, height } })).newPage();
    await page.goto(`${base}/overgear/example/index.html#/${place === 'page' ? 'catalog' : ''}`);
    await page.waitForTimeout(1500);
    if (place === 'panel') { await page.getByRole('button', { name: 'Catalog' }).first().click(); await page.waitForTimeout(800); }
    const list = await page.$('.og-catalog__games');
    if (!list) { problems.push(`${place} @${height}: no list of games`); await page.close(); continue; }
    const box = await list.boundingBox();
    const { scrollHeight, clientHeight } = await list.evaluate((el) => ({ scrollHeight: el.scrollHeight, clientHeight: el.clientHeight }));
    await page.mouse.move(box.x + 50, box.y + 60);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(300);
    const top = await list.evaluate((el) => el.scrollTop);
    if (scrollHeight > clientHeight && top === 0) problems.push(`${place} @${height}: the list of games does not scroll (${scrollHeight}px in a box of ${clientHeight}px)`);
    await page.close();
  }
}
{
  const page = await (await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${base}/overgear/example/index.html#/catalog`);
  await page.waitForTimeout(1500);
  const state = await page.evaluate(() => ({ tiles: document.querySelectorAll('.og-grid--games, .og-chips, [data-slot=game-tile]').length, rows: document.querySelectorAll('.og-catalog__games [data-slot=list-item]').length, overflow: getComputedStyle(document.querySelector('.og-catalog__games')).overflowY, images: document.querySelectorAll('.og-catalog__games img').length }));
  if (state.tiles) problems.push('phone: the catalog has picture tiles or chips of groups');
  if (state.images) problems.push('phone: the rows of the catalog have pictures');
  if (state.rows < 10) problems.push(`phone: the catalog has ${state.rows} rows of games`);
  if (state.overflow !== 'visible') problems.push(`phone: the list of games is a scroller of its own (${state.overflow}), not the page`);
  await page.getByLabel('Find a game').fill('dia');
  await page.waitForTimeout(300);
  const found = await page.locator('.og-catalog__games [data-slot=list-item]').allTextContents();
  if (!found.length || !found.every((t) => /dia/i.test(t))) problems.push('phone: the search of the catalog does not filter the games');
  await page.getByText('Diablo 4', { exact: true }).first().click();
  await page.waitForTimeout(500);
  if (!/#\/catalog\/diablo-4$/.test(await page.evaluate(() => location.hash))) problems.push('phone: a row of the catalog does not open the game');
  if (errors.length) problems.push(`phone: errors ${errors.join('; ')}`);
}

await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nCatalog: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log('Catalog: the list of games scrolls on the page and in the panel, and a phone has it as a page.');
