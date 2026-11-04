# Instructions for agents

This repository is the baseui design system. When you build an interface or a prototype with it:

1. Read `CONSTITUTION.md` (the design rules, with ids such as `A1`).
2. Use the components and tokens of the system (`README.md`, `llms.txt`, `types/index.d.ts`, `registry.json`).
3. Follow the constitution protocol:

   - Before you build, read the request against the rules of the constitution. A request breaks a rule when doing exactly what it asks produces something a rule forbids (see `signals` on each rule), or when the first version you would write would break one
   - If it does not, build as usual and do not mention the constitution
   - If it does, do the following. Build what was asked: the person decides, so do not refuse and do not quietly "fix" it. And in the same turn:
   1. In your answer, begin with a warning. For each broken rule give its id and title and quote its Do and Don't lines, then say in one sentence how the request breaks it and what the compliant version would be
   2. In the prototype, put a ConstitutionBanner at the very top of the page, before any other content, stretched across the full width: `<ConstitutionBanner violations={[{ id: 'A1', note: 'Body text is #bbb on white' }]} />`. List every rule you knowingly break, with a note of where. The banner is not dismissible and stays as long as a rule is broken
   3. Do not remove the banner to make the prototype look cleaner, and do not add rules that were not broken. If the person later changes the request so that the rule holds, remove its entry; when none are left, remove the banner
   - Rules you break by accident are your mistake, not the person’s: fix them before you answer. `auditConstitution()` finds the ones marked check: auto

4. Defaults when you generate:

   - **Final period.** Write the last sentence of any text without a period, in labels, captions, hints, descriptions, list items, tooltips, toasts and paragraphs. Keep the periods between sentences, and keep a question mark, an exclamation mark and an ellipsis
   - **Text color.** Set the main text in text-and-icon-primary: paragraphs, list items, descriptions and anything a person has to read. text-and-icon-secondary is for supporting text only: a caption, a hint, metadata, a timestamp, the helper line under a title
   - **Text color.** When you are unsure which it is, take Primary. Disabled is for disabled controls, never for text that is merely less important
   - **Font weight.** When you set a font weight yourself, take bold or regular: bold for what leads (a title, a heading, a price, a name), regular for everything else. Semi-bold is never your choice: it comes from the components that carry it (buttons, tabs, labels, list titles), or from a direct request of the person
   - **Radius.** Use only the named radius scale: none, sm, md, lg, xl, 2xl, 3xl, 4xl and full. Do not use the custom radii (radius-custom-10, 14, 20, 28) by default
   - **Radius.** Use a custom radius in two cases only: the person asks for it, or rule D4 (concentric corners) needs it. For a background around an entity (a tray around a button, a card around an image), the background gets the radius of the entity plus the padding between them, and an entity inside a background gets the radius of the background minus that padding. When the result is not on the named scale (12 − 2 = 10, 16 − 2 = 14, 24 − 4 = 20, 32 − 4 = 28), take the custom radius with that value
   - **Relative layout.** Place blocks by the gap of their container, not by fixed heights, offsets or margins that match a neighbour. Blocks that move together are one container (Stack, Group), so when one is moved, resized or removed, everything after it follows. After a change, look at the blocks around it and make sure no gap, hole or overlap is left
   - **Spacing.** Choose a gap by how closely the blocks belong together, not by one number for the page. Inside an element 4 to 8, a heading to its content 8, related blocks 16, groups 24, sections 40. Use `Stack relation` and `Group` instead of a number
   - **Spacing.** A heading is at most 60% of its font size from its content, 16 at least: a big heading never hangs far above what it names. A line that continues the block above it (a rating under a headline, the counter under the rating, a button over the list it opens) goes in the same group, 8 to 16 away, never at the gap of the page
   - **Spacing.** A title and the line that describes it (a subtitle, a caption right under a heading, a name and its role) are a pair: `Stack relation="pair"`, no gap, the line-height is the space. Do not tune the gap of a pair by hand: if it looks far, the pair is not a pair (a line that continues the block above it is related, 8 to 16)
   - **Spacing.** Never pull a block closer with a negative margin: put it in the group it belongs to. A row of tags or a listing that must reach the screen edges is a `Bleed`
   - **Button groups.** Put the buttons of one decision in a `ButtonGroup` and let it lay them out: horizontal is a row, vertical is a column in which every button is full width. Do not set a width on each button of a stack, and give the group one primary button
   - **Forms.** Lay out the fields of a form with `Form`, `FormRow` and `FormSection`: one gap between rows and columns, related fields in a row, a titled group as a section. Do not space fields with a Stack and a Grid of your own
   - **Hug and fill.** A control or a tag is as wide as its content (hug) unless it stands alone in a row of its own or the row is a grid of equal cells (fill). A row of filters is a grid of equal cells: every filter fills, the sort too. On a phone the filters are not a row: they open in a sheet from a button opposite the title, and from the right side of the navbar once the title has scrolled under it
   - **Hug and fill.** A row that does not fit on a phone scrolls sideways as a whole, in a `Bleed`, with every item hugging its content. Never scroll the content inside one long shape
   - **Status colors.** A state has one color everywhere: success is green, a problem or a warning is yellow, an error is red, a passed step is neutral with a check, the current one is the accent. Do not take the brand color for a status
   - **Product screens.** A product screen has no demo or debug controls: no strip to switch states, no sample-data labels, no notes for the designer. A state is reached by a real action or by a story, not by a switch on the page
   - **Under a navbar.** On a phone, the content of a page that starts under a navbar (the bar with back) starts right under it, 0 from the bar: the title of the page is the first thing under the bar, and the bar shows the title once the heading scrolls away. Do not add a top padding to such a page

## Verify by the size of the change

- Run `node tools/check/plan.mjs`: it reads the changed files and prints the tier of the change and the commands that tier calls for (`--run` runs them, `--full` adds the slow checks). The list of the checks, with what each costs and which files it watches, is `tools/check/manifest.mjs`
- **T0**, text only (documents, copy, pictures): nothing to run
- **T1**, one page of the example (a local look): the unit tests of the example and the quick checks that name the file; then look at the page (a screenshot at 1440 and 390 px): a local change is judged by eye, not by an audit
- **T2**, a shared part of the example (ui, shell, store, the cores, the audience, the theme): all the unit tests and the checks that name the file, the slow ones too
- **T3**, baseui itself (tokens, styles, components, icons, the rules, the tools): the unit tests, the build, the types and every check that names the file, the slow ones too
- Say the tier and why in your answer. Do not run the slow audits (the constitution, spacing and radii checks take one to three minutes each) for a local tweak, and do not skip a check that the plan lists for a shared or global change

## When a decision changes

- When a person reverses a decision that a rule or a check holds, change the rule and the check in the same commit: retire the id (an id is never reused) and write the new decision, instead of leaving a check that fails or a rule that says the opposite
- When the same property of the same kind of thing is changed a third time (a gap, a padding, a radius, a color), stop and say that it should be a rule, a default or a token; add it to the constitution, to `AGENT_DEFAULTS` or to the sublibrary, with a check where one can be written

## Scope of rules

- Shared rules in `src/constitution/rules.js` must apply across products. Store-specific navigation, commerce and brand decisions belong to the product sublibrary, not to the shared constitution, defaults, component usage guidance or audit tools
- For any request about Overgear, including one made from the repository root, read `overgear/AGENTS.md` and `overgear/CONSTITUTION.md`. Add new store rules to `overgear/constitution/rules.js` and their checks and tests under `overgear/`
- Keep dependencies one-way: a product may import baseui; shared runtime and rule modules must not import a product

