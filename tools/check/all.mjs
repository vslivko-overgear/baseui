#!/usr/bin/env node
// Runs every browser check (fixtures: the audit finds what it should; the others look for violations on real pages) against a static server it starts itself (so nothing has to be running), and exits 1 if any of them finds something.
//
//   node tools/check/all.mjs            # radii, sizes, fixtures, constitution, spacing (the templates), Overgear spacing
//   node tools/check/all.mjs radii      # only the ones whose name contains the word
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

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

const CHECKS = [
  ['radii', 'tools/check/radii.mjs'],
  ['sizes', 'tools/check/sizes.mjs'],
  ['fixtures', 'tools/check/fixtures.mjs'],
  ['sheets', 'tools/check/sheets.mjs'],
  ['constitution', 'tools/check/constitution.mjs'],
  ['spacing', 'tools/check/spacing.mjs'],
  ['overgear-spacing', 'overgear/tools/check/spacing.mjs'],
  ['overgear-tiles', 'overgear/tools/check/tiles.mjs'],
  ['overgear-catalog', 'overgear/tools/check/catalog.mjs'],
  ['overgear-search', 'overgear/tools/check/search.mjs'],
  ['overgear-wallet', 'overgear/tools/check/wallet.mjs'],
  ['overgear-paybar', 'overgear/tools/check/paybar.mjs'],
  ['overgear-checkout', 'overgear/tools/check/checkout.mjs'],
  ['dialog-focus', 'tools/check/dialog-focus.mjs'],
  ['hint', 'tools/check/hint.mjs'],
  ['overgear-order', 'overgear/tools/check/order.mjs'],
];
const only = process.argv[2];
let failed = 0;
for (const [name, script] of CHECKS.filter(([n]) => !only || n.includes(only))) {
  console.log(`\n== ${name}`);
  const code = await new Promise((resolve) => spawn('node', [script, base], { cwd: root, stdio: 'inherit' }).on('exit', resolve));
  if (code) { failed++; console.log(`-- ${name} failed (exit ${code})`); }
}
server.close();
console.log(failed ? `\n${failed} check${failed === 1 ? '' : 's'} failed` : '\nAll checks passed');
process.exit(failed ? 1 : 0);
