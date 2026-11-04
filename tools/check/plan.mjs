#!/usr/bin/env node
// What to run for a change, by the risk of the change. It reads the files that changed (the working tree against HEAD, or the files you name), says the tier and the commands
// the tier calls for, and with --run runs them. Few rules, kept: the machine checks what a person cannot see at a glance (logic, types, contracts of components,
// layout across pages), the eye judges a look. A tweak of one page costs seconds; a change of baseui runs everything, which is about two minutes.
//
//   node tools/check/plan.mjs                      # the plan for the files changed since HEAD
//   node tools/check/plan.mjs --run                # and run it (npm run verify:changed)
//   node tools/check/plan.mjs --full               # every check, whatever the tier (npm run verify:full)
//   node tools/check/plan.mjs overgear/example/wallet-page.jsx src/components.css     # the plan for these files
//
// T0  text only (documents, copy, pictures)                                     nothing to run
// T1  a page of the example: one place, a local look                           the unit tests of Overgear, the types, the quick checks that name the file (15 s or less); then a look
// T2  a shared part of Overgear: its components, ui, order, shell, store,      the unit tests of Overgear, the types, every check that names the file
//     the cores, the audience, the theme, its rules
// T3  baseui itself: tokens, styles, components, the rules, the harness of the  all the unit tests, the build, the types, every check that names the file
//     checks
// A test or a check that changes alone runs itself (and the unit tests if it is one): a new assertion does not need the whole suite.
import { execSync, spawnSync } from 'node:child_process';
import { CHECKS, touchesFile, globToRegExp } from './manifest.mjs';

const args = process.argv.slice(2);
const run = args.includes('--run');
const full = args.includes('--full');
const named = args.filter((a) => !a.startsWith('--'));
const sh = (cmd) => execSync(cmd, { encoding: 'utf8' }).split('\n').map((l) => l.trim()).filter(Boolean);
const files = named.length ? named : [...new Set([...sh('git diff --name-only HEAD'), ...sh('git ls-files --others --exclude-standard')])].filter((f) => !/(^|\/)(node_modules|lib|vendor)\//.test(f));

// what a file is: the first pattern that fits decides
const KINDS = [
  ['text', ['*.md', '**/*.md', 'docs/**', 'overgear/example/assets/**', 'overgear/fonts/**', 'llms.txt', 'registry.json', 'r/**', 'types/**', 'tailwind.css', 'CHANGELOG.md']],
  ['test', ['tests/**', 'overgear/tests/**']],
  ['check', ['tools/check/*.mjs', 'overgear/tools/check/*.mjs']],
  ['baseui', ['tokens.css', 'src/**', 'tools/**', 'package.json', 'vitest.config.js', 'site/**', 'templates/**']],
  ['shared', ['overgear/components/**', 'overgear/constitution/**', 'overgear/tools/**', 'overgear/*.js', 'overgear/*.jsx', 'overgear/*.css', 'overgear/example/ui.jsx', 'overgear/example/order.jsx', 'overgear/example/shell.jsx', 'overgear/example/util.js', 'overgear/example/store.jsx', 'overgear/example/data.js', 'overgear/example/*-core.js', 'overgear/example/order-seed.js', 'overgear/example/app.jsx']],
  ['page', ['overgear/example/**', 'overgear/showcase/**']],
];
const kindOf = (file) => (KINDS.find(([, globs]) => globs.some((g) => globToRegExp(g).test(file))) || ['baseui'])[0];
const kinds = new Set(files.map(kindOf));
// the harness of the checks (the runner, the sweep, the plan, the manifest) is baseui: a change of it runs everything
const harness = files.some((f) => /^tools\/(lib|check\/(all|plan|manifest))/.test(f));
const tier = harness || kinds.has('baseui') ? 3 : kinds.has('shared') ? 2 : kinds.has('page') ? 1 : 0;
const changedTests = files.filter((f) => kindOf(f) === 'test');
const changedChecks = CHECKS.filter((c) => files.includes(c.script));

const QUICK = 15;
const picked = CHECKS.filter((c) => full || changedChecks.includes(c) || files.some((f) => touchesFile(c, f)));
const chosen = picked.filter((c) => full || tier >= 2 || c.cost <= QUICK || changedChecks.includes(c));
const skipped = picked.filter((c) => !chosen.includes(c));
const code = tier >= 1 || changedTests.length || changedChecks.length;
const commands = [];
if (full || tier >= 3) commands.push('npx vitest run');
else if (tier >= 1) commands.push('npx vitest run overgear');
else if (changedTests.length) commands.push(`npx vitest run ${changedTests.join(' ')}`);
if (full || tier >= 3) commands.push('npm run build');
if (code || full) commands.push('npm run typecheck');
if (chosen.length) commands.push(`node tools/check/all.mjs ${chosen.length === 1 ? `${chosen[0].name},${chosen[0].name}` : chosen.map((c) => c.name).join(',')}`);

// about how long: the unit tests, the build and the types, then the checks, three at a time (the longest one is the floor)
const browser = chosen.length ? Math.max(Math.max(...chosen.map((c) => c.cost)), chosen.reduce((n, c) => n + c.cost, 0) / 2.2) : 0;
const seconds = (full || tier >= 3 ? 20 + 6 : tier >= 1 ? 7 : changedTests.length ? 5 : 0) + (code || full ? 4 : 0) + browser;
const label = full ? 'everything' : tier === 0 ? (code ? 'a test or a check' : 'text only') : tier === 1 ? 'a page of the example' : tier === 2 ? 'a shared part of Overgear' : 'baseui itself';
console.log(`Changed files: ${files.length}. Tier T${tier} (${label}).`);
if (!commands.length) console.log('Nothing to run.');
else { console.log(`Run (about ${Math.round(seconds)}s):`); for (const c of commands) console.log(`  ${c}`); }
if (tier === 1 && !full) console.log('Then look at the page (a screenshot at 1440 and 390): a local look is judged by eye, not by an audit.');
if (skipped.length) console.log(`Left for a shared change or --full: ${skipped.map((c) => `${c.name} ~${c.cost}s`).join(', ')}.`);

if (run && commands.length) {
  const t0 = Date.now();
  for (const cmd of commands) {
    console.log(`\n$ ${cmd}`);
    const r = spawnSync(cmd, { shell: true, stdio: 'inherit' });
    if (r.status) { console.log(`\nFailed: ${cmd}`); process.exit(r.status); }
  }
  console.log(`\nThe plan passed (${Math.round((Date.now() - t0) / 1000)}s).`);
}
