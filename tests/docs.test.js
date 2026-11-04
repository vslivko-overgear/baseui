// Docs keep up with the code: every exported component is described and every prop it takes is in its description
import { describe, expect, test } from 'vitest';
import * as mod from '../src/index.js';

const SKIP = new Set(['className', 'style', 'children', 'ref', 'key', 'rest', 'props']);
// parts of a compound component, described on the parent
const NO_DOCGEN = new Set(['ChoiceSheet', 'TableBody', 'TableCell', 'TableHeader', 'TableHeaderCell', 'TableRow']);

const components = Object.entries(mod).filter(([name, fn]) => typeof fn === 'function' && /^[A-Z]/.test(name));

function takenProps(fn) {
  const src = fn.toString();
  const head = src.slice(0, src.indexOf(') {') > 0 ? src.indexOf(') {') : 600);
  const m = head.match(/\(\s*\{([\s\S]*)\}\s*$/);
  if (!m) return [];
  return [...m[1].matchAll(/(?:^|,)\s*(?:\.\.\.)?([a-zA-Z_]\w*)\s*(?:=|,|:|$)/g)]
    .map((x) => x[1])
    .filter((p) => !SKIP.has(p) && !/^(aria|data)/.test(p));
}

describe('Docs', () => {
  test('every exported component has a description', () => {
    const missing = components.filter(([name, fn]) => !fn.__docgenInfo && !NO_DOCGEN.has(name)).map(([name]) => name);
    expect(missing).toEqual([]);
  });

  test('every prop a component takes is documented', () => {
    const missing = [];
    for (const [name, fn] of components) {
      const info = fn.__docgenInfo;
      if (!info) continue;
      const doc = Object.keys(info.props || {});
      for (const p of takenProps(fn)) if (!doc.includes(p)) missing.push(`${name}.${p}`);
    }
    expect(missing).toEqual([]);
  });
});
