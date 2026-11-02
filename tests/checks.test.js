// The rules, the checks that find them and the defaults that serve them stay in step: a rule marked `auto` is found by the audit and the audit finds only rules marked
// `auto` or `tool`; a script named by a rule is one that tools/check/all.mjs runs, and every script it runs belongs to a rule; a default for agents names rules that exist.
import { readFileSync, existsSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { AGENT_DEFAULTS, RULES, RULES_BY_ID } from '../src/constitution/rules.js';

const read = (path) => readFileSync(path, 'utf8');
const idsFound = (path) => new Set([...read(path).matchAll(/\badd\('([A-Z]+\d+)'/g)].map((m) => m[1]));
const runners = [...read('tools/check/all.mjs').matchAll(/\['[\w-]+', '(tools\/check\/[\w.-]+)'\]/g)].map((m) => m[1]);

describe('rules and their checks', () => {
  test('a rule marked auto is found by the audit, and the audit finds nothing else', () => {
    const found = new Set([...idsFound('src/constitution/audit.js'), ...idsFound('src/constitution/audit-tabs.js')]);
    const auto = new Set(RULES.filter((r) => r.check === 'auto').map((r) => r.id));
    // D17 is marked tool: its script is the one that presses the tabs (audit-tabs.js)
    const viaTool = new Set(RULES.filter((r) => r.check === 'tool' && found.has(r.id)).map((r) => r.id));
    expect([...auto].filter((id) => !found.has(id)), 'auto rules the audit never reports').toEqual([]);
    expect([...found].filter((id) => !auto.has(id) && !viaTool.has(id)), 'ids the audit reports that are not auto rules').toEqual([]);
  });

  test('every script a rule names exists and is run by tools/check/all.mjs', () => {
    for (const r of RULES) {
      for (const tool of [r.check === 'tool' && r.tool, ...(r.tools || [])].filter(Boolean)) {
        expect(existsSync(tool), `${r.id}: ${tool}`).toBe(true);
        expect(runners, `${r.id}: ${tool} is not run by all.mjs`).toContain(tool);
      }
    }
  });

  test('every script all.mjs runs belongs to a rule', () => {
    const named = new Set(RULES.flatMap((r) => [r.tool, ...(r.tools || [])]).filter(Boolean));
    // the audit of the constitution runs on every rule marked auto, and its fixtures keep it honest: neither has a `tool` of its own
    for (const script of runners.filter((s) => !['tools/check/constitution.mjs', 'tools/check/fixtures.mjs'].includes(s))) expect(named.has(script), `${script} serves no rule`).toBe(true);
  });

  test('a rule names its extra scripts only as a list', () => {
    for (const r of RULES) if (r.tools) expect(Array.isArray(r.tools), r.id).toBe(true);
  });
});

describe('defaults for agents', () => {
  test('every default names the rules it serves, and they exist', () => {
    for (const d of AGENT_DEFAULTS) {
      expect(d.rules?.length, `${d.id} names no rule`).toBeGreaterThan(0);
      for (const id of d.rules) expect(RULES_BY_ID[id], `${d.id}: ${id}`).toBeTruthy();
    }
  });
});
