#!/usr/bin/env node
// Runs the constitution audit on tools/check/fixtures.html: every case there breaks one rule on purpose (or is the same page made right) and names the rules the audit must report in data-expect.
// An audit that stops finding a violation would pass every other check, so this one fails when a case that must be found is not, and when a page that is right is reported.
// It also checks the page-level rule M2 (the page scrolls sideways) on a page made wide on purpose.
//
//   node tools/check/fixtures.mjs http://localhost:8000
import { launch, arg } from '../lib/sweep.mjs';

const base = arg(2, 'http://localhost:8000');
const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const page = await browser.newPage({ viewport: { width: 400, height: 900 } });
await page.goto(`${base}/tools/check/fixtures.html`);
await page.waitForTimeout(400);

const results = await page.evaluate(async () => {
  const m = await import('/src/constitution/audit.js');
  const out = [];
  for (const section of document.querySelectorAll('[data-case]')) {
    out.push({ name: section.dataset.case, expect: (section.dataset.expect || '').split(/\s+/).filter(Boolean), found: [...new Set(m.auditConstitution(section).map((v) => v.id))].sort() });
  }
  // M2: the page scrolls sideways only when it is wider than the screen
  const wide = document.createElement('div');
  wide.style.cssText = 'width:1200px;height:8px';
  document.body.append(wide);
  out.push({ name: 'M2 page wider than the screen', expect: ['M2'], found: m.auditConstitution(document.body).map((v) => v.id).filter((id) => id === 'M2') });
  wide.remove();
  out.push({ name: 'M2 page fits the screen', expect: [], found: m.auditConstitution(document.body).map((v) => v.id).filter((id) => id === 'M2') });
  return out;
});
await browser.close();

let failed = 0;
for (const { name, expect, found } of results) {
  // a case is judged on the rules it names, and a page that is right on every rule
  const wanted = expect.length ? expect : [];
  const ok = wanted.length ? wanted.every((id) => found.includes(id)) : found.length === 0;
  if (!ok) { failed++; console.log(`✗ ${name}: expected ${wanted.length ? wanted.join(', ') : 'nothing'}, the audit reported ${found.length ? found.join(', ') : 'nothing'}`); }
}
console.log(failed ? `\nAudit fixtures: ${failed} of ${results.length} cases failed.` : `Audit fixtures: ${results.length} cases, the audit finds what it should.`);
process.exit(failed ? 1 : 0);
