#!/usr/bin/env node
// What to run for a change, by the size of the change. It reads the files that changed (the working tree against HEAD, or the files you name) and says the tier of the change and the commands that tier calls for;
// with --run it runs them. The tiers keep the cost in step with the risk: a local tweak of one page does not need the slow audits, a change of a token does.
//
//   node tools/check/plan.mjs                      # the plan for the files changed since HEAD
//   node tools/check/plan.mjs --run                # and run it
//   node tools/check/plan.mjs --full               # include the slow checks (a minute or more) whatever the tier
//   node tools/check/plan.mjs overgear/example/wallet-page.jsx src/components.css     # the plan for these files
//
// T0  text only (documents, copy, pictures)          nothing to run
// T1  a page of the example (one place, local look)  the unit tests of the example, the quick checks that name the file; then look at it: a screenshot, not an audit
// T2  a shared part of the example (ui, shell, store, the cores, the audience, the theme)  all the unit tests and the checks that name the file, the slow ones too
// T3  baseui itself (tokens, styles, components, icons, the rules, the tools)  all the unit tests, the build, the types, every check that names the file, the slow ones too
import { execSync, spawnSync } from 'node:child_process';
import { CHECKS, touchesFile, globToRegExp } from './manifest.mjs';

const args = process.argv.slice(2);
const run = args.includes('--run');
const full = args.includes('--full');
const named = args.filter((a) => !a.startsWith('--'));
const sh = (cmd) => execSync(cmd, { encoding: 'utf8' }).split('\n').map((l) => l.trim()).filter(Boolean);
const files = named.length ? named : [...new Set([...sh('git diff --name-only HEAD'), ...sh('git ls-files --others --exclude-standard')])].filter((f) => !/(^|\/)(node_modules|lib|vendor)\//.test(f));

// the tier of a file: the first pattern that fits decides
const LEVELS = [
  [0, ['*.md', '**/*.md', 'docs/**', 'overgear/example/assets/**', 'overgear/fonts/**', 'llms.txt', 'registry.json', 'r/**', 'types/**', 'tailwind.css']],
  [3, ['tokens.css', 'src/**', 'tools/**', 'package.json', 'vitest.config.js', 'tests/**', 'overgear/constitution/**', 'overgear/tools/**', 'overgear/tests/**']],
  [2, ['overgear/audience.js', 'overgear/theme.js', 'overgear/index.jsx', 'overgear/example/ui.jsx', 'overgear/example/order.jsx', 'overgear/example/shell.jsx', 'overgear/example/util.js', 'overgear/example/store.jsx', 'overgear/example/data.js', 'overgear/example/*-core.js']],
  [1, ['overgear/example/**']],
];
const levelOf = (file) => (LEVELS.find(([, globs]) => globs.some((g) => globToRegExp(g).test(file))) || [3])[0];
const tier = files.length ? Math.max(...files.map(levelOf)) : 0;

const picked = CHECKS.filter((c) => files.some((f) => touchesFile(c, f)));
const slow = (c) => c.cost > 60;
const chosen = tier === 0 ? [] : picked.filter((c) => full || tier >= 2 || !slow(c));
const skipped = picked.filter((c) => !chosen.includes(c));
const commands = [];
if (tier >= 1) commands.push(tier === 1 ? 'npx vitest run overgear' : 'npx vitest run');
if (tier >= 3) commands.push('npm run build', 'npm run typecheck');
if (chosen.length) commands.push(`node tools/check/all.mjs ${chosen.length === 1 ? chosen[0].name : chosen.map((c) => c.name).join(',')}`);

const seconds = chosen.reduce((n, c) => n + c.cost, 0) + (tier >= 1 ? 5 : 0) + (tier >= 3 ? 40 : 0);
console.log(`Changed files: ${files.length}. Tier T${tier}${tier === 0 ? ' (text only)' : tier === 1 ? ' (a page of the example)' : tier === 2 ? ' (a shared part of the example)' : ' (baseui itself)'}.`);
if (!commands.length) console.log('Nothing to run.');
else { console.log(`Run (about ${Math.round(seconds)}s):`); for (const c of commands) console.log(`  ${c}`); }
if (tier === 1) console.log('Then look at the page (a screenshot at 1440 and 390): a local change is judged by eye, not by an audit.');
if (skipped.length) console.log(`Skipped as slow for T${tier} (add --full): ${skipped.map((c) => `${c.name} ~${c.cost}s`).join(', ')}.`);

if (run && commands.length) {
  for (const cmd of commands) {
    console.log(`\n$ ${cmd}`);
    const r = spawnSync(cmd, { shell: true, stdio: 'inherit' });
    if (r.status) { console.log(`\nFailed: ${cmd}`); process.exit(r.status); }
  }
  console.log('\nThe plan passed.');
}
