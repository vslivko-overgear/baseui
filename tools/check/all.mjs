#!/usr/bin/env node
// Runs every browser check (fixtures: the audit finds what it should; the others look for violations on real pages) against a static server it starts itself (so nothing has to be running), and exits 1 if any of them finds something.
//
//   node tools/check/all.mjs            # radii, sizes, fixtures, constitution, spacing (the templates), Overgear spacing
//   node tools/check/all.mjs radii      # only the ones whose name contains the word (several: radii,sizes)
//   node tools/check/plan.mjs --run     # only the ones the changed files call for
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHECKS } from './manifest.mjs';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.otf': 'font/otf', '.ttf': 'font/ttf', '.md': 'text/plain' };

const server = createServer(async (req, res) => {
  try {
    let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
    let file = join(root, path);
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch { res.writeHead(404).end('not found'); }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const only = process.argv[2];
let failed = 0;
// `only` is a word, or several words with commas (the names of tools/check/manifest.mjs): one word: the checks whose name contains it; several: exactly those names
const words = only ? only.split(',') : [];
for (const { name, script } of CHECKS.filter((c) => !words.length || (words.length === 1 ? c.name.includes(words[0]) : words.includes(c.name)))) {
  console.log(`\n== ${name}`);
  const code = await new Promise((resolve) => spawn('node', [script, base], { cwd: root, stdio: 'inherit' }).on('exit', resolve));
  if (code) { failed++; console.log(`-- ${name} failed (exit ${code})`); }
}
server.close();
console.log(failed ? `\n${failed} check${failed === 1 ? '' : 's'} failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
