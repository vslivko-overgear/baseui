#!/usr/bin/env node
// Runs the icon weight audit on every page of the documentation site and the examples: lists the outline icons whose stroke does not
// match the text beside them (and those that are next to a text so bold that the filled icon is the match).
// Needs Playwright and the site served over HTTP:
//
//   python3 -m http.server 8000 &
//   node tools/check-icons.mjs http://localhost:8000 [path …]      # default: every page of the docs, examples/messenger/ examples/probe/
//
// Icons of the catalog page are skipped on purpose. The exit code is 1 when something is found.
const base = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '');
let chromium;
try { ({ chromium } = await import('playwright')); } catch { console.error('Playwright is not installed: npm i -D playwright'); process.exit(2); }
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1300, height: 1000 } });
await page.goto(`${base}/`);
await page.waitForTimeout(1500);
const given = process.argv.slice(3);
const pages = given.length ? given : [...await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="#/"]')].map((a) => a.getAttribute('href')))]), 'examples/messenger/', 'examples/probe/'];

const found = new Map();
for (const p of pages) {
  await page.goto(`${base}/${p}`);
  await page.waitForTimeout(900);
  const rows = await page.evaluate(async (origin) => (await import(`${origin}/tools/icon-weight.js`)).auditIcons(document.body), base);
  for (const r of rows) {
    const key = `${r.selector} next to “${r.text}” (${r.fontSize}px/${r.fontWeight}, icon ${r.iconSize}px): stroke ${r.stroke}, ${r.filled ? `needs ${r.wanted} → filled` : `recommended ${r.recommended}`}`;
    if (!found.has(key)) found.set(key, new Set());
    found.get(key).add(p);
  }
}
await browser.close();
for (const [k, v] of found) console.log(`${k}\n    ${[...v].slice(0, 4).join(', ')}${v.size > 4 ? `, +${v.size - 4}` : ''}`);
console.log(`\nIcon weight: ${found.size} mismatches on ${pages.length} pages.`);
process.exit(found.size ? 1 : 0);
