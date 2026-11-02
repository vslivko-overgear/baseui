# Overgear sublibrary

Overgear extends baseui with its own theme, example store and product rules. Shared components remain in `src/`; store decisions live here. The baseui runtime, shared constitution and default registry do not import this sublibrary.

## Rules

Read the shared [constitution](../CONSTITUTION.md), then the local [constitution](CONSTITUTION.md) and [agent instructions](AGENTS.md).

- `constitution/rules.js` is the single source for store rules; add new ones here with stable `OG`-prefixed ids
- `CONSTITUTION.md`, `AGENTS.md` and `CLAUDE.md` are generated; regenerate with `npm run constitution`
- `tools/` holds store checks and the local document generator (`build/`, `check/`, `audits/`, like the root `tools/`)
- `tests/` checks the store-specific behavior (its rules, documents and listing audit); run `npx vitest run overgear`. That baseui knows nothing of Overgear is tested in `tests/boundary.test.js`

The rules moved from baseui are `U12 → OG1` (mobile tab screens and empty states), `U13 → OG2` (product listings, including the 4px mobile card gap), and `U14 → OG3` (catalog versus listing). The other baseui ids stay unchanged.

## Layout

| Folder | What it is |
| --- | --- |
| `index.jsx`, `ConstitutionBanner.jsx`, `theme.js`, `overgear.css`, `fonts/` | The sublibrary: what `baseui-kit/overgear` ships. `theme.js` is the Overgear theme (one cookie for the showcase and the example) |
| `constitution/`, `tools/`, `tests/` | Store rules, their generator, checks and tests |
| `showcase/` | The showcase pages (theme, typography, colors); opened by `overgear/index.html` |
| `example/` | The example store; opened by `overgear/example/index.html` |

## Use

```jsx
import { ConstitutionBanner } from 'baseui-kit/overgear';

<ConstitutionBanner violations={[
  { id: 'OG3', note: 'The Catalog button opens a product listing' },
  { id: 'A1', note: 'Body text has insufficient contrast' },
]} />
```

Inside this repository import from `overgear/index.jsx` using the appropriate relative path. The optional package entry exports local `RULES`, combined `APPLICABLE_RULES`, `RULES_BY_ID`, `rule()` and the scoped banner. Its `audit` prop runs the shared automatic checks; it does not claim to check the store rules that need review.

For layout and complete product rows, serve the repository and run:

```sh
npm run check:overgear:spacing -- http://localhost:8000
```

This uses Playwright, like the shared browser checks. `npm run check:spacing` checks the shared templates and does not enforce Overgear's complete-row rule. OG1 and OG3, and the remaining parts of OG2, still need a review.

## Adding a rule

Put the rule in `constitution/rules.js`, explain its `do`, `dont`, `why` and `source`, and mark how it is checked. Keep its test or checker here. Rebuild the documents and registry, then run the local tests. The root agent instructions route all Overgear requests here, even when work starts outside this directory.
