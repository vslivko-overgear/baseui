# Changelog

## Package, types, sources

- No compiled core: Button, Text Input, Select, Typeahead, Dialog, Switch, Checkbox, Radio, Token, Rating, List and OTP Input are readable `h()` sources on `@base-ui/react`; classes are `bui-<component>__<part>`. `lib/components.css` and the compiled chunks are gone (`lib/` keeps the icon bundles).
- React is no longer bundled: the site and examples resolve `react`, `react-dom`, `@base-ui/react/*` through an import map (`vendor/`, `npm run vendor`); an app uses its own React.
- `types/index.d.ts` generated from `describe()` by `tools/build-types.mjs`.
- `package.json` is a package: `exports`, `peerDependencies` react/react-dom, `dependencies` `@base-ui/react`, no top-level `await` in the components.
- `bin/baseui.mjs`: `baseui list | init | add <component…>` copies sources with their imports.

## Icons

- The stroke of outline icons goes from 1 to 2.5 (the catalog control too).
- `Icon` component (`weight="auto"`): the stroke follows the thickness of the text beside the icon; a text bolder than 2.5 can match gets the filled icon. `src/icon-weight.js` holds the rule; `tools/icon-weight.js` applies it to any page and `tools/check-icons.mjs` audits the pages.

## Examples

- The Overgear examples are removed. New example: Probe, a UX research service with mock data (`examples/probe/`): dashboard, templates, a study builder with a live preview, a participant runner (prototype tasks, five-second test, scales, choices), results with click maps and responses, a panel with recruiting, settings; reachable through a Demo scenarios menu.

## Refactor: one system

- Props renamed to the Base UI conventions. Button and Icon Button: `isDisabled` → `disabled`, `isLoading` → `loading`. Clickable Card: `isDisabled` → `disabled`. Selectable Card: `isSelected` / `onChange` / `isDisabled` → `checked` (or `defaultChecked`) / `onCheckedChange` / `disabled`. Table: `isStriped` → `striped`, `hasHover` → `hoverable`, `isStickyHeader` → `stickyHeader`, `isLoading` → `loading`.
- Theme settings: one convention. `motion` and `glass` props write `data-motion` and `data-glass` on the component, the same attributes the theme writes on `<html>`; the old `bui-glass-*` and `bui-motion-*` classes are gone. Floating is read with one hook.
- Shared behaviour in one place: closing on an outside click or Escape (Dropdown, Popover), the sliding highlight (Tabs, Segmented Control, Bottom Bar, OTP Input), media queries (Tooltip, Calendar).
- `data-slot` and `data-size` on every element of the DS components; the example products select them instead of hashed classes.
- Focus: one list per placement (around, inside, flush). Tabs get the radius of their focus ring.
- Alert Dialog uses the DS Button (the destructive action takes the destructive variant).
- Tabs `sm`: 8px between the tab list and the panel, like the other small controls.
- CSS regrouped by component; duplicates merged; unused rules removed.

## Experimental: Astryx alignment

- Documentation in English: Foundations and Components in Astryx order. One page per component, with the same structure everywhere: Playground, Props, Examples, and anchors to each. Important subcomponents are child pages in the menu; minor ones are examples on the parent page.
- Theming: Theme Settings page (preset themes, brand color, rounded or circle shape, base radius, headline and text fonts from Google Fonts, animations off/basic/enhanced, floating elements, glass), applied at once and stored in a cookie. `shape` prop on Button and Segmented Control, `data-shape` on any container.
- Foundations: All Tokens, Color, Icons, Motion, Shadow, Shape, Spacing, Typography.
- Color tokens stay baseui's. Spacing and radius are named by pixels. Motion tokens come from Astryx.
- Avatar (with Group, Group Overflow, Status Dot), Badge, Button (with Icon Button) and Card (with Clickable, Selectable) follow the Astryx API with baseui visuals.
- Added: Banner, Breadcrumbs, Collapsible, Divider, Status (formerly Empty State), Layout, Link, Number Input, Pagination, Popover, Progress Bar, Segmented Control, Skeleton, Slider, Spinner, Table, Tabs, Toast, Tooltip, Alert Dialog.
- Existing compiled components are listed under their Astryx names (Typeahead, Selector, Text Input, Token…).
- Removed: Button Group, Toggle Button (with Toggle Button Group), Metadata List, Status Dot, Stepper, Aspect Ratio, Blockquote, Code, Code Block, Dropdown Menu, Field, File Input, Heading, Icon, Kbd, React Hook Form wrappers, Text, Visually Hidden.
- Sizes use one vocabulary: `xsm · sm · md · lg · xl`. Old names (`small`, `medium`, `large`…) are removed everywhere, including the compiled components.
- Radius follows control height; new tokens `radius-6` and `radius-10`.
- Cleanup: dead CSS and unused code removed; `src/index.js` also exports the compiled components.
- Table rebuilt in the look of the documentation tables and now used by the docs (props and token tables). New: density, dividers, striped rows, hover, sorting, selection, clickable rows, sticky header, truncation, column widths (`pixel`, `proportional`), loading and empty states, children mode.
- Selector: `trigger` lets any element open the list (icon button, button, text); lists now open above dialogs; in the mobile sheet the option text lines up with the dialog content.
- Dialogs: every dialog in a stack has its own dimming layer; the mobile Selector sheet takes the field label as its header (none for icon triggers).
- List and List Item: new size `xsm` (40px); the docs menu uses it.
- Text Input, Selector and Typeahead in size `sm`: 14px value and label text (12px when the label floats).
- Color: hover colors (`*-Hover` tokens) sit next to each base swatch on the Color page. Components use them instead of a computed overlay.
