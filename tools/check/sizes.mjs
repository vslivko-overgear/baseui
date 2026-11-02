#!/usr/bin/env node
// Runs the size balance (tools/audits/size-balance.js) on the example products and prints what is off the 16px-centered ladder.
// Needs Playwright (npm i -D playwright) and the repository served over HTTP:
//
//   python3 -m http.server 8000 &
//   node tools/check/sizes.mjs http://localhost:8000 [path …]      # default: overgear/example/
//
// The pages of the documentation are galleries that show every size on purpose, so they are not swept; check a product, or any page you pass.
// Each page is checked on a wide and a narrow screen; the first row of a list is opened, so a chat or a detail view is checked too.
// The exit code is 1 when something is found, so it can run in CI.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { launch, sweep, report, openFirstRow, arg } from '../lib/sweep.mjs';

const base = arg(2, 'http://localhost:8000');
const paths = process.argv.slice(3).length ? process.argv.slice(3) : ['overgear/example/'];
const source = await readFile(fileURLToPath(new URL('../audits/size-balance.js', import.meta.url)), 'utf8');

const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const found = await sweep({
  browser, base, paths, widths: [1500, 390],
  audit: async (page) => {
    await openFirstRow(page);
    return page.evaluate(async (src) => {
      const m = await import(`data:text/javascript,${encodeURIComponent(src)}`);
      return m.sizeBalance(document.body).map((f) => ({ kind: f.kind, selector: f.selector, found: f.found, suggestion: f.suggestion }));
    }, source);
  },
  key: (r) => `${r.kind.padEnd(11)} ${r.selector}: ${r.found} -> ${r.suggestion}`,
});
await browser.close();
process.exit(report(found, { name: 'Size balance', pages: paths.length, clean: 'everything is on the ladder' }));
