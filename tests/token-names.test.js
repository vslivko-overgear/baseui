import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

// One style for custom properties: --baseui-lowercase-kebab-case. Every one a source reads with var() exists, so a renamed token cannot leave a silent hole.
const files = execSync("git ls-files '*.css' '*.jsx' '*.js' '*.mjs' '*.html'", { encoding: 'utf8' })
  .split('\n').filter((f) => f && !/^(vendor|lib|r)\//.test(f) && !f.startsWith('tests/__') && !f.startsWith('tests/token-names'));
const text = new Map(files.map((f) => [f, readFileSync(f, 'utf8')]));

describe('token names', () => {
  test('tokens.css defines only lowercase kebab-case names', () => {
    const bad = [...readFileSync('tokens.css', 'utf8').matchAll(/(--baseui-[A-Za-z0-9_-]+)\s*:/g)].map((m) => m[1]).filter((n) => !/^--baseui-[a-z0-9]+(-{1,2}[a-z0-9]+)*$/.test(n));
    expect(bad).toEqual([]);
  });

  test('no source writes a --baseui name with a capital letter', () => {
    const bad = [];
    for (const [f, s] of text) for (const m of s.matchAll(/--baseui-[A-Za-z0-9-]*[A-Z][A-Za-z0-9-]*/g)) bad.push(`${f}: ${m[0]}`);
    expect(bad).toEqual([]);
  });

  test('every var(--baseui-…) a source reads is defined', () => {
    const defined = new Set();
    for (const s of text.values()) {
      for (const m of s.matchAll(/(--baseui-[a-z0-9-]+)\s*:/g)) defined.add(m[1]);
      for (const m of s.matchAll(/['"`](--baseui-[a-z0-9-]+)['"`]/g)) defined.add(m[1]); // set from script
    }
    const missing = [];
    for (const [f, s] of text) for (const m of s.matchAll(/var\((--baseui-[a-z0-9-]+)(\s*,)?/g)) {
      const name = m[1];
      if (name.endsWith('-') || m[2] || defined.has(name)) continue; // a prefix of a name built in code, or a var with a fallback
      missing.push(`${f}: ${name}`);
    }
    expect(missing).toEqual([]);
  });
});
