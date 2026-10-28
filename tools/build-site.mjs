#!/usr/bin/env node
// Builds public/: a copy of the static documentation site (index.html and everything it loads from the
// repository root), so a host that expects a build output directory, like Vercel, can serve it as is.
//
//   node tools/build-site.mjs
import { cp, readdir, rm, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public');
const skip = new Set(['public', 'node_modules', '.git', '.vercel', '.github']);

await rm(out, { recursive: true, force: true });
await mkdir(out);
for (const entry of await readdir(root)) {
  if (skip.has(entry)) continue;
  await cp(join(root, entry), join(out, entry), { recursive: true });
}
console.log('public/ written');
