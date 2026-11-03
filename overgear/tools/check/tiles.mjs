#!/usr/bin/env node
// The games of the home page on a desktop: blocks of two rows of tiles of different widths (fitTiles in overgear/audience.js) that fit the width with no scroll, for every audience and for
// a wide and a narrow desktop. What is measured: the line of blocks starts and ends at the edges of its box, a block is a rectangle (both its rows start and end at the same place), the blocks
// are a tile gap apart, the tiles of a row are not all of one width, the two rows are of one height, nothing scrolls, and a family (World of Warcraft) is a block of its own with its four games.
// A phone is not measured: there the rows scroll on purpose.
//
//   node overgear/tools/check/tiles.mjs http://localhost:8000
import { launch } from '../../../tools/lib/sweep.mjs';
import { AUDIENCES, AUDIENCE_GROUP, TILE_GAP } from '../../audience.js';
import { COOKIE } from '../../theme.js';

const base = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '');
const WIDTHS = [1500, 1280, 1000];
const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const problems = [];
const near = (a, b) => Math.abs(a - b) <= 1.5;
for (const [audience] of AUDIENCES) for (const width of WIDTHS) {
  const at = `${audience} at ${width}px`;
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  await context.addCookies([{ name: COOKIE, value: encodeURIComponent(JSON.stringify({ audience })), url: base }]);
  const page = await context.newPage();
  await page.goto(`${base}/overgear/example/index.html`);
  await page.waitForTimeout(1500);
  const line = await page.evaluate(() => {
    const el = document.querySelector('[data-test-id=home-games]');
    if (!el) return null;
        const r = (n) => { const b = n.getBoundingClientRect(); return { left: b.left, right: b.right, top: b.top, width: b.width, height: b.height }; };
    return {
      box: r(el.parentElement), scrolls: el.scrollWidth > el.clientWidth + 1,
      blocks: [...el.querySelectorAll('[data-test-id=home-games-block]')].map((b) => ({ ...r(b), rows: [...b.children].map((row) => ({ ...r(row), tiles: [...row.children].map(r) })) })),
    };
  });
  await context.close();
  if (!line || !line.blocks.length) { problems.push(`${at}: no tiles found`); continue; }
  const { box, blocks } = line;
  if (line.scrolls) problems.push(`${at}: the tiles scroll sideways`);
  if (!near(blocks[0].left, box.left) || !near(blocks.at(-1).right, box.right)) problems.push(`${at}: the tiles do not fill the width (${Math.round(blocks[0].left - box.left)}px from the start, ${Math.round(box.right - blocks.at(-1).right)}px from the end)`);
  blocks.forEach((b, i) => {
    if (i && !near(b.left - blocks[i - 1].right, TILE_GAP)) problems.push(`${at}: the blocks are ${Math.round(b.left - blocks[i - 1].right)}px apart, not ${TILE_GAP}`);
    if (b.rows.length !== 2) { problems.push(`${at}: a block has ${b.rows.length} rows instead of two`); return; }
    const [a, c] = b.rows;
    if (!near(a.left, c.left) || !near(a.right, c.right) || !near(a.left, b.left) || !near(a.right, b.right)) problems.push(`${at}: block ${i + 1} is not a rectangle (rows ${Math.round(a.left)}-${Math.round(a.right)} and ${Math.round(c.left)}-${Math.round(c.right)})`);
    if (!near(a.height, c.height)) problems.push(`${at}: the two rows of block ${i + 1} are not of one height`);
    for (const row of b.rows) if (new Set(row.tiles.map((t) => Math.round(t.width / 4))).size < 2 && row.tiles.length > 2) problems.push(`${at}: the tiles of a row are all of one width`);
    for (const t of b.rows.flatMap((row) => row.tiles)) if (t.width < 90) problems.push(`${at}: a tile is only ${Math.round(t.width)}px wide`);
  });
  const family = AUDIENCE_GROUP[audience];
  if (family) {
    const count = blocks[0]?.rows.flatMap((row) => row.tiles).length;
    if (blocks.length < 2 || count !== family.flat().length) problems.push(`${at}: the family is not a block of its own with its ${family.flat().length} games (${count} tiles in the first block of ${blocks.length})`);
  } else if (blocks.length !== 1) problems.push(`${at}: ${blocks.length} blocks for an audience without a family`);
}
await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nTiles: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log(`Tiles: ${AUDIENCES.length} audiences at ${WIDTHS.join(', ')}px, blocks of two rows of different widths that fill the width, no scroll.`);
