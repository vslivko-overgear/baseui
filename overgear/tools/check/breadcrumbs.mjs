#!/usr/bin/env node
// The breadcrumbs of the store end at the parent of the page (rule OG5): the current page is not in the trail (its title is right under it), the parent stays a link, and the trail has no item marked as the current page.
//
//   node overgear/tools/check/breadcrumbs.mjs http://localhost:8000
import { launch } from '../../../tools/lib/sweep.mjs';

const base = (process.argv[2] || 'http://localhost:8000').replace(/\/$/, '');
const PAGES = [['#/offer/venomous-abyss-heroic', 'Venomous Abyss Heroic'], ['#/games/wow', 'World of Warcraft']];
const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const problems = [];
for (const [hash, current] of PAGES) {
  for (const [width, phone] of [[390, true], [1440, false]]) {
    const page = await (await browser.newContext({ viewport: { width, height: 800 }, hasTouch: phone })).newPage();
    await page.goto(`${base}/overgear/example/index.html${hash}`);
    await page.waitForTimeout(1500);
    const trail = await page.evaluate(() => { const nav = document.querySelector('[data-slot="breadcrumbs"]'); if (!nav) return null; const last = [...nav.querySelectorAll('li:not([data-slot="breadcrumbs-sep"])')].at(-1); return { texts: [...nav.querySelectorAll('li:not([data-slot="breadcrumbs-sep"])')].map((l) => l.textContent.trim()), current: !!nav.querySelector('[aria-current]'), lastIsLink: !!last?.querySelector('a, button'), endsWithSeparator: nav.querySelector('ol').lastElementChild.matches('[data-slot="breadcrumbs-sep"]') }; });
    const where = `${hash} @${width}`;
    if (!trail) { problems.push(`${where}: no breadcrumbs`); await page.close(); continue; }
    if (trail.current || trail.texts.includes(current)) problems.push(`${where}: the trail shows the current page (${trail.texts.join(' > ')})`);
    if (!trail.lastIsLink) problems.push(`${where}: the last item of the trail is not a link to the parent`);
    if (trail.endsWithSeparator) problems.push(`${where}: the trail ends with a separator`);
    await page.close();
  }
}
await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nBreadcrumbs of the store: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log('Breadcrumbs of the store: the trail ends at the parent of the page.');
