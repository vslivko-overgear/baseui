#!/usr/bin/env node
// The games of the home page on a desktop are a grid of equal columns that fits the width with no scroll, for every audience: twelve tiles in two rows, all of one width, and the grid is not wider than its box.
// It reads the rendered page, so it catches what the lists in overgear/tests/catalog.test.mjs cannot: a width that did not apply, a tile that wrapped, a scroll that came back. A phone is not measured: there the rows scroll on purpose.
//
//   node overgear/tools/check/tiles.mjs http://localhost:8000
import { launch } from '../../../tools/lib/sweep.mjs';
import { AUDIENCES } from '../../audience.js';
import { COOKIE } from '../../theme.js';

const base = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '');
const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const problems = [];
for (const [audience] of AUDIENCES) {
  const context = await browser.newContext({ viewport: { width: 1500, height: 900 } });
  await context.addCookies([{ name: COOKIE, value: encodeURIComponent(JSON.stringify({ audience })), url: base }]);
  const page = await context.newPage();
  await page.goto(`${base}/overgear/example/index.html`);
  await page.waitForTimeout(1500);
  const grid = await page.evaluate(() => {
    const el = document.querySelector('[data-test-id=home-games]');
    if (!el) return null;
    const tiles = [...el.children].map((t) => t.getBoundingClientRect());
    return { count: tiles.length, widths: tiles.map((t) => Math.round(t.width)), rows: new Set(tiles.map((t) => Math.round(t.top))).size, scrolls: el.scrollWidth > el.clientWidth + 1 };
  });
  if (!grid) problems.push(`${audience}: no grid of games found`);
  else {
    if (grid.rows !== 2) problems.push(`${audience}: ${grid.rows} rows instead of two`);
    if (grid.count !== 12) problems.push(`${audience}: ${grid.count} tiles instead of twelve`);
    if (Math.max(...grid.widths) - Math.min(...grid.widths) > 1) problems.push(`${audience}: the tiles are not of one width (${[...new Set(grid.widths)].join(', ')}px)`);
    if (grid.scrolls) problems.push(`${audience}: the grid scrolls sideways`);
  }
  await context.close();
}
await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nTiles: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log(`Tiles: ${AUDIENCES.length} audiences, twelve tiles of one width in two rows, no scroll.`);
