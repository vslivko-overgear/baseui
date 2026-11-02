#!/usr/bin/env node
// The column of games of the desktop catalog scrolls, in both places it appears: the catalog page and the panel that the Catalog button of the header opens. It turns the wheel over the list
// and expects the list (not the page) to move; a list that is cut off (overflow: hidden) or taller than its box without a scroll stays where it is.
// On a phone the catalog is that column as a page: a search and a sort, one row for each game, a rounded square picture 1:1 in every row, no chips, the list scrolls with the page, and a row opens the game.
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
  const state = await page.evaluate(() => ({ tiles: document.querySelectorAll('.og-grid--games, .og-chips, [data-slot=game-tile]').length, rows: document.querySelectorAll('.og-catalog__games [data-slot=list-item]').length, overflow: getComputedStyle(document.querySelector('.og-catalog__games')).overflowY, pics: [...document.querySelectorAll('.og-catalog__games [data-slot=list-item]')].map((r) => { const p = r.querySelector('.og-gpic'); const b = p?.getBoundingClientRect(); return !!b && Math.abs(b.width - b.height) < 0.5 && parseFloat(getComputedStyle(p).borderTopLeftRadius) >= 8 && !!p.querySelector('img'); }) }));
  if (state.tiles) problems.push('phone: the catalog has picture tiles or chips of groups');
  if (!state.pics.length || !state.pics.every(Boolean)) problems.push('phone: not every row of the catalog has a rounded square picture');
  if (state.rows < 10) problems.push(`phone: the catalog has ${state.rows} rows of games`);
  if (state.overflow !== 'visible') problems.push(`phone: the list of games is a scroller of its own (${state.overflow}), not the page`);
  // the bar of the catalog is where the bar of the header is on the other pages: the same top, height and size of text, so nothing jumps between them
  const bar = () => page.evaluate(() => { const f = document.querySelector('.og-header .og-search .bui-field, .og-catalog__left .bui-field'); const r = f.getBoundingClientRect(); return { top: Math.round(r.top), height: Math.round(r.height), text: getComputedStyle(f.querySelector('input')).fontSize }; });
  const onCatalog = await bar();
  await page.goto(`${base}/overgear/example/index.html#/`);
  await page.waitForTimeout(1200);
  const onHome = await bar();
  await page.goto(`${base}/overgear/example/index.html#/catalog`);
  await page.waitForTimeout(1200);
  if (onCatalog.top !== onHome.top || onCatalog.height !== onHome.height || onCatalog.text !== onHome.text) problems.push(`phone: the bar of the catalog (top ${onCatalog.top}, ${onCatalog.height} high, text ${onCatalog.text}) is not where the bar of the header is (top ${onHome.top}, ${onHome.height} high, text ${onHome.text})`);
  // the search and the sort stay at the top while the list scrolls
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(300);
  const stuck = await page.evaluate(() => { const r = document.querySelector('.og-catalog__left > .bui-control-row').getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom) }; });
  if (stuck.top > 0 || stuck.bottom <= 0) problems.push(`phone: the search and the sort do not stay at the top while the list scrolls (${JSON.stringify(stuck)})`);
  await page.evaluate(() => window.scrollTo(0, 0));
  // steps: a game opens its groups under a title of its own (the bar has none at the start), a group opens its kinds laid out the same way, the bar shows the title when it scrolls under it
  const step = async (name) => page.evaluate(() => { const t = document.querySelector('.og-step__title'); const bt = document.querySelector('.bui-navbar__title'); return { title: t?.textContent, hasCollapsible: !!document.querySelector('.bui-collapsible'), rows: document.querySelectorAll('main [data-slot=list-item]').length, bar: +getComputedStyle(bt).opacity, gap: t ? Math.round(t.getBoundingClientRect().top - document.querySelector('.bui-navbar').getBoundingClientRect().bottom) : null }; });
  await page.goto(`${base}/overgear/example/index.html#/catalog/wow`);
  await page.waitForTimeout(1200);
  const s2 = await step();
  if (s2.title !== 'World of Warcraft' || s2.hasCollapsible || s2.rows < 5 || s2.bar !== 0 || s2.gap > 8) problems.push(`phone: step 2 is not a title (4px from the bar, the bar has none) and a list of groups (${JSON.stringify(s2)})`);
  await page.getByRole('button', { name: 'Raids' }).click();
  await page.waitForTimeout(800);
  const s3 = await step();
  if (s3.title !== 'Raids' || s3.hasCollapsible || s3.rows < 5 || s3.bar !== 0 || s3.gap > 8) problems.push(`phone: step 3 is not laid out as step 2 (${JSON.stringify(s3)})`);
  await page.evaluate(() => { document.querySelector('main').style.minHeight = '3000px'; window.scrollTo(0, 400); });
  await page.waitForTimeout(500);
  const s3s = await step();
  if (s3s.bar !== 1) problems.push(`phone: the bar does not show the title when the heading scrolls under it (${JSON.stringify(s3s)})`);
  await page.getByRole('button', { name: 'Back' }).click();
  await page.waitForTimeout(600);
  if (!/#\/catalog\/wow$/.test(await page.evaluate(() => location.hash))) problems.push('phone: back from step 3 does not go to step 2');
  await page.goto(`${base}/overgear/example/index.html#/catalog`);
  await page.waitForTimeout(1200);
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
