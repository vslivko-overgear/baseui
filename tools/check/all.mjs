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
// `only` is a word, or several words with commas (the names of tools/check/manifest.mjs): one word: the checks whose name contains it; several: exactly those names
const words = only ? only.split(',') : [];
const chosen = CHECKS.filter((c) => !words.length || (words.length === 1 ? c.name.includes(words[0]) : words.includes(c.name)));
// several checks at a time (CHECK_JOBS, 3 by default): each prints when it ends, so the output of one is not mixed with another
const JOBS = Math.max(1, Number(process.env.CHECK_JOBS) || 3);
const started = Date.now();
const results = [];
let next = 0;
const runOne = ({ name, script }) => new Promise((resolve) => {
  const t0 = Date.now();
  let out = '';
  const child = spawn('node', [script, base], { cwd: root, env: { ...process.env, CHECK_CONCURRENCY: process.env.CHECK_CONCURRENCY || '3' } });
  child.stdout.on('data', (d) => { out += d; });
  child.stderr.on('data', (d) => { out += d; });
  child.on('exit', (code) => {
    const seconds = (Date.now() - t0) / 1000;
    console.log(`\n== ${name} (${seconds.toFixed(1)}s)\n${out.trimEnd()}`);
    if (code) console.log(`-- ${name} failed (exit ${code})`);
    results.push({ name, code, seconds });
    resolve();
  });
});
// the slowest first, so they do not end the run alone
const queue = [...chosen].sort((a, b) => b.cost - a.cost);
await Promise.all(Array.from({ length: Math.min(JOBS, queue.length) }, async () => { while (next < queue.length) await runOne(queue[next++]); }));
server.close();
const failed = results.filter((r) => r.code);
const total = ((Date.now() - started) / 1000).toFixed(1);
console.log(`\n${results.sort((a, b) => b.seconds - a.seconds).map((r) => `${r.name} ${r.seconds.toFixed(1)}s${r.code ? ' FAILED' : ''}`).join(', ')}`);
console.log(failed.length ? `\n${failed.length} check${failed.length === 1 ? '' : 's'} failed (${total}s)` : `\nAll checks passed (${total}s)`);
process.exit(failed.length ? 1 : 0);
