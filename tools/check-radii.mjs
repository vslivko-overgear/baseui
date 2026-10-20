#!/usr/bin/env node
// Runs the radius check on every page of the documentation site and prints the nested corners that are not concentric.
// Needs Playwright (npm i -D playwright) and the site served over HTTP:
//
//   python3 -m http.server 8000 &
//   node tools/check-radii.mjs http://localhost:8000
//
// Menus and panels are opened first (the first trigger of every page), so their corners are checked too.
// The exit code is 1 when something is found, so it can run in CI.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '');
let chromium;
try { ({ chromium } = await import('playwright')); } catch { console.error('Playwright is not installed: npm i -D playwright'); process.exit(2); }
const source = await readFile(fileURLToPath(new URL('./radius-check.js', import.meta.url)), 'utf8');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 1000 } });
await page.goto(`${base}/`);
await page.waitForTimeout(1500);
const hrefs = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="#/"]')].map((a) => a.getAttribute('href')))]);

const found = new Map();
for (const href of hrefs) {
  await page.goto(`${base}/${href}`);
  await page.waitForTimeout(700);
  const trigger = page.locator('.canvas [aria-haspopup], .canvas [role=combobox]').first();
  if (await trigger.count()) { await trigger.click().catch(() => {}); await page.waitForTimeout(400); }
  const rows = await page.evaluate(async (src) => {
    const m = await import(`data:text/javascript,${encodeURIComponent(src)}`);
    return m.checkRadii(document.body).map((f) => ({ selector: f.selector, corner: f.corner, outer: f.outer, inset: f.inset, expected: f.expected, actual: f.actual }));
  }, source);
  for (const r of rows) {
    const key = `${r.selector} ${r.corner} outer ${r.outer}, inset ${r.inset}: expected ${r.expected}, got ${r.actual}`;
    if (!found.has(key)) found.set(key, []);
    found.get(key).push(href);
  }
  await page.keyboard.press('Escape');
}
await browser.close();

if (!found.size) { console.log(`Radius check: ${hrefs.length} pages, every nested corner is concentric.`); process.exit(0); }
for (const [key, pages] of found) console.log(`${key}\n    ${pages.slice(0, 3).join('  ')}${pages.length > 3 ? `  (+${pages.length - 3})` : ''}`);
console.log(`\nRadius check: ${found.size} problem${found.size === 1 ? '' : 's'} on ${hrefs.length} pages.`);
process.exit(1);
