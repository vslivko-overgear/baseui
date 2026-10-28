#!/usr/bin/env node
// baseui CLI: copies component sources (with everything they import) into your project, shadcn style.
//
//   npx baseui list
//   npx baseui init [--dir baseui]
//   npx baseui add button text-field select [--dir baseui] [--force]
import { existsSync } from 'node:fs';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(await readFile(join(pkg, 'registry.json'), 'utf8'));
const [command, ...rest] = process.argv.slice(2);
const flags = { dir: 'baseui', force: false };
const names = [];
for (let i = 0; i < rest.length; i++) {
  if (rest[i] === '--dir') flags.dir = rest[++i];
  else if (rest[i] === '--force') flags.force = true;
  else names.push(rest[i]);
}
const target = resolve(process.cwd(), flags.dir);

const fail = (message) => { console.error(`baseui: ${message}`); process.exit(1); };

// Every file a component needs: its own sources and all they import by a relative path.
async function closure(entries) {
  const seen = new Set();
  const visit = async (rel) => {
    if (seen.has(rel)) return;
    seen.add(rel);
    if (!/\.m?js$/.test(rel)) return;
    const src = await readFile(join(pkg, rel), 'utf8');
    for (const m of src.matchAll(/(?:from|import)\s*\(?\s*['"](\.{1,2}\/[^'"]+)['"]/g)) await visit(relative(pkg, resolve(pkg, dirname(rel), m[1])));
  };
  for (const e of entries) await visit(e);
  return [...seen];
}

async function copy(rels) {
  let written = 0;
  for (const rel of rels) {
    const to = join(target, rel);
    if (existsSync(to) && !flags.force) { console.log(`  keep  ${relative(process.cwd(), to)} (exists, --force to overwrite)`); continue; }
    await mkdir(dirname(to), { recursive: true });
    await cp(join(pkg, rel), to);
    console.log(`  add   ${relative(process.cwd(), to)}`);
    written++;
  }
  return written;
}

if (command === 'list') {
  for (const item of registry.items) console.log(`${item.name.padEnd(22)} ${item.description.slice(0, 90)}`);
} else if (command === 'init') {
  await copy(['tokens.css', 'src/components.css']);
  console.log(`\nImport the styles once, and set data-theme="light|dark" on <html>:\n\n  import './${flags.dir}/tokens.css';\n  import './${flags.dir}/src/components.css';\n\nThe components need react and @base-ui/react:  npm i @base-ui/react react react-dom`);
} else if (command === 'add') {
  if (!names.length) fail('name a component: baseui add button   (baseui list shows them all)');
  const byName = new Map(registry.items.map((i) => [i.name, i]));
  const picked = new Set();
  const take = (name) => {
    const item = byName.get(name);
    if (!item) fail(`no component "${name}" (baseui list shows them all)`);
    if (picked.has(name)) return;
    picked.add(name);
    item.registryDependencies.forEach(take);
  };
  names.forEach(take);
  const entries = [...picked].flatMap((n) => byName.get(n).files.map((f) => f.path));
  const rels = await closure(entries);
  console.log(`Adding ${[...picked].join(', ')} to ${flags.dir}/`);
  await copy(rels);
  await copy(['tokens.css', 'src/components.css']);
  console.log(`\nDone. Components: ${flags.dir}/src/components/*.js, import them by path. Styles: tokens.css and src/components.css.`);
} else {
  console.log('Usage: baseui <list | init | add <component...>> [--dir baseui] [--force]');
  process.exit(command ? 1 : 0);
}
