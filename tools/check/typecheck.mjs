#!/usr/bin/env node
// Type-checks the sources with tsc (checkJs): .jsx and plain .js under src, site and overgear. The .js files built from .jsx are output, not source:
// they are read when something imports them, but what tsc says about them is dropped (esbuild loses the JSDoc casts there).
//
//   node tools/check/typecheck.mjs
import { readdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const files = [];
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const names = new Set(entries.map((e) => e.name));
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'tests') await walk(p); }
    else if (e.name.endsWith('.jsx') || (e.name.endsWith('.js') && !names.has(`${e.name}x`))) files.push(p.slice(root.length + 1));
  }
}
for (const d of ['src', 'site', 'overgear']) await walk(join(root, d));

const config = join(root, 'tsconfig.check.json');
await writeFile(config, JSON.stringify({
  compilerOptions: {
    allowJs: true, checkJs: true, noEmit: true, jsx: 'react-jsx', module: 'esnext', moduleResolution: 'bundler', target: 'es2022',
    lib: ['es2023', 'dom', 'dom.iterable'], skipLibCheck: true, strict: false, noImplicitAny: false, allowImportingTsExtensions: true,
    types: [], maxNodeModuleJsDepth: 0,
  },
  files,
}));
const r = spawnSync('npx', ['tsc', '-p', config, '--pretty', 'false'], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 28 });
await rm(config);
// Only our sources count (the compiled icon bundles in lib/ are not checked). A JS component's props come from its destructuring,
// where every name looks required; the real prop contract is describe() (and types/), so errors about missing or loosely typed props at call sites (TS2739-41, TS2345, TS2322, TS2353) are skipped. What is left: unknown names, wrong imports, arity, members that do not exist.
const SKIP = new Set(['TS2739', 'TS2740', 'TS2741', 'TS2345', 'TS2353', 'TS2322', 'TS2786', 'TS2607']);
const isBuilt = (l) => { const f = l.split('(')[0]; return f.endsWith('.js') && existsSync(join(root, `${f}x`)); };
const lines = r.stdout.split('\n').filter((l) => /^(src|site|overgear)\//.test(l) && !isBuilt(l) && !SKIP.has((l.match(/error (TS\d+)/) || [])[1]));
console.log(lines.join('\n'));
console.log(`${lines.length} problems in ${files.length} files`);
process.exit(lines.length ? 1 : 0);
