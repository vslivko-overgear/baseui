// The boundary between baseui and its sublibraries (today Overgear): baseui knows nothing of them. A sublibrary extends baseui; the dependency goes one way.
// What belongs to a sublibrary (its rules, its audits, its documents) is tested in its own directory; what must hold for baseui itself is tested here.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';
import { RULES, RULES_BY_ID } from '../src/constitution/rules.js';
import { ConstitutionBanner } from '../src/components/ConstitutionBanner.jsx';
import { createElement } from 'react';
import { render } from '@testing-library/react';
import { spacingBalance } from '../tools/audits/spacing-balance.js';

const root = process.cwd();
const read = (path) => readFileSync(resolve(root, path), 'utf8');

describe('baseui does not know its sublibraries', () => {
  test('its rule set has no store ids, and the ids that moved to Overgear are retired', () => {
    expect(RULES.filter((r) => /^OG\d+$/.test(r.id))).toEqual([]);
    for (const id of ['U12', 'U13', 'U14']) expect(RULES_BY_ID[id], id).toBeUndefined();
  });

  test('its banner does not silently accept a store id', () => {
    expect(() => render(createElement(ConstitutionBanner, { violations: ['OG3'] }))).toThrow(/Unknown/);
  });

  test('the entry point and the spacing audit do not depend on a sublibrary, even transitively', () => {
    const seen = new Set();
    const walk = (path) => {
      const full = resolve(root, path);
      if (seen.has(full)) return;
      seen.add(full);
      expect(full.startsWith(resolve(root, 'overgear') + '/'), full).toBe(false);
      const source = readFileSync(full, 'utf8').replace(/^\s*\/\/.*$/gm, '');
      for (const [, spec] of source.matchAll(/(?:from\s*|import\s*\(?\s*)['"](\.[^'"]+)['"]/g)) {
        const target = resolve(dirname(full), spec);
        walk(existsSync(`${target}x`) ? `${target}x` : target);
      }
    };
    walk('src/index.jsx');
    walk('tools/audits/spacing-balance.js');
  });

  test('the shared audit does not look for a store rule', () => {
    expect(read('tools/audits/spacing-balance.js')).not.toMatch(/\bOG\d+\b|product-listing/);
    expect(spacingBalance(document.body)).toEqual([]);
  });

  test('the generated documents and the registry do not ship a store rule', () => {
    for (const path of ['CONSTITUTION.md', 'AGENTS.md', 'docs/foundations/constitution.md', 'r/baseui-core.json', 'r/baseui-constitution.json']) {
      expect(read(path), path).not.toMatch(/\bOG\d+\b/);
    }
    for (const f of JSON.parse(read('r/baseui-core.json')).files) expect(f.path.startsWith('overgear/'), f.path).toBe(false);
  });

  test('a consumer opts into a sublibrary through its own entry, and the package does not ship its whole directory', () => {
    const pkg = JSON.parse(read('package.json'));
    expect(pkg.exports['.'].default).toBe('./src/index.js');
    expect(pkg.exports['./overgear'].default).toBe('./overgear/index.js');
    expect(pkg.files).not.toContain('overgear');
  });
});
