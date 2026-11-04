#!/usr/bin/env node
// Runs the radius check on every page of the documentation site and prints the nested corners that are not concentric.
// Needs Playwright (npm i -D playwright) and the site served over HTTP:
//
//   python3 -m http.server 8000 &
//   node tools/check/radii.mjs http://localhost:8000
//
// Menus and panels are opened first (the first trigger of every page), so their corners are checked too.
// The exit code is 1 when something is found, so it can run in CI.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { launch, docsLinks, sweep, report, arg, ready } from '../lib/sweep.mjs';

const base = arg(2, 'http://localhost:8000');
const source = await readFile(fileURLToPath(new URL('../audits/radius-check.js', import.meta.url)), 'utf8');

const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const hrefs = await docsLinks(browser, base);
const found = await sweep({
  browser, base, paths: hrefs, spa: true,
  audit: async (page) => {
    const trigger = page.locator('.canvas [aria-haspopup], .canvas [role=combobox]').first();
    if (await trigger.count()) { await trigger.click().catch(() => {}); await ready(page, 100); }
    return page.evaluate(async (src) => {
      const m = await import(`data:text/javascript,${encodeURIComponent(src)}`);
      return m.checkRadii(document.body).map((f) => ({ selector: f.selector, corner: f.corner, outer: f.outer, inset: f.inset, expected: f.expected, actual: f.actual }));
    }, source);
  },
  key: (r) => `${r.selector} ${r.corner} outer ${r.outer}, inset ${r.inset}: expected ${r.expected}, got ${r.actual}`,
});
await browser.close();
process.exit(report(found, { name: 'Radius check', pages: hrefs.length, clean: 'every nested corner is concentric', limit: 3 }));
