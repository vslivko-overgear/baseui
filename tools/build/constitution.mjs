#!/usr/bin/env node
// Builds CONSTITUTION.md (the rules and the agent protocol, for people and agents) and AGENTS.md (the short instruction agents read first)
// from src/constitution/rules.js, the single source.
//
//   node tools/build/constitution.mjs
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { AGENT_DEFAULTS, AGENT_PROTOCOL, CATEGORIES, CONSTITUTION_VERSION, RULES } from '../../src/constitution/rules.js';
import { ruleMarkdown } from './constitution-markdown.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const musts = RULES.filter((r) => r.level === 'must').length;

const md = [
  '# baseui design constitution',
  '',
  `Version ${CONSTITUTION_VERSION}. ${RULES.length} rules in ${CATEGORIES.length} groups (${musts} must, ${RULES.length - musts} should): what to do and what not to do so that an interface is at least acceptable. Generated from \`src/constitution/rules.js\`; the same rules are on the Foundations / Constitution page.`,
  '',
  'A **must** protects people and is always reported. A **should** is a strong default: keep it, or say why not.',
  '',
  '## For agents: when a request breaks a rule',
  '',
  ...AGENT_PROTOCOL.map((step) => (/^\d\./.test(step) ? step : `- ${step}`)),
  '',
  '## For agents: defaults when you generate',
  '',
  ...AGENT_DEFAULTS.flatMap((d) => [`### ${d.title}`, '', ...d.text.map((t) => `- ${t}`), '']),
  '## For agents: the banner',
  '',
  '```jsx',
  "import { ConstitutionBanner } from 'baseui-kit';",
  '',
  '<ConstitutionBanner violations={[',
  "  { id: 'A1', note: 'Body text is #bbbbbb on white' },",
  "  { id: 'H2', note: 'Captions are 10px' },",
  ']} />',
  '```',
  '',
  'The warning in the answer follows this shape:',
  '',
  '> **Design constitution: this request breaks 2 rules.**',
  '> - **A1 Text contrast** — Do: keep text at 4.5:1 against its background. Don’t: set light gray text on white. Light gray (#bbb) on white is 1.9:1.',
  '> - **H2 Readable type** — Do: body text 14px or more, 12px is the floor. Don’t: set text below 12px. The captions are 10px.',
  '> I built it as asked and put a banner across the top of the prototype. Compliant version: …',
  '',
];
for (const c of CATEGORIES) {
  md.push(`## ${c.title}`, '', c.lead, '');
  for (const r of RULES.filter((x) => x.category === c.id)) {
    md.push(...ruleMarkdown(r));
  }
}
await writeFile(join(root, 'CONSTITUTION.md'), `${md.join('\n')}\n`);
if (existsSync(join(root, 'docs', 'foundations'))) await writeFile(join(root, 'docs', 'foundations', 'constitution.md'), `${md.join('\n')}\n\nLive page: https://baseuikit.vercel.app/#/foundations/constitution\n`);

const agents = [
  '# Instructions for agents',
  '',
  'This repository is the baseui design system. When you build an interface or a prototype with it:',
  '',
  '1. Read `CONSTITUTION.md` (the design rules, with ids such as `A1`).',
  '2. Use the components and tokens of the system (`README.md`, `llms.txt`, `types/index.d.ts`, `registry.json`).',
  '3. Follow the constitution protocol:',
  '',
  ...AGENT_PROTOCOL.map((step) => (/^\d\./.test(step) ? `   ${step}` : `   - ${step}`)),
  '',
  '4. Defaults when you generate:',
  '',
  ...AGENT_DEFAULTS.flatMap((d) => d.text.map((t) => `   - **${d.title}.** ${t}`)),
  '',
  '## Verify by the size of the change',
  '',
  '- Run `node tools/check/plan.mjs`: it reads the changed files and prints the tier of the change and the commands that tier calls for (`--run` runs them, `--full` adds the slow checks). The list of the checks, with what each costs and which files it watches, is `tools/check/manifest.mjs`',
  '- **T0**, text only (documents, copy, pictures): nothing to run',
  '- **T1**, one page of the example (a local look): the unit tests of the example and the quick checks that name the file; then look at the page (a screenshot at 1440 and 390 px): a local change is judged by eye, not by an audit',
  '- **T2**, a shared part of the example (ui, shell, store, the cores, the audience, the theme): all the unit tests and the checks that name the file, the slow ones too',
  '- **T3**, baseui itself (tokens, styles, components, icons, the rules, the tools): the unit tests, the build, the types and every check that names the file, the slow ones too',
  '- Say the tier and why in your answer. Do not run the slow audits (the constitution, spacing and radii checks take one to three minutes each) for a local tweak, and do not skip a check that the plan lists for a shared or global change',
  '',
  '## When a decision changes',
  '',
  '- When a person reverses a decision that a rule or a check holds, change the rule and the check in the same commit: retire the id (an id is never reused) and write the new decision, instead of leaving a check that fails or a rule that says the opposite',
  '- When the same property of the same kind of thing is changed a third time (a gap, a padding, a radius, a color), stop and say that it should be a rule, a default or a token; add it to the constitution, to `AGENT_DEFAULTS` or to the sublibrary, with a check where one can be written',
  '',
  '## Scope of rules',
  '',
  '- Shared rules in `src/constitution/rules.js` must apply across products. Store-specific navigation, commerce and brand decisions belong to the product sublibrary, not to the shared constitution, defaults, component usage guidance or audit tools',
  '- For any request about Overgear, including one made from the repository root, read `overgear/AGENTS.md` and `overgear/CONSTITUTION.md`. Add new store rules to `overgear/constitution/rules.js` and their checks and tests under `overgear/`',
  '- Keep dependencies one-way: a product may import baseui; shared runtime and rule modules must not import a product',
  '',
];
await writeFile(join(root, 'AGENTS.md'), `${agents.join('\n')}\n`);
await writeFile(join(root, 'CLAUDE.md'), '@AGENTS.md\n');
console.log(`CONSTITUTION.md (${RULES.length} rules), AGENTS.md, CLAUDE.md`);
