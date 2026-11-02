// baseui follows Tailwind's defaults: the spacing steps, the radius names and the durations mean the same size in both.
import { readFileSync } from 'node:fs';
import { compile } from '@tailwindcss/node';
import { describe, expect, test } from 'vitest';
import { TAILWIND_RADIUS } from '../tools/build/tailwind.mjs';

const tokens = readFileSync('tokens.css', 'utf8');
const px = (name) => parseFloat(tokens.match(new RegExp(`--baseui-${name}:\\s*([\\d.]+)px`))?.[1]);
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
      expect(tw).toContain(`--radius-${key}: var(--baseui-radius-${key});`);
    }
  });
  test('the sizes without a Tailwind name are the custom radii 10, 14, 20 and 28', () => {
    const named = new Set(['none', 'full', 'scale', ...Object.keys(TAILWIND_RADIUS)]);
    const rest = [...tokens.matchAll(/^\s*--baseui-radius-([\w-]+):\s*[\d.]+px/gm)].map((m) => m[1]).filter((n) => !named.has(n));
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
    expect([tokens.match(/--baseui-duration-150:\s*(\d+)ms/)[1], tokens.match(/--baseui-duration-300:\s*(\d+)ms/)[1], tokens.match(/--baseui-duration-500:\s*(\d+)ms/)[1]]).toEqual(['150', '300', '500']);
  });
});
