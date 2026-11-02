import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { RULES as BASE_RULES, rule as baseRule } from '../../src/constitution/rules.js';
import { RULES, APPLICABLE_RULES, rule } from '../constitution/rules.js';
import { listingBalance, spacingBalance } from '../tools/audits/spacing-balance.js';
import { spacingBalance as baseSpacingBalance } from '../../tools/audits/spacing-balance.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = (path) => readFileSync(resolve(root, path), 'utf8');

test('Overgear opts into the shared rules without changing the baseui rule set', () => {
  for (const id of ['OG1', 'OG2', 'OG3', 'U12', 'U13', 'U14']) assert.throws(() => baseRule(id), /Unknown/);
  assert.deepEqual(RULES.filter((r) => r.legacyId).map((r) => [r.legacyId, r.id]), [['U12', 'OG1'], ['U13', 'OG2'], ['U14', 'OG3']]);
  assert.deepEqual(APPLICABLE_RULES, [...BASE_RULES, ...RULES]);
  assert.equal(rule('A1'), baseRule('A1'));
  assert.equal(rule('OG3').title, 'Catalog and listing are two things');
  assert.throws(() => rule('OG9999'), /Unknown/);
  assert.equal(new Set(APPLICABLE_RULES.map((r) => r.id)).size, APPLICABLE_RULES.length);
});

test('new store rules have their own namespace and local checks', () => {
  for (const r of RULES) {
    assert.match(r.id, /^OG\d+$/);
    assert.ok(['must', 'should'].includes(r.level));
    assert.ok(['auto', 'tool', 'review'].includes(r.check));
    for (const key of ['title', 'do', 'dont', 'why', 'source']) assert.ok(r[key], `${r.id}.${key}`);
    assert.ok(r.signals.length);
    if (r.check === 'tool') {
      assert.ok(r.tool.startsWith('overgear/tools/'));
      assert.ok(existsSync(resolve(root, r.tool)));
    }
  }
});

test('shared runtime and spacing audit do not depend on Overgear, even transitively', () => {
  const seen = new Set();
  const walk = (path) => {
    const full = resolve(root, path);
    if (seen.has(full)) return;
    seen.add(full);
    assert.ok(!full.startsWith(resolve(root, 'overgear') + '/'), full);
    const source = readFileSync(full, 'utf8').replace(/^\s*\/\/.*$/gm, '');
    for (const [, spec] of source.matchAll(/(?:from\s*|import\s*\(?\s*)['"](\.[^'"]+)['"]/g)) {
      const target = resolve(dirname(full), spec);
      walk(existsSync(target + 'x') ? target + 'x' : target);
    }
  };
  walk('src/index.jsx');
  walk('tools/audits/spacing-balance.js');
});

test('shared generated documents and registry do not ship store rules', () => {
  for (const path of ['CONSTITUTION.md', 'docs/foundations/constitution.md', 'r/baseui-core.json', 'r/baseui-constitution.json']) {
    const source = read(path);
    for (const r of RULES) {
      assert.ok(!source.includes(r.title), `${path}: ${r.title}`);
      assert.ok(!source.includes(r.do), `${path}: ${r.id}`);
    }
  }
  const core = JSON.parse(read('r/baseui-core.json'));
  for (const f of core.files) assert.ok(!f.path.startsWith('overgear/'));
});

test('generated local documents contain every local rule and route future changes locally', () => {
  const md = read('overgear/CONSTITUTION.md');
  for (const r of RULES) {
    assert.ok(md.includes(`### ${r.id} ${r.title}`));
    assert.ok(md.includes(r.do));
    assert.ok(md.includes(r.dont.replace(/^Do not /, '')));
  }
  for (const file of ['AGENTS.md', 'overgear/AGENTS.md']) assert.ok(read(file).includes('overgear/constitution/rules.js'));
  assert.match(read('overgear/CLAUDE.md'), /@AGENTS.md/);
  assert.match(read('overgear/AGENTS.md'), /repository root/);
});

// Only the browser geometry and DOM selection used by the audit are stubbed.
// The shared and local audit implementations themselves run unchanged.
function fixture({ count = 3, tracks = '100px 100px', hasMore = true, ignored = false, hidden = false } = {}) {
  const style = { display: hidden ? 'none' : 'grid', visibility: 'visible', gridTemplateColumns: tracks };
  const win = { getComputedStyle: () => style };
  const grid = { querySelectorAll: () => Array.from({ length: count }, () => ({})) };
  const listing = {
    tagName: 'DIV', closest: () => ignored,
    getBoundingClientRect: () => ({ width: 200, height: 200 }),
    querySelector: () => grid,
  };
  return {
    ownerDocument: { defaultView: win },
    closest: () => null,
    getBoundingClientRect: () => ({ width: 0, height: 0 }),
    querySelectorAll: (selector) => selector === '[data-slot="product-listing"][data-has-more]' && hasMore ? [listing] : [],
  };
}

test('incomplete rows are reported only when the Overgear audit is selected', () => {
  const host = fixture();
  const oldWidth = globalThis.innerWidth;
  const oldStyle = globalThis.getComputedStyle;
  globalThis.innerWidth = 1000;
  globalThis.getComputedStyle = host.ownerDocument.defaultView.getComputedStyle;
  try {
    assert.deepEqual(baseSpacingBalance(host), []);
    const found = spacingBalance(host);
    assert.equal(found.length, 1);
    assert.equal(found[0].id, 'OG2');
    assert.equal(found[0].gap, 3);
    assert.equal(found[0].around, '2');
  } finally {
    globalThis.innerWidth = oldWidth;
    globalThis.getComputedStyle = oldStyle;
  }
});

for (const [name, options] of [
  ['whole rows', { count: 4 }],
  ['the last incomplete row', { hasMore: false }],
  ['ignored examples', { ignored: true }],
  ['hidden listings', { hidden: true }],
  ['unresolved layout', { tracks: 'none' }],
]) test(`the listing audit accepts ${name}`, () => assert.deepEqual(listingBalance(fixture(options)), []));

test('package consumers explicitly opt into Overgear', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.exports['.'].default, './src/index.js');
  assert.equal(pkg.exports['./overgear'].default, './overgear/index.js');
  assert.ok(pkg.files.includes('overgear/constitution/rules.js'));
  assert.ok(!pkg.files.includes('overgear'));
});
