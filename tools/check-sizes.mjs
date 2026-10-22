#!/usr/bin/env node
// Runs the size balance (tools/size-balance.js) on the example products and prints what is off the 16px-centered ladder.
// Needs Playwright (npm i -D playwright) and the repository served over HTTP:
//
//   python3 -m http.server 8000 &
//   node tools/check-sizes.mjs http://localhost:8000 [path …]      # default: examples/messenger/ examples/overgear/ examples/overgear-v2/
//
// The pages of the documentation are galleries that show every size on purpose, so they are not swept; check a product, or any page you pass.
// Each page is checked on a wide and a narrow screen; the first row of a list is opened, so a chat or a detail view is checked too.
// The exit code is 1 when something is found, so it can run in CI.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '');
const paths = process.argv.slice(3).length ? process.argv.slice(3) : ['examples/messenger/', 'examples/overgear/', 'examples/overgear-v2/'];
let chromium;
try { ({ chromium } = await import('playwright')); } catch { console.error('Playwright is not installed: npm i -D playwright'); process.exit(2); }
const source = await readFile(fileURLToPath(new URL('./size-balance.js', import.meta.url)), 'utf8');

const browser = await chromium.launch();
const found = new Map();
for (const path of paths) {
  for (const width of [1500, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(`${base}/${path}`);
    await page.waitForTimeout(1200);
    const row = page.locator('[data-slot=list-item-header]').first();
    if (await row.count()) { await row.click().catch(() => {}); await page.waitForTimeout(700); }
    const rows = await page.evaluate(async (src) => {
      const m = await import(`data:text/javascript,${encodeURIComponent(src)}`);
      return m.sizeBalance(document.body).map((f) => ({ kind: f.kind, selector: f.selector, found: f.found, suggestion: f.suggestion }));
    }, source);
    for (const r of rows) {
      const key = `${r.kind.padEnd(11)} ${r.selector}: ${r.found} -> ${r.suggestion}`;
      if (!found.has(key)) found.set(key, new Set());
      found.get(key).add(`${path} @${width}`);
    }
    await page.close();
  }
}
await browser.close();

if (!found.size) { console.log(`Size balance: ${paths.length} pages, everything is on the ladder.`); process.exit(0); }
for (const [key, where] of found) console.log(`${key}\n    ${[...where].join('  ')}`);
console.log(`\nSize balance: ${found.size} problem${found.size === 1 ? '' : 's'} on ${paths.length} pages.`);
process.exit(1);
