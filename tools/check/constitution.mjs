#!/usr/bin/env node
// Runs the constitution audit (src/constitution/audit.js, the rules marked check: auto) on the example products and on the showcase of Overgear, in a real browser,
// and prints what it finds. Needs Playwright (npm i -D playwright) and the repository served over HTTP:
//
//   python3 -m http.server 8000 &
//   node tools/check/constitution.mjs http://localhost:8000 [path …]     # default: the pages of Overgear and the form templates below
//
// Each page is checked on a wide and a narrow screen. The exit code is 1 when something is found, so it can run in CI.
import { launch, sweep, report, arg } from '../lib/sweep.mjs';

const base = arg(2, 'http://localhost:8000');
const PAGES = ['overgear/#/theme', 'overgear/#/typography', 'overgear/#/colors', 'overgear/example/#/', 'overgear/example/#/games/wow', 'overgear/example/#/offer/venomous-abyss-heroic', 'overgear/example/#/catalog', 'overgear/example/#/catalog/wow', 'overgear/example/#/account', 'overgear/example/#/info/terms', 'templates/frame/?t=contact-form', 'templates/frame/?t=two-column-form', 'templates/frame/?t=checkout-form', 'templates/frame/?t=checkout-wizard', 'templates/frame/?t=settings-form', 'templates/frame/?t=login-simple'];
const paths = process.argv.slice(3).length ? process.argv.slice(3) : PAGES;

const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const found = await sweep({
  browser, base, paths, widths: [1500, 390], settle: 1800,
  audit: (page) => page.evaluate(async () => {
    const m = await import('/src/constitution/audit.js');
    const tabs = await import('/src/constitution/audit-tabs.js');
    // the static audit first, then the one that presses the tabs (D17); it puts the page back
    return [...m.auditConstitution(document.body), ...(await tabs.auditTabs(document.body))].map((v) => ({ id: v.id, note: v.note }));
  }),
  key: (r) => `${r.id.padEnd(4)} ${r.note}`,
});
await browser.close();
process.exit(report(found, { name: 'Constitution audit', pages: paths.length, clean: 'nothing found', noun: 'finding' }));
