#!/usr/bin/env node
// The column of games of the desktop catalog scrolls, in both places it appears: the catalog page and the panel that the Catalog button of the header opens. It turns the wheel over the list
// and expects the list (not the page) to move; a list that is cut off (overflow: hidden) or taller than its box without a scroll stays where it is.
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
await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nCatalog: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log('Catalog: the list of games scrolls on the page and in the panel.');
