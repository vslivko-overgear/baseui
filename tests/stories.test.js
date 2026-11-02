// Every story is rendered in jsdom and must render without an error, with no duplicate ids and with a name on every
// button, link and field. Only the components in SNAPSHOT (the ones with a lot of markup logic) also keep a snapshot
// of their markup: it is not a record of every class, so a diff there is read, not accepted by habit.
import { readdirSync } from 'node:fs';
import { createElement } from 'react';
import { cleanup, render as mount } from '@testing-library/react';
import { beforeAll, afterAll, describe, expect, test, vi } from 'vitest';

// The calendar stories draw "today": the clock stands still, or every snapshot of a date would change at midnight
beforeAll(() => { vi.useFakeTimers({ toFake: ['Date'] }); vi.setSystemTime(new Date('2026-10-30T12:00:00')); });
afterAll(() => vi.useRealTimers());

// the components whose markup is worth a snapshot
const SNAPSHOT = new Set(['Calendar', 'DatePicker', 'Table', 'Dialog', 'Selector', 'Typeahead', 'Tabs', 'Dropdown', 'List', 'ProductCard']);

const dirs = ['src/stories', 'src/foundations', 'src/theming'];
// sources are .jsx; a .js beside one is its build output
const files = dirs.flatMap((d) => readdirSync(d).filter((f) => /\.stories\.jsx?$/.test(f)).map((f) => `${d}/${f}`)).filter((f, _, all) => f.endsWith('.jsx') || !all.includes(`${f}x`)).sort();

function renderStory(meta, story) {
  const args = { ...meta.args, ...story.args };
  const argTypes = meta.argTypes || {};
  // a control with a `mapping` turns the name of an option into the value the component takes
  for (const [key, type] of Object.entries(argTypes)) if (type?.mapping && args[key] in type.mapping) args[key] = type.mapping[args[key]];
  const render = story.render || meta.render;
  const decorators = [...(story.decorators || []), ...(meta.decorators || [])];
  const ctx = { args, parameters: { ...meta.parameters, ...story.parameters }, globals: {}, argTypes: meta.argTypes, component: meta.component };
  let Story = () => (render ? render(args, ctx) : createElement(meta.component, args));
  for (const deco of decorators) { const Prev = Story; Story = () => deco(() => createElement(Prev), ctx); }
  mount(createElement(Story));
  const body = document.body;
  const problems = [];
  if (!body.innerHTML.trim()) problems.push('renders nothing');
  const ids = [...body.querySelectorAll('[id]')].map((e) => e.id);
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dup.length) problems.push(`duplicate ids: ${[...new Set(dup)].slice(0, 3).join(', ')}`);
  // a button or a link needs a name: text, aria-label, aria-labelledby or a titled image
  for (const el of body.querySelectorAll('button, a[href]')) {
    const named = el.textContent.trim() || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title') || el.querySelector('img[alt]:not([alt=""]), svg title');
    if (!named) { problems.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} has no name`); break; }
  }
  // React's useId counter depends on the order in which the files run, so ids are renumbered by first appearance (links between ids stay intact).
  const seen = new Map();
  const html = body.innerHTML.replace(/_r_[0-9a-z]+_/g, (id) => `_r_${seen.get(id) ?? seen.set(id, seen.size).get(id)}_`);
  cleanup();
  return { html, problems };
}

describe.each(files.map((f) => [f.replace(/x$/, ''), f]))('%s', (_, file) => {
  test('renders', async () => {
    const mod = await import(/* @vite-ignore */ `../${file}`);
    const meta = mod.default;
    const snapshot = {};
    const failures = [];
    for (const [name, story] of Object.entries(mod)) {
      if (name === 'default' || name.startsWith('__') || typeof story !== 'object') continue;
      try {
        const { html, problems } = renderStory(meta, story);
        problems.forEach((p) => failures.push(`${name}: ${p}`));
        snapshot[name] = html;
      } catch (e) { failures.push(`${name}: ${String(e.message).slice(0, 160)}`); }
    }
    expect(failures).toEqual([]);
    if (SNAPSHOT.has(file.split('/').pop().replace('.stories.jsx', '').replace('.stories.js', ''))) expect(snapshot).toMatchSnapshot();
  });
});
