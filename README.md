# baseui

A design system on Base UI with a documentation site built from its own components. Runs locally, no external dependencies.

Documentation structure, names and order follow [Astryx](https://astryx.atmeta.com/): **Foundations** and **Components**. Values and look stay baseui's.

## Run

```sh
python3 -m http.server 8000   # any static server
```

## Use

```html
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="lib/components.css">
<link rel="stylesheet" href="src/components.css">
```

Theme: `data-theme="light|dark"` on `<html>`.

```js
import { Button, Card, Tabs, TabList, Tab, TabPanel } from './src/index.js';
```

## Structure

| Path | Contents |
|---|---|
| `tokens.css` | Design tokens and fonts |
| `lib/` | Compiled components: Typeahead, Checkbox, Dialog, List, OTP Input, Radio, Rating, Selector, Switch, Text Input, Token |
| `src/` | Components as plain ES modules, their docs pages and styles |
| `site/` | Documentation site and its page tree (`manifest.js`) |
| `examples/messenger/` | A messenger built from the components with mock data (no backend). Open it from Theming → Theme Settings: it follows the theme you set there |
| `examples/overgear/` | A boost-service product page rebuilt from the components (sidebar, order form with live price, reviews, FAQ, footer). Not in the catalog: open `/examples/overgear/` |
| `examples/overgear-v2/` | The same page with the information in order of priority (title, main benefits, order form, the rest; the price and safety on the right) and a denser scale: 16px base on a desktop, 14px on a phone. Open `/examples/overgear-v2/` |
| `registry.json`, `llms.txt`, `docs/` | The component registry (files and dependencies of every component) and the markdown version of the documentation for people and AI assistants, both generated: `node tools/build-registry.mjs`, `node tools/build-docs.mjs <url>` |
| `tools/` | Scripts that look after the system: the radius check (`radius-check.js` in the browser, `check-radii.mjs` over every page) and the size balance (`size-balance.js`, `check-sizes.mjs` over the example products) and the spacing balance (`spacing-balance.js`, `check-spacing.mjs`); described in the Tools section of the docs |

## Tokens

| Group | Names |
|---|---|
| Color | baseui names: `Text-and-Icon-*`, `Background-*`, `Border-*`, `Accent-Colors-*`, `Extensions-*` |
| Spacing | `spacing-0 … 80`, named by pixels |
| Radius | `radius-none · 4 · 6 · 8 · 10 · 12 · 14 · 16 … 32 · full`, named by pixels |
| Shadow | `shadow-low · med · high` |
| Focus | `focus-outline-width · style · color · offset` |
| Motion | `duration-fast · medium · slow`, `ease-standard · emphasized` |
| Z-index | `z-index-100 … 500` |
| Typography | `Typography-Text-*`, `Typography-Header-*` |

## Conventions

- **Props follow Base UI:** `disabled`, `loading`, `open` / `onOpenChange`, `value` / `defaultValue` / `onValueChange`, `checked` / `defaultChecked` / `onCheckedChange`; plain adjectives for flags (`striped`, `hoverable`, `grouped`). `label`, `variant` and `size` (`xsm · sm · md · lg · xl`) as before.
- **Base UI first.** A component is built from the Base UI parts (`src/base.js`) when Base UI has them; the DS adds the look and what a product needs on top. Wrappers of compiled components keep their docs with `describeWrapper()`.
- **Hooks for styles and tests.** Every element a DS component renders has `data-slot` (its name: `button`, `tablist`, `otp-cell`…). Size, variant and state go to `data-size`, `data-variant`, `data-status`, `data-checked`. Product CSS selects these, never the hashed classes of `lib/`.
- **Theme settings are data attributes.** The theme writes `data-motion` (`off · basic · enhanced`), `data-glass` (`on · off`) and `data-floating` on `<html>`; a `motion` or `glass` prop writes the same attribute on the component (`themeAttrs()` in `src/theme-flags.js`). CSS reads the nearest one; `--bui-fx` is 1 only on enhanced. Floating is read with `useFloating()`.
- **Shared behaviour lives in one place:** `useDismiss` (outside click, Escape, focus back to the trigger) in `src/floating.js`, `useHighlight` (the sliding underline, thumb, pill and OTP ring, measured by layout offsets) in `src/highlight.js`, `useReady`, `usePresence`, `useMediaQuery`, `useTouchScreen` in `src/theme-flags.js`.
- **Focus has three placements,** all from the focus tokens: around (`outline-offset: var(--baseui-focus-outline-offset)`), inside (offset minus the width, for items in a container: segments, calendar days, table rows, bar items) and flush (offset 0, fields: Text Input, OTP cells).
- **Fixed heights, flexible widths.** Buttons and fields take their height from `size`; a menu opened from a field or a button takes the same size.
- **No outlines.** Fills, spacing and shadows separate elements. Rings appear for focus and selection.
- **Accessible by default.** Text contrast ≥ 4.5:1, visible focus, reduced motion, no tooltips on touch screens.
- **`src/components.css` order:** base, focus, theme motion, components A–Z, glass, theme shape last (shape and glass override the component rules at the same specificity).

## Add a component

1. `src/components/Name.js`, ending with `describe(Name, 'One sentence.', { prop: [type, default, 'Short fragment'] })`.
2. Styles in `src/components.css`, prefix `.bui-`, tokens only.
3. `src/stories/Name.stories.js` with `meta()`, `Playground` and a few examples.
4. An entry in `site/manifest.js`.
