#!/usr/bin/env node
// Builds registry.json: one item per component in src/components, in the shape of a shadcn registry
// (name, files, dependencies between components, the stylesheets it needs). No dependencies, no browser.
//
//   node tools/build-registry.mjs
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'src', 'components');
const files = (await readdir(dir)).filter((f) => f.endsWith('.js')).sort();
const nameOf = (f) => f.replace(/\.js$/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const items = [];
for (const f of files) {
  const src = await readFile(join(dir, f), 'utf8');
  const imports = [...src.matchAll(/from\s+'([^']+)'/g)].map((m) => m[1]);
  const registryDependencies = [...new Set(imports.filter((i) => /^\.\/[A-Z]/.test(i)).map((i) => nameOf(i.replace(/^\.\/|\.js$/g, ''))))].filter((n) => n !== nameOf(f));
  const shared = [...new Set(imports.filter((i) => /^\.\.\/(?!stories)/.test(i)).map((i) => i.replace(/^\.\.\//, 'src/')))];
  const exported = [...src.matchAll(/export (?:function|const) ([A-Z]\w*)/g)].map((m) => m[1]);
  const description = (src.match(/describe\(\w+,\s*(['"`])((?:\\.|(?!\1).)*)\1/) || [])[2] || '';
  items.push({
    name: nameOf(f),
    type: 'registry:component',
    title: exported.find((n) => n === f.replace(/\.js$/, '')) || exported[0] || f.replace(/\.js$/, ''),
    description: description.replace(/\\'/g, "'"),
    exports: exported,
    files: [{ path: `src/components/${f}`, type: 'registry:component' }],
    registryDependencies,
    sharedFiles: shared,
    css: ['tokens.css', 'lib/components.css', 'src/components.css'],
  });
}
await writeFile(join(root, 'registry.json'), `${JSON.stringify({ name: 'baseui', homepage: 'https://baseuikit.vercel.app', items }, null, 2)}\n`);
console.log(`${items.length} components -> registry.json`);
