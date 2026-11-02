#!/usr/bin/env node
// Builds the registry in the shadcn format, so `npx shadcn add <url>/r/<name>.json` installs a component:
//   registry.json   the index (https://ui.shadcn.com/schema/registry.json)
//   r/<name>.json   one item per component with the file contents inlined, plus baseui-core (shared code and styles)
//                   and baseui-icons (the icon catalog)
// Files keep the layout of this repository under baseui/ (target ~/baseui/...), so the relative imports between them hold.
//
//   node tools/build/registry.mjs
//   REGISTRY_URL=http://localhost:8765 node tools/build/registry.mjs     # for a local test
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const nameOf = (f) => f.replace(/\.jsx?$/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const BASE = (process.env.REGISTRY_URL || 'https://baseuikit.vercel.app').replace(/\/$/, '');
const SCHEMA = 'https://ui.shadcn.com/schema/registry-item.json';
const url = (name) => `${BASE}/r/${name}.json`;

// the file an import specifier points at (a .js whose source is .jsx resolves to the .jsx)
const resolveImport = (from, spec) => {
  const p = resolve(root, dirname(from), spec);
  for (const c of [p, p.replace(/\.js$/, '.jsx')]) if (existsSync(c) && /\.jsx?$/.test(c) && !(c.endsWith('.js') && existsSync(`${c}x`))) return relative(root, c);
  return null;
};
const importsOf = (src) => [...src.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
const npmOf = (specs) => [...new Set(specs.filter((i) => /^[@a-z]/.test(i) && !i.startsWith('.')).map((i) => (i.startsWith('@') ? i.split('/').slice(0, 2).join('/') : i.split('/')[0])))].filter((d) => !['react', 'react-dom'].includes(d));

// groups: each component is an item, lib/ is the icon catalog, everything else shared is core
const sourceFiles = async (dir) => {
  const names = (await readdir(join(root, dir))).filter((f) => /\.jsx?$/.test(f));
  return names.filter((f) => !(f.endsWith('.js') && names.includes(`${f}x`))).sort().map((f) => `${dir}/${f}`);
};
const components = await sourceFiles('src/components');
const shared = [...(await sourceFiles('src')), ...(await sourceFiles('src/constitution'))].filter((f) => !['src/index.js', 'src/index.jsx'].includes(f));
const iconChunks = new Set();
for (const entry of ['lib/line-HpXc8B8J.js', 'lib/solid-BKvSM0yD.js']) {
  const stack = [entry];
  while (stack.length) {
    const f = stack.pop();
    if (iconChunks.has(f)) continue;
    iconChunks.add(f);
    for (const spec of importsOf(await readFile(join(root, f), 'utf8')).filter((i) => i.startsWith('.'))) {
      const r = resolveImport(f, spec);
      if (r?.startsWith('lib/')) stack.push(r);
    }
  }
}
const icons = [...iconChunks].sort();
const core = shared;
const constitution = ['CONSTITUTION.md'];
const styles = ['tokens.css', 'src/components.css', 'tailwind.css'];

const groupOf = (file) => (components.includes(file) ? nameOf(file.split('/').pop()) : icons.includes(file) ? 'baseui-icons' : styles.includes(file) ? 'baseui-styles' : constitution.includes(file) ? 'baseui-constitution' : 'baseui-core');
const fileEntry = async (path, type) => ({ path, type, target: `~/baseui/${path}`, content: await readFile(join(root, path), 'utf8') });

async function item(name, type, files, extra = {}) {
  const contents = await Promise.all(files.map((f) => fileEntry(f, type)));
  const specs = [];
  const deps = new Set();
  for (const f of files) {
    if (!/\.jsx?$/.test(f)) continue;
    const src = await readFile(join(root, f), 'utf8');
    const all = importsOf(src);
    specs.push(...all);
    for (const spec of all.filter((i) => i.startsWith('.'))) {
      const target = resolveImport(f, spec);
      if (target && groupOf(target) !== name) deps.add(groupOf(target));
    }
  }
  return { $schema: SCHEMA, name, type, ...extra, dependencies: npmOf(specs), registryDependencies: [...deps].sort().map(url), files: contents };
}

const out = join(root, 'r');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const index = [];
const emit = async (it) => {
  await writeFile(join(out, `${it.name}.json`), `${JSON.stringify(it)}\n`);
  index.push({ ...it, files: it.files.map(({ content, ...f }) => f) });
};
await emit(await item('baseui-core', 'registry:lib', core, { title: 'baseui core', description: 'The shared code every component imports: React access, describe(), theme flags, floating and highlight hooks, the icon weight rule.' }));
await emit(await item('baseui-styles', 'registry:file', styles, { title: 'baseui styles', description: 'Tokens, component styles and the Tailwind v4 theme (tailwind.css). Import tokens.css and src/components.css once and set data-theme="light|dark" on <html>. Fonts: the tokens use Geist; load it yourself.' }));
await emit(await item('baseui-icons', 'registry:lib', icons, { title: 'baseui icons', description: 'The icon catalog: outline (line) and filled (solid) bundles used by Icon.' }));
await emit(await item('baseui-constitution', 'registry:file', constitution, { title: 'baseui constitution', description: 'The design rules and the protocol for agents that build prototypes: warn in the answer and put a ConstitutionBanner across the top when a request breaks a rule. Point your AGENTS.md at it.' }));
for (const f of components) {
  const src = await readFile(join(root, f), 'utf8');
  const exported = [...src.matchAll(/export (?:function|const|class) ([A-Z]\w*)/g)].map((m) => m[1]);
  const base = f.split('/').pop().replace(/\.jsx?$/, '');
  const description = (src.match(/describe\(\s*\w+,\s*(['"`])((?:\\.|(?!\1).)*)\1/) || [])[2] || '';
  const it = await item(nameOf(base), 'registry:ui', [f], { title: exported.find((n) => n === base) || exported[0] || base, description: description.replace(/\\'/g, "'") });
  it.registryDependencies = [...new Set([url('baseui-core'), url('baseui-styles'), ...it.registryDependencies, ...(base === 'ConstitutionBanner' ? [url('baseui-constitution')] : [])])];
  await emit(it);
}
// templates: a page and its shared kit and styles; each is a registry:block that installs next to the components it uses
const { TEMPLATES } = await import('../../src/templates/registry.js');
const itemOf = {};
for (const f of components) for (const m of (await readFile(join(root, f), 'utf8')).matchAll(/export (?:function|const|class) ([A-Z]\w*)/g)) itemOf[m[1]] = nameOf(f.split('/').pop());
for (const t of TEMPLATES) {
  const file = `src/templates/${t.category.toLowerCase().replace(/[^a-z]+/g, '-')}.jsx`;
  const it = await item(`template-${t.id}`, 'registry:block', [file, 'src/templates/_kit.jsx', 'src/templates/templates.css'], { title: t.title, description: t.description });
  it.registryDependencies = [...new Set([url('baseui-core'), url('baseui-styles'), ...it.registryDependencies, ...t.uses.filter((u) => itemOf[u]).map((u) => url(itemOf[u]))])].sort();
  await emit(it);
}
const registry = { $schema: 'https://ui.shadcn.com/schema/registry.json', name: 'baseui', homepage: 'https://baseuikit.vercel.app', items: index.sort((a, b) => a.name.localeCompare(b.name)) };
await writeFile(join(root, 'registry.json'), `${JSON.stringify(registry, null, 2)}\n`);
await writeFile(join(out, 'registry.json'), `${JSON.stringify(registry)}\n`);
console.log(`${index.length} items -> registry.json, r/*.json (${BASE})`);
