import { execSync } from 'node:child_process';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { TEMPLATES } from '../src/templates/registry.js';
import { compile } from '@tailwindcss/node';
import { TAILWIND_RADIUS } from '../tools/build/tailwind.mjs';

describe('token-names', () => {
  // One style for custom properties: --bui-lowercase-kebab-case. Every one a source reads with var() exists, so a renamed token cannot leave a silent hole.
  const files = execSync("git ls-files '*.css' '*.jsx' '*.js' '*.mjs' '*.html'", { encoding: 'utf8' })
    .split('\n').filter((f) => f && !/^(vendor|lib|r)\//.test(f) && !f.startsWith('tests/__') && !f.startsWith('tests/tokens.test'));
  const text = new Map(files.map((f) => [f, readFileSync(f, 'utf8')]));

  describe('token names', () => {
    test('tokens.css defines only lowercase kebab-case names', () => {
      const bad = [...readFileSync('tokens.css', 'utf8').matchAll(/(--bui-[A-Za-z0-9_-]+)\s*:/g)].map((m) => m[1]).filter((n) => !/^--bui-[a-z0-9]+(-{1,2}[a-z0-9]+)*$/.test(n));
      expect(bad).toEqual([]);
    });

    test('no source writes a --baseui name with a capital letter', () => {
      const bad = [];
      for (const [f, s] of text) for (const m of s.matchAll(/--bui-[A-Za-z0-9-]*[A-Z][A-Za-z0-9-]*/g)) bad.push(`${f}: ${m[0]}`);
      expect(bad).toEqual([]);
    });

    test('every var(--bui-…) a source reads is defined', () => {
      const defined = new Set();
      for (const s of text.values()) {
        for (const m of s.matchAll(/(--bui-[a-z0-9-]+)\s*:/g)) defined.add(m[1]);
        for (const m of s.matchAll(/['"`](--bui-[a-z0-9-]+)['"`]/g)) defined.add(m[1]); // set from script
      }
      const missing = [];
      for (const [f, s] of text) for (const m of s.matchAll(/var\((--bui-[a-z0-9-]+)(\s*,)?/g)) {
        const name = m[1];
        if (name.endsWith('-') || m[2] || defined.has(name)) continue; // a prefix of a name built in code, or a var with a fallback
        missing.push(`${f}: ${name}`);
      }
      expect(missing).toEqual([]);
    });
  });
});

describe('tokens-and-registry', () => {
  // The generated artifacts agree with their sources: the Tailwind theme with tokens.css, the registry with the files on disk.
  const tokens = readFileSync('tokens.css', 'utf8');
  const defined = new Set([...tokens.matchAll(/--(bui-[A-Za-z0-9-]+)\s*:/g)].map((m) => m[1]));

  describe('tailwind.css', () => {
    const tw = readFileSync('tailwind.css', 'utf8');
    test('every var() names a token that tokens.css defines', () => {
      const used = [...tw.matchAll(/var\(--(bui-[A-Za-z0-9-]+)\)/g)].map((m) => m[1]);
      expect(used.length).toBeGreaterThan(100);
      expect(used.filter((n) => !defined.has(n))).toEqual([]);
    });
    test('has color, radius and shadow keys and the type utilities', () => {
      expect(tw).toContain('--color-bg-accent:');
      expect(tw).toContain('--radius-xl:');
      expect(tw).toContain('--shadow-md:');
      expect(tw).toContain('@utility type-text-14-regular');
    });
  });

  describe('registry', () => {
    const index = JSON.parse(readFileSync('registry.json', 'utf8'));
    const names = new Set(index.items.map((i) => i.name));
    test('is a shadcn registry', () => {
      expect(index.$schema).toBe('https://ui.shadcn.com/schema/registry.json');
      expect(names.has('switch') && names.has('baseui-core') && names.has('baseui-styles') && names.has('baseui-icons')).toBe(true);
    });
    test('every item has a file with its content, and its dependencies are items', () => {
      for (const item of index.items) {
        const full = JSON.parse(readFileSync(`r/${item.name}.json`, 'utf8'));
        expect(full.files.length).toBeGreaterThan(0);
        for (const f of full.files) {
          expect(existsSync(f.path)).toBe(true);
          expect(f.target).toBe(`~/baseui/${f.path}`);
          expect(f.content.length).toBeGreaterThan(0);
        }
        for (const dep of full.registryDependencies) expect(names.has(dep.replace(/^.*\/r\//, '').replace(/\.json$/, ''))).toBe(true);
      }
    });
    test('every component source is an item', () => {
      const files = readdirSync('src/components').filter((f) => /\.jsx?$/.test(f));
      const sources = files.filter((f) => !(f.endsWith('.js') && files.includes(`${f}x`)));
      const templates = index.items.filter((i) => i.name.startsWith('template-'));
      expect(templates.length).toBe(TEMPLATES.length);
      expect(sources.length + 4 + templates.length).toBe(index.items.length);
    });
  });
});

describe('tailwind-conformance', () => {
  // baseui follows Tailwind's defaults: the spacing steps, the radius names and the durations mean the same size in both.
  const tokens = readFileSync('tokens.css', 'utf8');
  const px = (name) => parseFloat(tokens.match(new RegExp(`--bui-${name}:\\s*([\\d.]+)px`))?.[1]);
  const SPACING = { '0-5': 0.5, 1: 1, '1-5': 1.5, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 8: 8, 10: 10, 12: 12, 16: 16, 20: 20 };

  async function css(candidates) {
    const compiler = await compile('@import "tailwindcss/theme.css" layer(theme); @import "tailwindcss/utilities.css" layer(utilities);', {
      base: process.cwd(),
      onDependency() {},
    });
    return compiler.build(candidates);
  }

  describe('spacing', () => {
    test('every spacing token is the Tailwind step of the same name: spacing-N is N * 4px', () => {
      for (const [name, step] of Object.entries(SPACING)) expect(px(`spacing-${name}`), `spacing-${name}`).toBe(step * 4);
    });
    test('Tailwind computes its steps from a 4px unit, so p-4 is spacing-4 and -m-4 is its negative', async () => {
      const out = await css(['p-4', '-mx-4']);
      expect(out).toMatch(/--spacing:\s*0\.25rem/);
      expect(out).toMatch(/padding:\s*calc\(var\(--spacing\) \* 4\)/);
      expect(out).toMatch(/margin-inline:\s*calc\(var\(--spacing\) \* -4\)/);
    });
  });

  describe('radius', () => {
    test('the radius tokens carry Tailwind\u2019s names and sizes, and tailwind.css maps them', () => {
      const tw = readFileSync('tailwind.css', 'utf8');
      for (const [key, size] of Object.entries(TAILWIND_RADIUS)) {
        expect(px(`radius-${key}`), `radius-${key}`).toBe(size);
        expect(tw).toContain(`--radius-${key}: var(--bui-radius-${key});`);
      }
    });
    test('the sizes without a Tailwind name are the custom radii 10, 14, 20 and 28', () => {
      const named = new Set(['none', 'full', 'scale', ...Object.keys(TAILWIND_RADIUS)]);
      const rest = [...tokens.matchAll(/^\s*--bui-radius-([\w-]+):\s*[\d.]+px/gm)].map((m) => m[1]).filter((n) => !named.has(n));
      expect([...new Set(rest)].sort()).toEqual(['custom-10', 'custom-14', 'custom-20', 'custom-28']);
    });
    test('Tailwind’s own default for those names is that size', async () => {
      const out = await css(Object.keys(TAILWIND_RADIUS).map((k) => `rounded-${k}`));
      const sizes = { sm: 0.25, md: 0.375, lg: 0.5, xl: 0.75, '2xl': 1, '3xl': 1.5, '4xl': 2 };
      for (const [k, rem] of Object.entries(sizes)) expect(out).toMatch(new RegExp(`--radius-${k}:\\s*${rem}rem`));
      expect(TAILWIND_RADIUS).toEqual({ sm: 4, md: 6, lg: 8, xl: 12, '2xl': 16, '3xl': 24, '4xl': 32 });
    });
  });

  describe('motion', () => {
    test('the durations are Tailwind’s duration-150, 300 and 500', () => {
      expect([tokens.match(/--bui-duration-150:\s*(\d+)ms/)[1], tokens.match(/--bui-duration-300:\s*(\d+)ms/)[1], tokens.match(/--bui-duration-500:\s*(\d+)ms/)[1]]).toEqual(['150', '300', '500']);
    });
  });
});

describe('the clear button of a field', () => {
  test('it shows only while the field is in focus (the text field and the typeahead)', () => {
    const css = readFileSync('src/components.css', 'utf8');
    expect(css).toContain('[data-filled]:focus-within .bui-input__clear-btn');
    expect(css).not.toMatch(/\n\[data-filled\] \.bui-input__clear-btn/);
    expect(css).toContain('.bui-field:not(:focus-within) .bui-typeahead__clear');
  });
});

describe('the Collapsible is an island', () => {
  test('a section is a block on the secondary background with a radius, and a group is islands apart: no divider lines', () => {
    const css = readFileSync('src/components.css', 'utf8');
    const block = (sel) => css.slice(css.indexOf(sel), css.indexOf('}', css.indexOf(sel)));
    expect(block('.bui-collapsible {')).toMatch(/background: var\(--bui-background-secondary\)/);
    expect(block('.bui-collapsible {')).toMatch(/border-radius: var\(--bui-radius-block\)/);
    expect(block('.bui-collapsible {')).not.toMatch(/box-shadow/);
    expect(block('.bui-collapsible-group {')).toMatch(/gap: var\(--bui-spacing-2\)/);
    expect(block('.bui-collapsible-group {')).not.toMatch(/box-shadow/);
  });
});

