#!/usr/bin/env node
// A trail of breadcrumbs stays on one line (rule U15): on a phone, a long trail does not wrap, it scrolls sideways and starts at its end, and no part of it is cut off for good.
// It opens the pages of the example that have a trail on a phone (390px) and on a narrow one (320px).
//
//   node tools/check/breadcrumbs.mjs http://localhost:8000
import { launch, arg, ready } from '../lib/sweep.mjs';

const base = arg(2, 'http://localhost:8000');
const PAGES = ['overgear/example/index.html#/offer/venomous-abyss-heroic', 'overgear/example/index.html#/games/wow'];
const browser = await launch().catch((e) => { console.error(e.message); process.exit(2); });
const problems = [];

for (const hash of PAGES) {
  for (const width of [390, 320]) {
    const page = await (await browser.newContext({ viewport: { width, height: 800 }, hasTouch: true, reducedMotion: 'reduce' })).newPage();
    await page.goto(`${base}/${hash}`);
    await ready(page);
    const trail = await page.evaluate(() => {
      const nav = document.querySelector('[data-slot="breadcrumbs"]');
      if (!nav) return null;
      const items = [...nav.querySelectorAll('li')].map((li) => li.getBoundingClientRect());
      const tops = new Set(items.map((r) => Math.round((r.top + r.bottom) / 2 / 8)));   // the middle of each item: the icon of a separator is lower than the text, its top is not the line
      return { lines: tops.size, scrolls: nav.scrollWidth > nav.clientWidth, atEnd: Math.abs(nav.scrollLeft + nav.clientWidth - nav.scrollWidth) <= 2, overflowX: getComputedStyle(nav).overflowX, wrap: getComputedStyle(nav.querySelector('ol')).flexWrap, pageScrolls: document.documentElement.scrollWidth > window.innerWidth + 1 };
    });
    // a trail made long on purpose (the items of the real one, repeated): one line, it scrolls sideways, the page does not
    const long = await page.evaluate(() => {
      const nav = document.querySelector('[data-slot="breadcrumbs"]'); const ol = nav?.querySelector('ol'); if (!ol) return null;
      const kids = [...ol.children].map((k) => k.cloneNode(true));
      for (let i = 0; i < 5; i++) kids.forEach((k) => ol.append(k.cloneNode(true)));
      const tops = new Set([...ol.children].map((li) => { const r = li.getBoundingClientRect(); return Math.round((r.top + r.bottom) / 2 / 8); }));
      return { lines: tops.size, scrolls: nav.scrollWidth > nav.clientWidth, pageScrolls: document.documentElement.scrollWidth > window.innerWidth + 1 };
    });
    const where = `${hash} @${width}`;
    if (long && (long.lines !== 1 || !long.scrolls || long.pageScrolls)) problems.push(`${where}: a long trail wraps, or does not scroll sideways, or widens the page (${JSON.stringify(long)})`);
    if (!trail) { problems.push(`${where}: no trail of breadcrumbs`); await page.close(); continue; }
    if (trail.lines !== 1) problems.push(`${where}: the trail is on ${trail.lines} lines`);
    if (trail.wrap !== 'nowrap') problems.push(`${where}: the trail may wrap (${trail.wrap})`);
    if (trail.scrolls && (trail.overflowX !== 'auto' || !trail.atEnd)) problems.push(`${where}: a long trail does not scroll sideways from its end (overflow ${trail.overflowX}, at the end: ${trail.atEnd})`);
    if (trail.pageScrolls) problems.push(`${where}: the page scrolls sideways because of the trail`);
    await page.close();
  }
}
await browser.close();
if (problems.length) { for (const p of problems) console.log(p); console.log(`\nBreadcrumbs: ${problems.length} problem${problems.length === 1 ? '' : 's'}.`); process.exit(1); }
console.log('Breadcrumbs: one line on a phone, a long trail scrolls sideways from its end.');
