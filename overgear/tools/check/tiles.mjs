#!/usr/bin/env node
// The game tiles of the home page end in a rectangle: for every audience, the first level and the second level of tiles end at the same place (the right edge of their last tile),
// in the group of an audience and in the rest. It reads the rendered page, so it catches what the lengths in overgear/tests/audience.test.mjs cannot: a width that did not apply,
// a tile that wrapped. A phone is not measured: there the group is narrower than the screen on purpose and the rest is a swipe away.
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
  const sections = await page.evaluate(() => [...document.querySelectorAll('.og-tiles > .og-grows')].map((block) => [...block.querySelectorAll('.og-grow')].map((row) => {
    const tiles = [...row.children].map((t) => t.getBoundingClientRect());
    return { left: Math.min(...tiles.map((t) => t.left)), right: Math.max(...tiles.map((t) => t.right)), count: tiles.length, wrapped: new Set(tiles.map((t) => Math.round(t.top))).size > 1 };
  })));
  sections.forEach((levels, s) => {
    const where = `${audience} ${sections.length > 1 && s === 0 ? '(group)' : '(rest)'}`;
    if (levels.length !== 2) problems.push(`${where}: ${levels.length} levels instead of two`);
    else if (Math.abs(levels[0].right - levels[1].right) > 1) problems.push(`${where}: the levels end ${levels[0].right.toFixed(1)} and ${levels[1].right.toFixed(1)}px`);
    if (levels.some((l) => l.wrapped)) problems.push(`${where}: a tile wrapped to another line`);
  });
  if (!sections.length) problems.push(`${audience}: no tiles found`);
  // the group and the rest are a tile gap apart, 8px, as any two tiles are
  if (sections.length === 2) { const gap = sections[1][0].left - Math.max(...sections[0].map((l) => l.right)); if (Math.abs(gap - 8) > 0.5) problems.push(`${audience}: the group is ${gap.toFixed(1)}px from the rest, not 8px`); }
  await context.close();
}
await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nTiles: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log(`Tiles: ${AUDIENCES.length} audiences, both levels end at the same place.`);
