#!/usr/bin/env node
// Builds CONSTITUTION.md (the rules and the agent protocol, for people and agents) and AGENTS.md (the short instruction agents read first)
// from src/constitution/rules.js, the single source.
//
//   node tools/build/constitution.mjs
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { AGENT_DEFAULTS, AGENT_PROTOCOL, CATEGORIES, CONSTITUTION_VERSION, RETIRED, RULES } from '../../src/constitution/rules.js';
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
  "  { id: 'H2', note: 'Captions are 10px' },",
  ']} />',
  '```',
  '',
  'The warning in the answer follows this shape:',
  '',
  '> **Design constitution: this request breaks 1 rule.**',
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
md.push('## Retired ids', '', 'These ids were rules and are not any more; an id is never reused.', '', ...Object.entries(RETIRED).map(([id, why]) => `- \`${id}\`: ${why}`), '');
await writeFile(join(root, 'CONSTITUTION.md'), `${md.join('\n')}\n`);
if (existsSync(join(root, 'docs', 'foundations'))) await writeFile(join(root, 'docs', 'foundations', 'constitution.md'), `${md.join('\n')}\n\nLive page: https://baseuikit.vercel.app/#/foundations/constitution\n`);

const agents = [
  '# Instructions for agents',
  '',
  'This repository is the baseui design system. When you build an interface or a prototype with it:',
  '',
  '1. Read `CONSTITUTION.md` (the design rules, with ids such as `H2`).',
  '2. Use the components and tokens of the system (`README.md`, `llms.txt`, `types/index.d.ts`, `registry.json`).',
  '3. Follow the constitution protocol:',
  '',
  ...AGENT_PROTOCOL.map((step) => (/^\d\./.test(step) ? `   ${step}` : `   - ${step}`)),
  '',
  '4. Defaults when you generate:',
  '',
  ...AGENT_DEFAULTS.flatMap((d) => d.text.map((t) => `   - **${d.title}.** ${t}`)),
  '',
  '## Verify: few rules, kept',
  '',
  '- Run `npm run verify` (`node tools/check/plan.mjs --run`) once, after the change: it reads the changed files, says the tier and runs what the tier calls for. Do not add checks of your own on top, and do not run it twice for one change. The checks, what each costs and which files it watches are in `tools/check/manifest.mjs`',
  '- **T0**, text, a test or a check alone: nothing, or only the test or the check that changed',
  '- **T1**, one page of the example (a local look): the unit tests of Overgear, the types and the quick checks of that page, about 20 seconds; then look at the page at 1440 and 390 px. A look is judged by eye',
  '- **T2**, a shared part of Overgear (its components, ui, order, shell, store, the cores, its rules): the unit tests of Overgear, the types and every check that names the file, under a minute',
  '- **T3**, baseui (tokens, styles, components, the rules, the harness of the checks): all the unit tests, the build, the types and every check that names the file; `npm run verify:full` runs every check, about two minutes, for a release or when the person asks',
  '- Act on judgment, with no check beyond the plan, for: a value of a gap, a padding, a radius or a color within the tokens, a copy, an icon, the order of blocks on one page, a layout the person dictates. Hold to the plan for: baseui components and tokens, money, orders and the funnel (the cores), accessibility, anything a decision test holds',
  '- Say the tier and why in your answer, and what you looked at by eye',
  '',
  '## Where a check belongs',
  '',
  '- A rule a component can keep, it keeps: a prop, a context, a measured value (the size of the buttons of a sheet, the room of a pinned bar, the clear button of a field, a concentric radius). Then a unit test of the component holds it, and no page needs a check',
  '- A unit test (jsdom, milliseconds) for logic and for what a component decides: a pure core, a state, a role, the focus, a sheet on a phone. A source guard (a test that reads the files) for a decision of the product: what may not come back',
  '- A browser check only for what jsdom cannot see: layout across real pages, scrolling, :focus-visible, a flow across pages. One check per contract, never one per page, and it waits for the page to be ready, never for a fixed time',
  '- When a browser check keeps catching the same drift, move the rule into the component and delete the check',
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
