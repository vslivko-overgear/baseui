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
   - **Spacing.** Never pull a block closer with a negative margin: put it in the group it belongs to. A row of tags or a listing that must reach the screen edges is a `Bleed`
   - **Button groups.** Put the buttons of one decision in a `ButtonGroup` and let it lay them out: horizontal is a row, vertical is a column in which every button is full width. Do not set a width on each button of a stack, and give the group one primary button
   - **Forms.** Lay out the fields of a form with `Form`, `FormRow` and `FormSection`: one gap between rows and columns, related fields in a row, a titled group as a section. Do not space fields with a Stack and a Grid of your own

## Scope of rules

- Shared rules in `src/constitution/rules.js` must apply across products. Store-specific navigation, commerce and brand decisions belong to the product sublibrary, not to the shared constitution, defaults, component usage guidance or audit tools
- For any request about Overgear, including one made from the repository root, read `overgear/AGENTS.md` and `overgear/CONSTITUTION.md`. Add new store rules to `overgear/constitution/rules.js` and their checks and tests under `overgear/`
- Keep dependencies one-way: a product may import baseui; shared runtime and rule modules must not import a product

