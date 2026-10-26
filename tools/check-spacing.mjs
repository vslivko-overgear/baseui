#!/usr/bin/env node
// Runs the spacing balance (tools/spacing-balance.js) on the example products and prints the gaps where related things sit farther apart than unrelated ones.
// Needs Playwright (npm i -D playwright) and the repository served over HTTP:
//
//   python3 -m http.server 8000 &
//   node tools/check-spacing.mjs http://localhost:8000 [path …]      # default: examples/messenger/ examples/probe/
//
// The pages of the documentation are galleries, so they are not swept; check a product, or any page you pass.
// Each page is checked on a wide and a narrow screen; the first row of a list is opened, so a chat or a detail view is checked too.
// The exit code is 1 when something is found, so it can run in CI.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '');
const paths = process.argv.slice(3).length ? process.argv.slice(3) : ['examples/messenger/', 'examples/probe/'];
let chromium;
try { ({ chromium } = await import('playwright')); } catch { console.error('Playwright is not installed: npm i -D playwright'); process.exit(2); }
const source = await readFile(fileURLToPath(new URL('./spacing-balance.js', import.meta.url)), 'utf8');

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
      return m.spacingBalance(document.body).map((f) => ({ kind: f.kind, selector: f.selector, gap: f.gap, around: f.around, suggestion: f.suggestion }));
    }, source);
    for (const r of rows) {
      const key = `${r.kind.padEnd(8)} ${r.selector}: gap ${r.gap}px, around it ${r.around}px -> ${r.suggestion}`;
      if (!found.has(key)) found.set(key, new Set());
      found.get(key).add(`${path} @${width}`);
    }
    await page.close();
  }
}
await browser.close();

if (!found.size) { console.log(`Spacing balance: ${paths.length} pages, related things are closer than unrelated ones.`); process.exit(0); }
for (const [key, where] of found) console.log(`${key}\n    ${[...where].join('  ')}`);
console.log(`\nSpacing balance: ${found.size} problem${found.size === 1 ? '' : 's'} on ${paths.length} pages.`);
process.exit(1);
