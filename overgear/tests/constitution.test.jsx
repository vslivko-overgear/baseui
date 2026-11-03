import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';
import { RULES as BASE_RULES, rule as baseRule } from '../../src/constitution/rules.js';
import { RULES, APPLICABLE_RULES, RETIRED, rule } from '../constitution/rules.js';
import { listingBalance, spacingBalance } from '../tools/audits/spacing-balance.js';
import { render, screen } from '@testing-library/react';
import { ConstitutionBanner as BaseBanner } from '../../src/components/ConstitutionBanner.jsx';
import { ConstitutionBanner } from '../index.jsx';

describe('rules', () => {
  // What belongs to Overgear only: its rules, its documents, its listing audit. That baseui knows nothing of Overgear is tested in tests/boundary.test.js.
  const root = process.cwd();
  const read = (path) => readFileSync(resolve(root, path), 'utf8');

  test('Overgear adds its rules to the shared ones and keeps the old ids it took over', () => {
    expect(RULES.filter((r) => r.legacyId).map((r) => [r.legacyId, r.id])).toEqual([['U12', 'OG1'], ['U13', 'OG2'], ['U14', 'OG3']]);
    expect(APPLICABLE_RULES).toEqual([...BASE_RULES, ...RULES]);
    expect(rule('A1')).toBe(baseRule('A1'));
    expect(rule('OG3').title).toBe('Catalog and listing are two things');
    expect(() => rule('OG9999')).toThrow(/Unknown/);
    expect(new Set(APPLICABLE_RULES.map((r) => r.id)).size).toBe(APPLICABLE_RULES.length);
  });

  test('new store rules have their own namespace and local checks', () => {
    for (const r of RULES) {
      expect(r.id).toMatch(/^OG\d+$/);
      expect(['must', 'should']).toContain(r.level);
      expect(['auto', 'tool', 'review']).toContain(r.check);
      for (const key of ['title', 'do', 'dont', 'why', 'source']) expect(r[key], `${r.id}.${key}`).toBeTruthy();
      expect(r.signals.length).toBeGreaterThan(0);
      if (r.check === 'tool') {
        expect(r.tool.startsWith('overgear/tools/')).toBe(true);
        expect(existsSync(resolve(root, r.tool))).toBe(true);
      }
    }
  });

  test('generated local documents contain every local rule and route future changes locally', () => {
    const md = read('overgear/CONSTITUTION.md');
    for (const r of RULES) {
      expect(md).toContain(`### ${r.id} ${r.title}`);
      expect(md).toContain(r.do);
      expect(md).toContain(r.dont.replace(/^Do not /, ''));
    }
    for (const file of ['AGENTS.md', 'overgear/AGENTS.md']) expect(read(file)).toContain('overgear/constitution/rules.js');
    expect(read('overgear/CLAUDE.md')).toMatch(/@AGENTS.md/);
    expect(read('overgear/AGENTS.md')).toMatch(/repository root/);
  });

  // Only the browser geometry and DOM selection used by the audit are stubbed; the audit itself runs unchanged.
  function fixture({ count = 3, tracks = '100px 100px', hasMore = true, ignored = false, hidden = false } = {}) {
    const style = { display: hidden ? 'none' : 'grid', visibility: 'visible', gridTemplateColumns: tracks };
    const win = { getComputedStyle: () => style };
    const grid = { querySelectorAll: () => Array.from({ length: count }, () => ({})) };
    const listing = {
      tagName: 'DIV', closest: () => ignored,
      getBoundingClientRect: () => ({ width: 200, height: 200 }),
      querySelector: () => grid,
    };
    return {
      ownerDocument: { defaultView: win },
      closest: () => null,
      getBoundingClientRect: () => ({ width: 0, height: 0 }),
      querySelectorAll: (selector) => (selector === '[data-slot="product-listing"][data-has-more]' && hasMore ? [listing] : []),
    };
  }

  test('an incomplete row of a listing is reported as OG2, on top of the shared layout checks', () => {
    const host = fixture();
    const oldWidth = globalThis.innerWidth;
    const oldStyle = globalThis.getComputedStyle;
    globalThis.innerWidth = 1000;
    globalThis.getComputedStyle = host.ownerDocument.defaultView.getComputedStyle;
    try {
      const found = spacingBalance(host);
      expect(found).toHaveLength(1);
      expect(found[0].id).toBe('OG2');
      expect(found[0].gap).toBe(3);
      expect(found[0].around).toBe('2');
    } finally {
      globalThis.innerWidth = oldWidth;
      globalThis.getComputedStyle = oldStyle;
    }
  });

  describe.each([
    ['whole rows', { count: 4 }],
    ['the last incomplete row', { hasMore: false }],
    ['ignored examples', { ignored: true }],
    ['hidden listings', { hidden: true }],
    ['unresolved layout', { tracks: 'none' }],
  ])('the listing audit accepts %s', (_name, options) => {
    test('nothing is reported', () => expect(listingBalance(fixture(options))).toEqual([]));
  });
});

describe('banner', () => {
  describe('Overgear constitution banner', () => {
    test('shows shared and store violations with the store documentation link', () => {
      render(<ConstitutionBanner defaultOpen violations={['A1', 'OG3']} />);
      expect(screen.getByText(rule('A1').do)).toBeInTheDocument();
      expect(screen.getByText(rule('OG3').do)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Read the constitution' })).toHaveAttribute('href', 'https://baseuikit.vercel.app/overgear/CONSTITUTION.md');
    });
    test('the shared banner does not silently accept store ids', () => {
      expect(() => render(<BaseBanner violations={['OG3']} />)).toThrow(/Unknown/);
    });
  });
});

describe('the checks of the rules', () => {
  test('every script a rule of Overgear names is in the list of the checks, and exists', async () => {
    const { CHECKS } = await import('../../tools/check/manifest.mjs');
    const scripts = new Set(CHECKS.map((c) => c.script));
    for (const r of RULES.filter((x) => x.tool)) {
      expect(existsSync(r.tool), `${r.id}: ${r.tool}`).toBe(true);
      expect(scripts.has(r.tool), `${r.id}: ${r.tool} is not in tools/check/manifest.mjs`).toBe(true);
    }
  });
  test('a retired id is not a rule', () => {
    for (const id of Object.keys(RETIRED)) expect(RULES.some((r) => r.id === id), id).toBe(false);
  });
});
