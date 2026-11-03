# baseui

A design system on Base UI with a documentation site built from its own components. Runs locally, no external dependencies.

Documentation structure, names and order follow [Astryx](https://astryx.atmeta.com/): **Foundations** and **Components**. Values and look stay baseui's.

## Run

Sources are JSX (`.jsx`); the site and the examples run the `.js` built from them (not committed):

```sh
npm install
npm run build:js              # .jsx -> .js next to each source (npm run dev rebuilds on change)
python3 -m http.server 8000   # any static server
```

| Script | What it does |
| --- | --- |
| `npm test` | vitest on jsdom: a render snapshot of every story and behaviour tests of the main components |
| `npm run typecheck` | `tsc` with `checkJs` over the sources: unknown names, wrong imports, arity, missing members |
| `npm run types` | `types/index.d.ts` from `describe()` |
| `npm run registry` | `registry.json` and `r/*.json` (shadcn registry) |
| `npm run constitution` | `CONSTITUTION.md`, `AGENTS.md` from `src/constitution/rules.js` |
| `npm run tailwind` | `tailwind.css`, the Tailwind v4 theme from `tokens.css` |
| `npm run build` | all of the generated files (`.js`, registry, types, tailwind) |
| `npm run vendor` | the `vendor/` bundles and import maps (react, react-dom, Base UI) |

Vercel runs `node tools/build/js.mjs` (see `vercel.json`).

## Use

```html
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="src/components.css">
```

Theme: `data-theme="light|dark"` on `<html>`.

```js
import { Button, Card, Tabs } from './src/index.js';
```

## Install

**As a package** (React ≥ 18 and `@base-ui/react` are not bundled: the app brings its own React, so hooks and context are shared):

```sh
npm i baseui-kit react react-dom
```

```js
import { Button, Switch, Selector } from 'baseui-kit';
import 'baseui-kit/styles.css';              // tokens + components
```

Types ship in `types/index.d.ts`, generated from `describe()` (`npm run types`).

**As sources, with the shadcn CLI** (`registry.json` and `r/*.json` are a standard shadcn registry; files land in `baseui/`, shared code and styles come along):

```sh
npx shadcn@latest add https://baseuikit.vercel.app/r/button.json
```

or register it once in `components.json` and use the short form:

```json
{ "registries": { "@baseui": "https://baseuikit.vercel.app/r/{name}.json" } }
```

```sh
npx shadcn@latest add @baseui/select @baseui/modal
```

**With Tailwind v4** — the tokens become utilities (`bg-bg-accent`, `text-fg-primary`, `border-border-primary`, `rounded-xl`, `shadow-md`, `type-text-14-regular`; the breakpoints, radius names, easings and durations are Tailwind's own); the Tailwind spacing scale in steps of 4px is the baseui scale (`p-4` = `spacing-4` = 16px, `p-0.5` = `spacing-0-5` = 2px):

```css
@import "tailwindcss";
@import "baseui-kit/styles.css";
@import "baseui-kit/tailwind.css";
```

## Constitution

`CONSTITUTION.md` and the Foundations / Constitution page hold the design rules an interface built with baseui must follow to be at least acceptable: 58 shared rules in six groups (accessibility, usability, hierarchy and layout, design system, copy, motion and responsiveness), each with what to do and what not to do. They come from WCAG 2.1 AA, from the tokens and components of the system, and from the usability, hierarchy, consistency and UX writing principles it follows. The source is `src/constitution/rules.js`. Inside it, every component page has a **Usage** block, what to do and what not to do with that component (`src/usage.js`, also in `docs/components/*.md`), so that an agent knows when to reach for a Card or a Badge and when not to.

**For agents that build prototypes.** If a request breaks a rule, the agent builds what was asked, begins its answer with a warning that quotes the broken rules (id, Do, Don't), and puts a `ConstitutionBanner` across the top of the prototype:

```jsx
<ConstitutionBanner violations={[{ id: 'A1', note: 'Body text is #bbbbbb on white' }]} />
```

The banner is not dismissible and stays while a rule is broken; `<ConstitutionBanner audit />` also runs `auditConstitution()` (contrast, touch targets, labels, alt text, headings, one primary action, font size, sideways scroll) and adds what it finds. The full protocol is in `CONSTITUTION.md` and `AGENTS.md`; in your own project, point your `AGENTS.md` at the installed `baseui/CONSTITUTION.md` (`npx shadcn@latest add https://baseuikit.vercel.app/r/baseui-constitution.json`).

## Product rules

Store-specific rules live in the [Overgear sublibrary](overgear/README.md), with their own [constitution](overgear/CONSTITUTION.md) and [agent instructions](overgear/AGENTS.md). New Overgear rules go in `overgear/constitution/rules.js`; they are not added to the shared constitution or component usage guidance. `baseui-kit/overgear` is an explicit opt-in entry with a banner that understands both shared and local rules. `npm test` checks this boundary (`tests/boundary.test.js`) and the Overgear rules (`overgear/tests`).

## Structure

| Path | Contents |
|---|---|
| `tokens.css` | Design tokens and fonts |
| `lib/` | Icon bundles (line, solid) and the React shim for the import map |
| `src/` | Components as plain ES modules, their docs pages and styles |
| `site/` | Documentation site and its page tree (`manifest.js`) |
| `overgear/` | The Overgear sublibrary, its showcase and its example store (see `overgear/README.md`) |
| `src/templates/` | 47 page templates by category (dashboards, tables, forms, settings, login, tools, content, AI chat, galleries, shells) built from the components with mock data; `registry.js` lists them. Each installs with `npx shadcn@latest add <url>/r/template-<id>.json` and is shown in the Templates section of the site |
| `registry.json`, `llms.txt`, `docs/` | The component registry (files and dependencies of every component) and the markdown version of the documentation for people and AI assistants, both generated: `node tools/build/registry.mjs`, `node tools/build/docs.mjs <url>` |
| `tools/` | `build/` (generators: js, registry, types, tailwind, vendor, docs, constitution), `check/` (scripts that sweep the pages in a browser, sharing one harness in `tools/lib/sweep.mjs`, and the type check) and `audits/` (the modules that run inside the page): the radius check (`radius-check.js`, `check/radii.mjs` over every page), the size balance (`size-balance.js`, `check/sizes.mjs`), the spacing balance (`spacing-balance.js`, `check-spacing.mjs`: groups, headings, negative margins, the rhythm on a phone); described in the Tools section of the docs |

## Tokens

Every custom property is `--baseui-` plus lowercase kebab-case, with no exceptions and no aliases; `tests/tokens.test.js` fails on a capital letter and on a `var(--baseui-…)` that nothing defines.

| Group | Names |
|---|---|
| Color | `text-and-icon-*`, `background-*`, `border-*`, `accent-colors-*`, `extensions-*` (the roles of the Figma library, in kebab-case: `extensions-text-and-icon-on-color`) |
| Spacing | `spacing-0, 0-5, 1 … 20`: 1 gap = 4px, a token is its number of gaps (`spacing-4` is 16px) |
| Radius | Tailwind's names: `radius-none · sm · md · lg · xl · 2xl · 3xl · 4xl · full` (4, 6, 8, 12, 16, 24, 32px), plus the custom radii `radius-custom-10 · 14 · 20 · 28`: agents do not use them by default, only on request or to keep corners concentric (see Foundations / Radius) |
| Shadow | `shadow-sm · md · lg` |
| Focus | `focus-outline-width · style · color · offset` |
| Motion | `duration-150 · 300 · 500` (0 when motion is off), `ease-in · out · in-out` (Tailwind's curves) |
| Z-index | `z-index-10 … 50` |
| Breakpoints | `breakpoint-sm · md · lg · xl · 2xl` (640, 768, 1024, 1280, 1536px): mobile below md, sheets below xl |
| Typography | `typography-text-*`, `typography-header-*` (a `font` shorthand each), `typography-paragraph-*` |

## Conventions

- **One name per component.** The title of its page in the menu, the story file, the component file, the export from `src/index.jsx` (never an alias) and the registry item (kebab-case) are the same word: Selector, Typeahead, Token, TokenGroup, TextInput, Dialog. `tests/naming.test.js` fails when one of them differs. CSS classes (`bui-*`) and `data-slot` may keep an older word, they are not API.
- **Props follow Base UI:** `disabled`, `loading`, `open` / `onOpenChange`, `value` / `defaultValue` / `onValueChange`, `checked` / `defaultChecked` / `onCheckedChange`; plain adjectives for flags (`striped`, `hoverable`, `grouped`). `label`, `variant` and `size` (`xsm · sm · md · lg · xl`) as before.
- **Base UI first.** A component is built from the Base UI parts (`@base-ui/react`) when Base UI has them; the DS adds the look and what a product needs on top. Wrappers of compiled components keep their docs with `describeWrapper()`.
- **Hooks for styles and tests.** Every element a DS component renders has `data-slot` (its name: `button`, `tablist`, `otp-cell`…). Size, variant and state go to `data-size`, `data-variant`, `data-status`, `data-checked`. Product CSS selects these or the readable `bui-<component>__<part>` classes.
- **Theme settings are data attributes.** The theme writes `data-motion` (`off · basic · enhanced`), `data-glass` (`on · off`) and `data-floating` on `<html>`; a `motion` or `glass` prop writes the same attribute on the component (`themeAttrs()` in `src/theme-flags.js`). CSS reads the nearest one; `--bui-fx` is 1 only on enhanced. Floating is read with `useFloating()`.
- **Shared behaviour lives in one place:** `useDismiss` (outside click, Escape, focus back to the trigger) in `src/floating.js`, `useHighlight` (the sliding underline, thumb, pill and OTP ring, measured by layout offsets) in `src/highlight.js`, `useReady`, `usePresence`, `useMediaQuery`, `useTouchScreen` in `src/theme-flags.js`.
- **Focus has three placements,** all from the focus tokens: around (`outline-offset: var(--baseui-focus-outline-offset)`), inside (offset minus the width, for items in a container: segments, calendar days, table rows, bar items) and flush (offset 0, fields: Text Input, OTP cells).
- **Fixed heights, flexible widths.** Buttons and fields take their height from `size`; a menu opened from a field or a button takes the same size.
- **Outline icons have the standard stroke.** The `Icon` component draws every outline icon with a stroke of 2, and the weight is not checked against the text. `weight="auto"` is still there for who wants the stroke to follow the text beside the icon (from 1 to 2.5; `tools/icon-weight.js`); `tools/check/icons.mjs` audits that for the pages that use it and is not part of the rules.
- **No outlines.** Fills, spacing and shadows separate elements. Rings appear for focus and selection.
- **Accessible by default.** Text contrast ≥ 4.5:1, visible focus, reduced motion, no tooltips on touch screens.
- **`src/components.css` order:** base, focus, theme motion, components A–Z, glass, theme shape last (shape and glass override the component rules at the same specificity).

## Checks

- `npm test` rebuilds the generated files first (`pretest`), then runs vitest and the Overgear tests. Every story must render, with no duplicate ids and a name on every button and link; the markup of ten complex components is also a snapshot.
- `npm run typecheck` checks the `.jsx` sources (the built `.js` files are output and are not judged).
- `npm run check` starts its own static server and runs the browser checks (radius, size ladder, constitution audit, spacing of the templates and of Overgear); it needs Playwright and takes a few minutes. `npm run verify` runs all three.
- `npm run check:generated` rebuilds and fails if `registry.json`, `r/`, `types/` or the constitution files differ from what is committed. They stay in git on purpose: the registry is served from the repository and agents read `CONSTITUTION.md` and `AGENTS.md` from it.

## Add a component

1. Pick the name once, as it is titled in the menu; `Name` is the file, the export, the story and the registry item. `src/components/Name.jsx`, ending with `describe(Name, 'One sentence.', { prop: [type, default, 'Short fragment'] })`.
2. Styles in `src/components.css`, prefix `.bui-`, tokens only.
3. `src/stories/Name.stories.jsx` with `meta()`, `Playground` and a few examples.
4. An entry in `site/manifest.js`.
