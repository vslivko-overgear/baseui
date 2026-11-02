// The generated artifacts agree with their sources: the Tailwind theme with tokens.css, the registry with the files on disk.
import { TEMPLATES } from '../src/templates/registry.js';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

const tokens = readFileSync('tokens.css', 'utf8');
const defined = new Set([...tokens.matchAll(/--(baseui-[A-Za-z0-9-]+)\s*:/g)].map((m) => m[1]));

describe('tailwind.css', () => {
  const tw = readFileSync('tailwind.css', 'utf8');
  test('every var() names a token that tokens.css defines', () => {
    const used = [...tw.matchAll(/var\(--(baseui-[A-Za-z0-9-]+)\)/g)].map((m) => m[1]);
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
