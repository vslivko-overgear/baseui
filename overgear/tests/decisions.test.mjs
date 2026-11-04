// The decisions of the product that are cheap to hold by reading the source. A check in a browser is slow and breaks when a page changes its look; these hold a decision that was made once and must not come back by accident.
// When the person reverses one, change the line here with it (and, if a rule holds it, retire the rule: see RETIRED in overgear/constitution/rules.js).
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const DIR = 'overgear/example';
const sources = readdirSync(DIR).filter((f) => f.endsWith('.jsx')).map((f) => [f, readFileSync(join(DIR, f), 'utf8')]);
const css = readFileSync(join(DIR, 'example.css'), 'utf8');
const find = (pattern) => sources.filter(([, text]) => pattern.test(text)).map(([f]) => f);

describe('decisions of the product', () => {
  test('the trail of breadcrumbs shows the current page (it is not cut at the parent)', () => {
    expect(find(/showCurrent=\{false\}/), 'showCurrent={false}').toEqual([]);
  });

  test('the color of a state or a progress is a status color, never the color of the brand (it is blue in this theme)', () => {
    expect(find(/color[=:]\s*\{?\s*['"]brand['"]/), "color 'brand'").toEqual([]);
  });

  test('a screen of the product has no links that play its states (the states open by the address, ?demo= and the paths)', () => {
    expect(find(/aria-label="States of this page"|og-result__demo|Show the state/), 'a strip of states').toEqual([]);
    expect(css).not.toMatch(/\.og-result__demo/);
  });

  test('the settings have no log out button (the menu of the account has it)', () => {
    const settings = sources.find(([f]) => f === 'settings.jsx')?.[1] || '';
    expect(settings).not.toMatch(/Log out/);
  });

  test('a main text is not set in the secondary color: a paragraph of text is og-text, og-meta is for a caption, a hint, a date', () => {
    const long = [];
    for (const [f, text] of sources) for (const m of text.matchAll(/<p className="og-meta"[^>]*>([^<{]{80,})<\/p>/g)) long.push(`${f}: ${m[1].slice(0, 40)}`);
    expect(long, 'a long text in og-meta').toEqual([]);
  });

  test('on a phone a page under a navbar starts 0 from it, and the pages with a navbar say so', () => {
    expect(css).toMatch(/\.og--mobile \.og-page--bar \{ padding-top: 0; \}/);
    expect(css).toMatch(/\.og--mobile \.og-co \{[^}]*padding-top: 0;/);
    expect(css, 'a page under a bar with a padding of its own').not.toMatch(/\.og-page--bar:has\([^)]*\) \{ padding-top: (?!0)/);
    const account = sources.find(([f]) => f === 'account.jsx')[1];
    expect(account).toMatch(/<Page bar=\{tab === 'settings'\}>/);
    const app = sources.find(([f]) => f === 'app.jsx')[1];
    expect(app, 'the settings have the bar with back on a phone').toMatch(/route\.query\.tab === 'settings'/);
  });
});
