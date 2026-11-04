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
    expect(css, 'no breadcrumbs under the navbar of a phone').toMatch(/\.og--mobile \.og-page--bar \.bui-breadcrumbs \{ display: none; \}/);
    const account = sources.find(([f]) => f === 'account.jsx')[1];
    expect(account).toMatch(/<Page bar=\{tab === 'settings'\}>/);
    const app = sources.find(([f]) => f === 'app.jsx')[1];
    expect(app, 'the settings have the bar with back on a phone').toMatch(/route\.query\.tab === 'settings'/);
  });

  test('on a phone the pages behind the account and the offer have no bottom bar, and the offer pins its pay bar', () => {
    const app = sources.find(([f]) => f === 'app.jsx')[1];
    expect(app).toMatch(/const hideTabs = orders \|\| \(mobile && route\.parts\[0\] === 'offer'\)/);
    expect(app).toMatch(/!hideTabs && <MobileBar/);
    const offer = sources.find(([f]) => f === 'offer.jsx')[1];
    expect(offer).toMatch(/\{mobile && <PayBar amount=/);
  });

  test('the four filters of the orders fill the row in equal parts on a desktop, and a phone has them in a sheet', () => {
    expect(css).toMatch(/\.og-ofilters \{ display: grid; grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
    expect(css, 'a sort that hugs').not.toMatch(/og-ofilters__sort/);
    const orders = sources.find(([f]) => f === 'orders.jsx')[1];
    expect(orders).toMatch(/showControls && !mobile && <div className="og-ofilters"/);
    expect(orders).toMatch(/orders-filters-sheet/);
    expect(orders).toMatch(/first === 'orders' && under/);
  });

  test('the submit of a form with a field in a sheet is in its footer, above the keyboard of a phone, not at the end of the content', () => {
    for (const [file, id] of [['order.jsx', 'og-promo-form'], ['wallet.jsx', 'og-topup-form']]) {
      const text = sources.find(([f]) => f === file)[1];
      expect(text, `${file}: the footer button of ${id}`).toMatch(new RegExp(`primaryAction=\\{<Button[^>]*type="submit" form="${id}"`));
      expect(text, `${file}: the form ${id}`).toMatch(new RegExp(`<form id="${id}"`));
    }
  });

  test('the gaps between blocks are the relation scale: the stack classes are made of --bui-rel-* (and the hair), and the pages have no stack class of their own', () => {
    const stack = [...css.matchAll(/^\.og-stack(--[\w, .-]+)? \{ ([^}]*) \}/gm)];
    expect(stack.length).toBeGreaterThanOrEqual(7);
    for (const [line, , body] of stack) {
      if (/display: flex/.test(body)) continue;   // the base class: its gap is checked below
      expect(body, line).toMatch(/gap: var\(--(bui-rel-(pair|tight|related|group|section)|bui-spacing-1)\)/);
    }
    expect(css).toMatch(/^\.og-stack \{ display: flex; flex-direction: column; gap: var\(--bui-rel-related\)/m);
    expect(css).toMatch(/^\.og-page \{ display: flex; flex-direction: column; gap: var\(--bui-rel-section\)/m);
    // a page asks for a relation; the names that were a size (lg, xl, 2xl) stay as the names of the relations they are
    for (const [f, text] of sources) expect(text, `${f}: a gap of its own in the style of a stack`).not.toMatch(/className="og-stack[^"]*"[^>]*style=\{\{[^}]*gap/);
  });
});
