# Changelog

## Overgear: the icons of the headline are the blue ones of Overgear

- The gem, the coin and the trophy before the words of the headline of the home page are the new blue 3D icons (`overgear/example/assets/hero`), not the emoji of Fluent from a CDN. They are WebP with transparency, cut to the object and sized 160 px for an icon of about 50 px, so they stay sharp on a screen of 3x: 7, 10 and 10 KB. The moves are unchanged (the gem shines, the coin spins, the trophy jumps): they are CSS on the wrapper, not on the picture, so no recoloring of vectors was needed.

## Overgear: the search of the header works

- **A desktop:** typing in the search opens a dropdown under the field with suggestions: **one list, with no group titles**, in which the games and the offers that match stand together by how close each is to the text (a game before an offer of the same closeness; eight at most), and as the last row "Search for …". The arrows move along the rows (`aria-activedescendant`), Enter opens the row they are on or runs the search of the text, Escape closes the dropdown and keeps the text, a click outside closes it. The page behind is dimmed while it is open, and the dropdown has no outline. With nothing typed it shows the recent searches (kept on the device, five at most) and the popular games, also in one list with no titles.
- **A phone:** the field opens a screen of its own (a dialog over the whole window, the bottom bar included) and the same suggestions under it; Enter runs the search and closes it. Its bar is the bar of the header: the back button stands in the rectangle of the logo (48 px, the same radius and color) and the field at the same place and of the same height, so nothing jumps when it opens; the field takes the width where the Log in button was. The field has no focus ring and focus changes nothing in it (not its background, not the size of its text, 14 px as in the header): the keyboard is open and the field is the only one, which is rule **OG4**, an exception to A5 for that field only (`overgear/constitution/rules.js`).
- The matching is in `overgear/example/suggest.js`, pure and tested (`overgear/tests/suggest.test.mjs`), and the page of results uses the same functions, so a suggestion and the result of its search agree. `overgear/tools/check/search.mjs` (part of `npm run check`) drives both in a real browser.

## Overgear: the fonts of the Theme page are a dropdown, with the fonts of uncut.wtf that have a bold

- The font setting of the Theme page is a dropdown, not a segmented control. TT Interphases Pro (the font of the live site) comes first, all the others follow **in alphabetical order**: Apfel Grotezk (the font of the showcase, still the default) and the sans-serif fonts of the catalogue [uncut.wtf](https://uncut.wtf/) that we may ship and that **have a bold**: a font with one weight is not in the list, because a bold of it would be a made one. 24 fonts in all.
- **13 are in this repository** (`overgear/fonts/catalogue`, 0.7 MB of WOFF2, each cut to Latin, Latin Extended and Cyrillic, each with its license): Aspekta, Fibel Nord, FreeSans (GPL with the font exception: its notice is kept with it), Hasköy, Lil Grotesk, Manifont Grotesk, Micro Grotesk, Miedinger, Overused Grotesk, Panamera, Prodigy Sans, Rag and Standard (the others under the SIL Open Font License). `overgear/tools/fonts/build-catalogue.py` fetches them from the places their authors publish them and refuses a font without a bold; `overgear/fonts/catalogue/README.md` lists author, source and files of each, and every font of the catalogue that is not in the list with the reason. A browser fetches a file only when its family is chosen.
- **9 are linked from a CDN** (Geist, Instrument Sans, Pretendard, Uncut Sans, Inclusive Sans, TASA Orbiter, Hauora Sans, Kulim Park, Zen Kaku Gothic New): Fontsource through jsdelivr, loaded when chosen. The choice sets `data-og-fonts` and `--og-font` on `<html>`, and `overgear.css` puts the name in the font variables.
- Left out for having one weight: Alfphabet, Barlaxent, Breite Grotesk, CAT Neuzeit, Evening, Helmet, Liga Sans, LT Institute, Lunchtype, Milkman, Opening Hours Sans, Optician Sans, Solitus, Tanklager, Violet Sans, Hedvig Letters Sans, Fudd and Logisoso. Left out for no license that allows it, or no file a script can take: see the README of the catalogue. Tests: `overgear/tests/fonts.test.mjs` (the order, each font has its face, its files, its license and a bold).

## Overgear: the games of the catalog panel scroll

- The column of games in the panel that the Catalog button of the desktop header opens was cut off (`overflow: hidden`) and did not scroll: with the long list of games the lower ones could not be reached. It scrolls in its own column now, as it does on the catalog page. `overgear/tools/check/catalog.mjs` (part of `npm run check`) turns the wheel over the list in both places and fails when it does not move.

## Overgear: audiences

- A new setting on the Theme page of the showcase, **Audience**: who the home page of the example is made for. It offers World of Warcraft, All players (the example as it is) and the three other games with the most content now, marked as examples: Diablo 4 · Example, Path of Exile 2 · Example, Final Fantasy XIV · Example (a test keeps the three in step with the offers). "All players" is the page as it was. With the audience of a game, that game leads: its tile is the first, and its products come first in the listing; the other games follow in their order, and every tile keeps its own width. The audience of World of Warcraft also brings its versions (WoW Forever, TBC Anniversary, WoW Classic Era): the four tiles stand as a group of two rows of different widths, as high as the two rows of the other tiles beside them, the same 8 px gap before the rest as between any two tiles (`AUDIENCE_GROUP`, `tileLayout`); on a phone the group is narrower than the screen, so a piece of the next games shows. **The tiles always end in a rectangle**: for every audience the two levels are of equal length (`levelRows` moves a tile to the shorter row when that helps, then stretches the widths of each row by the same share, 8% at most), in the group and in the rest. It is tested for every audience (`overgear/tests/audience.test.mjs`) and measured in the browser (`overgear/tools/check/tiles.mjs`, part of `npm run check`).
- **The tabs of "Popular products" are games now, not genres.** All Games stays the open one. World of Warcraft is the next tab for all players and for its own audience; for the audience of another game that game is the next and World of Warcraft the one after it; the other games with offers follow in the order of the tiles (`gameTabs`). A game without offers is not a tab. With a game open, the cards do not repeat its name above the price. A game with more than one kind of offer also gets a second level of tabs, the kinds of its offers (for World of Warcraft: Raids, Mythic+ Dungeons, Leveling…; `kindsOf`): All is the open one, and the kind chosen for one game does not carry over to another. The example reads the setting when it opens; it is kept with the theme, in the same cookie, and Reset puts it back. The functions are in `overgear/audience.js` (pure, tested in `overgear/tests/audience.test.mjs`, which also keeps the names of the audiences in step with the games of the example).

## Usage guidance no longer ships with the components

- `describe()` used to attach the usage guidance of `src/usage.js` (Do and Don't lines, 19 KB minified) to every component, and because it runs when a module loads, a bundler could not drop it: an app that imported only `Button` carried all of it (35.7 KB of which 19.1 KB was guidance; 16.5 KB now). The guidance is read from `usageOf(component)` in `src/usage.js` instead, by the documentation site, the docs build and the tests; `__docgenInfo` keeps the description and the props.
- `tests/boundary.test.js` holds what must be true of baseui itself about its sublibraries; `overgear/tests` keeps only what is Overgear's, and `npm test` runs both on vitest. `tests/checks.test.js` keeps the rules, the scripts that find them and the agent defaults in step. `tools/check/fixtures.mjs` runs the audit on pages that break a rule on purpose (D12, D15, D18, M2).
- **A new kind of check, `partial`**: the audit finds the clear cases of A4 (a custom control the keyboard cannot reach, a positive tabindex), A10 (a dialog without a name), A11 (an invalid field with no message pointing to it), U7 (a link to `#` or `javascript:`) and U10 (something to press inside a tooltip); the rest of those rules still needs a review. Of the 20 musts that were review-only, 15 are left: they are a matter of judgment (copy, states, consistency), not of markup.

## .gitignore no longer grows on every build

- `tools/build/js.mjs` rewrote the generated block of `.gitignore` by finding its marker with the old script name (`tools/build-js.mjs`); after the tools were moved the marker did not match and every build appended another block (the file had grown to 11,000 lines, with a stale `overgear/theme.js` entry that would have dropped that source file from a copy of the repository). The marker is matched under both names and the file is one block again.

## Dialog: close buttons that work, a sheet that closes on a single choice

- **`data-dialog-close`**: a control inside a `Dialog` with this attribute (a Close, Done or Cancel button) closes its own dialog with no `onClick` to wire; a dialog in a dialog closes only itself (the click bubbles through the React tree of portals, so the handler checks which dialog the control belongs to). The reason is `close-press`. The mobile sheet of Selector and Typeahead had a "Close" and an "Apply" button with nothing behind them: they close now.
- **A single choice closes the sheet by itself** (Selector and Typeahead on a phone, alone or inside a dialog): the value is committed and only the sheet closes, the dialog around it stays. A multiple choice waits for Apply. The sheet of a single Typeahead now has a Close button and commits on selection like the Selector's (it had Apply only).
- Tests for both; the usage guidance of Dialog says it.

## Form: no gap setting, combinations with choices and buttons

- **`Form` has no `gap` prop any more**: the gap is 16px, always (the setting only made it possible to vary the one thing that must not vary).
- **A Form gives its controls the tier of its fields (56px)**, so a button beside a field (Apply next to a promo code) or the button that closes the form is as high as the inputs, as the D15 rule asks; before, a default button was 48px next to a 56px field.
- **`FormRow` has `align`**: `center` puts a switch or a checkbox beside a field on its middle line; the default is the top. `FormSection` may have no title (a plain group): in a form with sections everything is in a section, so the distances are one set. The Form page has a "Combinations" example: inputs, a selector, a checkbox, switches, a checkbox group, radios, a field with a button and a field with a switch, a text area and a submit button.

## FormRow outside a Form had no gap

- A `FormRow` (and `FormSection` fields) that stood without a `Form` around it read an undefined `--bui-form-gap` and had a gap of 0, as on the Form Row page of the documentation. The gap now falls back to 16px (`gap` 4, the default of `Form`), so a row looks the same alone and inside a form.

## Form, FormRow, FormSection and rule D18: one gap between fields

- **`Form`** owns the space of a form: one gap (`--bui-form-gap`, 16px by default, the `gap` prop) between rows **and** between columns, so the vertical and the horizontal distance between inputs cannot differ. **`FormRow`** puts fields side by side (equal columns by the number of fields, up to four, or a ratio such as `[2, 1]`) and becomes one column when the form is narrower than 360px (`stack="never"` keeps a card expiry and its code side by side). **`FormSection`** is a titled group; sections of a form stand at the group distance (24px), a heading 8px above its fields. The form is a container, so rows react to the width of the form, not of the screen.
- **Rule D18** (shared, must, auto): the fields of one form or section stand at one gap, down and across. The audit measures the real gaps between the `.bui-field`s of a form and reports `12, 24px` style differences; it runs in the browser checks, now also on the form templates.
- **The form templates use it** (contact, two-column, checkout and its wizard, sign in, settings): the checkout had gaps of 20, 16 and 12px in one form; every gap is 16px now. The templates' subtitle under a page title is 16px in the primary color (H2), the audit no longer reads the hidden inputs of switches and checkboxes as unlabeled fields (A6), and `FormSection` headings are h2 by default (A9).
- Agent default "Forms" and the usage guidance of Form say it.
- The spacing audit leaves the rows of a form alone (the gap is the same on purpose) and counts a sticky bar as a surface even when it is a transparent blur (the blurred header of the Overgear example had tripped it).

## Dark theme: the neutral grays are darker

- **The neutral dark tokens of baseui are about 20% darker**: `background-primary` #171717 → #121212, `background-secondary` #2e2e2e → #252525, `background-tertiary` #373737 → #2c2c2c, `background-disabled` #454545 → #373737, `extensions-background-surface` #222222 → #1b1b1b, `border-primary` #383838 → #2d2d2d, `border-accent` #5a5a5a → #484848, `border-disabled` #404040 → #333333, the `overlay-light` fill, and every `-hover` of these (kept one step lighter than its base). Text, the accent and the colored fills (error, success, warning, light-accent…) and `always-dark` are unchanged. The Overgear dark theme sets its own navy palette and is not affected.

## Overgear: a blurred header, with a setting of its own

- **The header of the example** (desktop and phone) is transparent with a layer under it that blurs what scrolls beneath and fades out downwards, the same effect as under the bottom bar: the page no longer stops hard at a solid header.
- **A setting on the Theme page** of the showcase, "Header", in "Elements with settings of their own" (on by default, stored with the theme). Off, the header is solid again unless the theme glass is on, which gives the same blur to every header. The setting is written as `data-og-header="own|theme"` on `<html>`, next to `data-og-bottombar`.

## Tabs: the panel is a slot of the component (breaking)

- **`Tabs` is data-driven and owns its panel**, like `Dialog` owns its body: `<Tabs items={[{ value, label, icon, counter, badge, disabled, content }]} …>` renders the row and, under it, the panel of the selected tab. The content of a tab is the `content` of its item, or `children` (a node, or a function of the selected value) for tabs that have none. `Tab`, `TabList` and `TabPanel` are no longer exported, so the row and its panel cannot be pulled apart and a tab has one natural place for what it switches. The size, `showIcon`/`showCounter`/`showBadge`, `motion` and `label` are props of `Tabs`; `panelClassName` styles the panel; the first enabled tab is selected by default. With no content the component is only a row (navigation, a view switcher), and renders no `tabpanel`.
- **D17 stays as the guard for what is above the row** (`auditTabs`, run by `npm run check`): a component cannot stop a page from changing its heading, but the audit fails the page. The console warning for "no TabPanel" is gone with the old parts.
- Moved to the new API: the templates (product, dashboard, settings dialog, top nav, gallery, table), the Overgear showcase and the game page, the docs of Tabs. The Overgear showcase panel is one flat column (heading and lead, then the sections), the Team template groups its filters and table in the panel.

## Rule D17: tabs change only what is below them

- **The rule** (shared, must): the page goes in this order, what is true for the whole page, then the tabs, then everything that belongs to one tab inside its `TabPanel`. Switching a tab must not change the title, the lead or any block above the tablist.
- **Enforced two ways.** `auditTabs()` (`src/constitution/audit-tabs.js`, exported) presses every tab of every tablist, compares the text above the tablist before and after, and puts the page back; `tools/check/constitution.mjs` runs it on every page, so `npm run check` fails on a page that breaks D17. And `Tabs` warns in the console when it has a tablist and no `TabPanel`, which is how content gets driven from outside. Tests cover both.
- **The Overgear showcase follows it.** The page is now: Overgear Showcase (title, general lead, the two buttons), the tabs, and under them the heading, the lead and the content of the selected tab, in a `TabPanel`. The tab pages use `h3` for their sections (h1, then h2 for the tab, then h3). The decorative tabs of the Theme preview got panels.

## ButtonGroup

- **`ButtonGroup`** (page "Button Group" under Button): the layout of the buttons of one decision belongs to the group, not to each button. Horizontal is a row that wraps; **vertical is a column in which every button fills the width** (done in CSS by the container, so links and wrapped buttons stretch too, and no button needs `width="100%"`). `stackOnMobile` turns a row into a column below 768px, `size` gives the buttons one tier (like `ControlRow`), `justify` places a row, `label` names the group for a screen reader (`role="group"`).
- The shared agent default "Button groups" and the usage guidance say it: use `ButtonGroup`, one primary button, the primary first in a vertical group.
- The Overgear showcase (the Open the example / Back to the documentation pair) and the account form use it; both are a full-width column on a phone.

## Tokens: one naming style

- **All 126 Figma-style tokens are lowercase kebab-case**: `--baseui-Text-and-Icon-Primary` → `--baseui-text-and-icon-primary`, `--baseui-Typography-Text-16-Semi-Bold` → `--baseui-typography-text-16-semi-bold`, `--baseui-Extensions-Background-AlwaysLight` → `--baseui-extensions-background-always-light` (camelCase is split: `OnColor` → `on-color`). The spacing, radius, shadow, motion and layout tokens were already in this style. **Breaking, with no aliases:** every CSS, source, test, doc and the constitution text now use the new names (the Tailwind theme is generated from them and has the same utilities).
- **`tests/token-names.test.js`**: no capital letters in a `--baseui` name, and every `var(--baseui-…)` a source reads is defined (a renamed token cannot leave a silent hole). Checked against the previous build: the computed styles of 14 pages (the docs, the Overgear showcase and example, a template) are identical; the one difference, the Color page missing 96 swatches, was a filter in the Foundations kit that matched `accent-…` and is fixed.

## Checks: fewer, quieter, and enforced

- **Audits fixed at the source.** Radius: the rows of the choice popup are 12px in its 20px popup, the template thumbnail follows its card (14px inset, 10px corner); the radius check is clean on 58 pages. Size balance: a heading may use the display steps of the type scale (28, 40, 48, 56), so the hero of the example is on the ladder. Spacing was already clean on the templates and on Overgear.
- **The icon-weight audit is removed** (`tools/audits/icon-audit.js`, `check/icons.mjs`): icons have the standard stroke 2 and are no longer matched to the text, so there was nothing left to check. `weight="auto"` of `Icon` stays.
- **Rules less crude.** U1 counts only buttons and links; D13 knows names such as "Season 2"; C6 skips a text marked `data-user-content` (a review, a comment); H5 skips subtitles, descriptions and hints (secondary by design).
- **`npm run check`** runs every browser check on a server it starts itself; `npm run verify` is the type check, the tests and the checks. Playwright is a dev dependency now.
- **Tests.** Stories are no longer snapshotted one by one: each must render, without duplicate ids and with a name on every button and link, and ten complex components keep a snapshot. Controls with a `mapping` are applied (one Navbar story had failed silently, recorded as an "ERROR" in the snapshot). The unhandled `fetch` of `tokens.css` that made `vitest` exit with 1 is answered from the disk.
- **Type check** reads the `.jsx` sources and ignores what tsc says about the built `.js`; the tests folders are skipped.
- **Generated files** stay in git (the registry is served from the repository, agents read the constitution there); `npm test` regenerates them first and `npm run check:generated` fails when the committed ones are stale.

## Tabs: no slide buttons and no fade below the lg breakpoint

- The slide buttons of a `TabList` (and the fade under them) are hidden on screens narrower than 1024px (below lg, the sm and md breakpoints and the phone), where the row is scrolled by touch or the wheel. From 1024px they are shown as before, for every size of the component. (The first version of this change hid them by component size; that is reverted.)

## Rule A3 (touch targets) removed

- A3 is gone from `src/constitution/rules.js` and the audit (the 44×44 px check on a phone); CONSTITUTION.md has 57 rules. The other ids keep their numbers, A3 is not reused. The options `touch` of `auditConstitution` no longer does anything.

## Refactor 6: a clean type check, fewer constitution findings

- **`npm run typecheck` passes** (0 problems). Seven errors were fixed in the sources in a way that survives the compile (`Dialog`, `Icon`, `Table`, `dropdown-parts`), with no change in behaviour.
- **Badge text meets A1 (4.5:1).** The colored badges `success`, `error`, `green`, `red`, `pink` and `blue-light` carried white text on light fills (2.0–3.3:1); they now use the always-dark text color like `warning` and `orange`. The look of these badges changes.
- **Overgear example:** the fine print is `og-caption` (a caption, so H5 holds), a review in a row is set in Primary (H5), the reviews have no final period (C6). The D13 audit no longer takes a name like "Season 2" for a count.
- **U1**: the footer social buttons of the example are secondary (one primary action per page); the audit counts only buttons and links, not badges.
- `check:constitution` goes from 20 findings to 7, all of them A3 (touch targets on a phone).

## Refactor 5: the old names are gone from CSS, slots and props

- **CSS classes and `data-slot` values follow the component names**: `bui-chip*` → `bui-token*`, `bui-chip-group*` → `bui-token-group*`, `bui-modal*` → `bui-dialog*`, `bui-select*` → `bui-selector*`, `bui-autocomplete*` → `bui-typeahead*` (its chips are `__token`), slots `chip*` → `token*`, `modal*` → `dialog*`, `textfield*` → `textinput*`, test ids `modal-*` → `dialog-*`, `select-trigger` → `selector-trigger`, the property `--modal-visual-viewport-*` → `--dialog-visual-viewport-*`. **Breaking** for product CSS that selects them (the Overgear example is updated).
- **Props**: `mobileModalProps` → `mobileDialogProps` (Selector, Typeahead), `multipleDisplay="chips"` → `"tokens"` (Typeahead), `DIALOG_HEADER` (was `MODAL_HEADER`). The audits and the constitution check use the new slots.

## Refactor 4: tools and Overgear by purpose

- **`tools/` has three folders.** `build/` (js, registry, types, tailwind, vendor, docs, constitution; the `build-` prefix is gone from the file names), `check/` (the browser sweeps and the type check; `check-` and `run-` prefixes gone, `run-spacing-check` is `run-spacing`) and `audits/` (the modules that run inside a page), with `lib/sweep.mjs` shared. The `npm run` names are unchanged; `tool:` fields of the rules, the docs and the stories point to the new paths. The type check no longer crashes on the missing `examples/` folder (it reads `overgear/` now).
- **`overgear/` follows the same shape.** `tools/build/`, `tools/check/`, `tools/audits/`; the showcase pages are in `overgear/showcase/` (`app`, `theme-page`, `typography-page`, `showcase.css`) and `theme-local.js` is `theme.js` (the Overgear theme, next to `overgear.css`). The addresses `overgear/` and `overgear/example/` are the same. `overgear/README.md` has the layout.
- **One CSS rule for the title, the caption and the error line of a field group** (checkbox group, radio group, token group, checkbox) instead of copies.

## Refactor 3: one name per component, audits in their own folder

- **Components are named as their documentation pages.** `Select` → `Selector`, `Autocomplete` → `Typeahead`, `Chip` → `Token`, `ChipGroup` → `TokenGroup`, `TextField` → `TextInput`, `Modal` → `Dialog` (components, story files, exports, registry items `selector`, `typeahead`, `token`, `token-group`, `text-input`, `dialog`, usage guidance, docs, the Overgear example). The aliases in `src/index.jsx` and in the stories kit are gone, and the `Checks` barrel too: `Checkbox`, `CheckboxGroup`, `Radio` and `RadioGroup` are exported from their own files. **Breaking** for code that imported the old names; CSS classes (`bui-chip`…) and `data-slot` values are unchanged.
- **`tests/naming.test.js`** keeps it so: a page title, its story file, the component file, the export (no `as` aliases) and the registry item must be the same word; a new component named differently fails the test. The list of the few deliberate exceptions is in the test.
- **Browser audits moved to `tools/audits/`** (`spacing-balance.js`, `size-balance.js`, `radius-check.js`, and `icon-weight.js` renamed `icon-audit.js` so it is not mixed up with the runtime `src/icon-weight.js`).
- **The stories snapshot no longer depends on test file order**: React's `useId` ids are renumbered by first appearance, so adding or renaming a story file does not touch the other snapshots.

## Refactor 2: one browser harness for the check scripts

- **`tools/lib/sweep.mjs`.** `check-icons`, `check-radii`, `check-sizes`, `check-constitution` and the spacing runner each carried their own copy of the Playwright loop (launch, open the page, wait, audit, group, report). They now share `launch`, `sweep` and `report`, and keep only what is specific to them: the in-page audit and the text of a finding. Output and exit codes are unchanged (same counts as before on the docs and the Overgear example).

## Refactor 1: one public entry, clear icon names, a stable calendar test

- **Public entry (`src/index.jsx`).** It lacked `Autocomplete`, `ChipGroup`, `ChoiceSheet` and `Dropdown` (a consumer of the package could not import them) and took `TextField`, `Switch`, `Chip`, `Select` and `Modal` through a "compatibility" barrel, `src/base.jsx`, that the code itself used. The barrel is deleted: every file imports a component from its own file, the entry exports every component in alphabetical order, and the types (87 exports now) and the registry follow.
- **Two things called `Icon`.** The marks that components draw for their own state (check, cross, chevron, status) are `BuiltinIcon` in `src/builtin-icons.jsx` (was `Icon` in `src/icons.jsx`); `Icon` is only the catalog icon of `components/Icon.jsx`.
- **The stories snapshot test no longer depends on the date**: the clock of the test stands at 30 October 2026, because the calendar stories draw "today" and every snapshot of a date broke at midnight.

## Isolate Overgear product rules

- Moved U12–U14 to `overgear/constitution/rules.js` as OG1–OG3. The dense listing gap is also local; baseui keeps 58 shared rules with stable ids.
- Added local generated constitution and agent instructions, an optional `baseui-kit/overgear` entry and a banner that combines shared and store rules. New Overgear rules and checks belong under `overgear/`.
- Moved the whole-row listing audit to `check:overgear:spacing`; shared spacing checks no longer apply this store policy. Added dependency-boundary and rule tests.

## BottomBar without labels is taller

- A `BottomBar` with `showLabels={false}` (the compact bar) is taller: the item is 44px (was 40px) and its icon pill 36px (was 32px); the floating compact bar's item is 48px (was 44px), so the whole floating bar is 80px (was 76px). With labels nothing changes. Overgear's `--og-bottom` (the room the pages leave under the bar) is 84px.

## Overgear bottom bar: no labels

- The bottom bar of the example has icons only (`showLabels={false}`, the compact bar); every button keeps its name for a screen reader (Home, Catalog, Favorites, Cart, Account).

## Overgear home: new icons and centered cards in the trust block

- The three icons of "Gamers trust Overgear..." are the new pictures (the diamond for Best value, the shield with swords for the moneyback guarantee, the globe for One-stop shop), saved as 320px PNG in `overgear/example/assets/benefits/` (about 90 KB each, from the 1254px originals) instead of the SVGs linked from the site; they are shown at 96px.
- In every card of the block the icon, the title and the text are on the middle line; the heading of the section stays on the left edge, like the other headings.

## Overgear fonts: TT Interphases Pro is linked from the overgear repository

- The font set **Overgear.com** loads TT Interphases Pro by a link to the file in the repository `dalwoo-ru/overgear` (`assets/fonts/tt-interphases.woff2`, the same file as on overgear.com: 126,372 bytes, byte for byte). The link is `raw.githubusercontent.com` pinned to a commit (it sends the CORS header the browser needs, unlike overgear.com), so nothing is copied into this repository. Inter stands in until it loads. The git-ignored local path from the previous change is removed.

## Overgear fonts: the licensed file stays out of the repository

- A link to the font on overgear.com was tried: the browser refuses it (the file is sent without a CORS header, `FontFace.load()` fails with a network error). So the file cannot be linked. The path `overgear/fonts/TT_Interphases_Pro_Variable_Latin.woff2` is in `.gitignore`: a licensed copy put there works on that machine and is never committed or pushed. On the deployed site Inter stands in.

## Overgear Theme: font sets

- A new setting **Fonts** on the Theme page picks a whole font set: the heading font, the text font and their tracking together. **Apfel Grotezk** is the set that was there (bundled, SIL OFL); **Overgear.com** is the set of the live site: TT Interphases Pro for the headings and the text, with its tracking (-0.4px on headings, -0.2px on text), taken from the site's CSS. The choice is kept in the theme cookie, applies to the showcase and the example, and Reset goes back to Apfel Grotezk.
- TT Interphases Pro is a commercial font of TypeType, and the site's file cannot be linked from another origin (no CORS header), so it is not in the repository. The set declares `local()` and `overgear/fonts/TT_Interphases_Pro_Variable_Latin.woff2`: a licensed file put there is used at once. Without it Inter (Google Fonts, SIL OFL) stands in, which is the closest open font.

## Navbar: pinned to the top

- The `Navbar` is `position: sticky; top: 0` (as the bottom bar is sticky at the bottom): it stays in view while the screen scrolls, in every product, not only in the example. Rule H7 says so. Checked in the Overgear mobile checkout: after scrolling 600px the bar is still at the top.

## Overgear mobile checkout: a navbar

- On a phone the checkout has no logo and no "Secure Checkout" heading: it starts with the Navbar of the system (a back button and the title "Checkout") across the whole width, outside the padded page. The desktop checkout is as before.

## ControlRow: controls in one row match (rule D15, extended)

- **Rule D15** is now "Controls in one row match": the same height, the same text size and the same icon size (it was only a button beside an input). The audit also compares the icon of a button with the icon of the field beside it.
- **New component `ControlRow`** (`size`: xsm / sm / md / lg, `gap`, `align`): a row that gives its controls one tier. A `Button` or an `IconButton` without a `size` takes the tier (32 / 40 / 48 / 56); a `TextField`, `Select` or `Autocomplete` without a `size` takes the field of that height (the 48px field for md, the 56px for lg); one icon size (16px in xsm, 20px otherwise) and one text size (12, 14, 16, 16) for all of them; a field takes the rest of the width. A size set on the control itself wins. The mechanism is `src/control-size.js` (a context), so any other component can read it.
- Used in the Overgear example: the header (catalog button, search, favorites, cart, log in: all 48px, 16px text, 20px icons), the sort row of the catalog and the promo code row. The Button, TextField and FieldShell sizes have no default now and fall back to md as before outside a row. Tests (3 new), the registry and the types are updated.

## Overgear catalog button: the icon morphs

- The icon of the Catalog button is one drawing of three lines (`MenuMorph`): when the panel opens the top and the bottom line move to the middle and turn into a cross while the middle line goes out; on closing it turns back. 300ms, the ease-out token; it follows the motion setting (nothing moves with Animation off or with reduced motion).

## Button: optical compensation for a leading icon

- A button that hugs its content (no `width`) and starts with an icon has a smaller left padding: 4px less for `md` and `lg`, 3px for `sm`, 2px for `xsm` (the icon has air inside its box, so the content looked pushed to the right). The button gets `data-hug-icon`. Buttons with a set `width`, icon-only buttons and buttons without an icon are as before. The story snapshots, the registry and the types are updated.

## Button: the icon and the gap follow the text size

- A button with an icon and 16px text (the default of every size, `lg` included) takes a 20px icon 8px from the label; before, `lg` forced a 24px icon 12px away, which was too big and too far for 16px text. Now by the text: 12px text, a 16px icon 4px away; 14 and 16px text, 20px and 8px; 20px text, 24px and 12px. Icon-only buttons are not touched.

## The showcase text under a heading, and checks so it does not happen again

- **The bug:** on the Overgear showcase a 14px secondary note sat 26px under a 24px heading, so it looked detached, quiet and too small. Now the text under a section heading is 16px in the primary color, 16px from its heading (a `ov-section__head` group), with 24px to the content; the quiet 14px text stays for the hints inside a setting row. The page header is regrouped (the eyebrow and the title together, the lead under them) and the rows of the weights are 12px apart.
- **Spacing check** (`tools/check-spacing.mjs`) now sweeps the three pages of the showcase by default too: it already knew this pattern (`drift`), it just never looked at these pages.
- **New `tools/check-constitution.mjs`** (also `npm run check:constitution`): runs the audit of the rules marked check: auto in a real browser on Overgear's pages, wide and narrow. On the old code it reported the secondary 104-character note (H5).
- **Rule H2 (Readable type)** and its audit got a new line: the text right under a heading of 24px or more is 16px or more and in the primary color; the audit reports a smaller text under a big heading. CONSTITUTION.md and AGENTS.md are regenerated.

## Overgear showcase: the blue cast on the Theme page, tabs Theme, Typography, Colors

- The setting **Blue cast** (1 to 5) is a row of the Theme page, between Glass and Brand; the Colors page no longer has it (it shows the palette as the theme sets it).
- The tabs are in the order Theme, Typography, Colors, and the showcase opens on Theme when the address has no page.

## Overgear: step 5 of the blue cast is the navy of overgear.com

- The full cast (step 5) is now the navy scale of the real site: ground #050622, layers #131632 and #1e2242, borders #293054, text #ededf5 and #a7a7c8 (taken from its `--color-neutral-*` tokens). Step 1 is a neutral gray of the lightness of the old graphite; steps 2 to 4 mix the navy in by 25, 50 and 75% (`color-mix` in oklab, relative colors for the gray). The accent blue is as before. The old, weaker cast is gone, so the example is bluer than before by default.

## Overgear Colors: the blue cast of the dark theme in five steps

- A new setting at the top of the Colors page: **Blue cast of the dark theme**, 1 to 5. Step 1 is neutral gray, step 5 is the full cast of Overgear as it was. The steps keep the share 0, 25, 50, 75 and 100% of the chroma of the grays (text, backgrounds, hovers, borders, the surface), with their lightness and hue; the accent blue is not part of it. The palette below the setting is re-read at once, and the example follows the same cookie (`tint` in the theme cookie; Reset on the Theme page goes back to step 5).
- It is made with relative colors in `overgear/overgear.css` (`oklch(from #11141a l calc(c * var(--og-tint)) h)`); a browser without them keeps the full cast.

## Overgear: the purchase buttons are the brand button

- Buy now (offer), Secure checkout (cart and its panel) and Pay (checkout) are the plain primary button, in the brand color of the theme (`Background-Brand`: white in the dark theme by default, the color picked on the Theme page otherwise). The accent override of these buttons is removed.

## Overgear Theme page: global floating and glass, local settings for the bottom bar and the dropdowns

- The Theme page has the global settings **Floating** and **Glass** (off / on; both off by default). They are the theme settings: every element that has no setting of its own follows them.
- A new section, **Elements with settings of their own**: the **Bottom bar** (floating and glass) and the **Dropdowns** (glass) each have an "Own settings" switch (on by default). With it on the element keeps its own look whatever the theme says; with it off the element follows the theme settings.
- The logic is `overgear/theme-local.js`, shared by the showcase and the example (one cookie): the theme glass `true` wins, else the dropdowns' glass `'dropdowns'` when their local setting is on; the bottom bar reads `data-og-bottombar` (`own` or `theme`). The enhanced-animations default moved there too, so the Theme page shows Enhanced from the start. Reset restores the defaults.

## Glass for the dropdowns at the level of the theme

- The `glass` setting of the theme can be `'dropdowns'`: `<html data-glass="dropdowns">` makes the menus of every `Dropdown` (and so of every trigger that opens one) translucent and blurred, and nothing else. `true` and `false` work as before; the `glass` prop of a component still overrides the theme.
- Overgear asks for it (`glass: 'dropdowns'`), so the three per-component `glass` props of the example are gone and any new dropdown has the glass without asking. The bottom bar still asks for its glass itself.

## Overgear: glass on the dropdowns

- The three dropdowns of the example (the sort chip, the sort button of the catalog, the account menu) are translucent and blurred (`glass`), although the theme keeps glass off everywhere else.

## D16 (links in the color of the text): the checkout fixed, the audit sees links in cards

- The links of the legal text of the checkout ("Terms of Use", "Privacy Policy") were plain `<a>` with their own primary color inside a secondary paragraph. They are the `Link` component now (the color of the text around, underlined), and the stray `.og-fine a` style is gone.
- The audit (`auditConstitution`) skipped every link inside a card, so it never saw this. It now checks them too; only the hit area of a clickable card is left out. Audit of the checkout, the cart, the home, a game, an offer, the account, an info page and the catalog finds no D16 problem.

## Constitution: two weights (H9) and an agent default; the cart title is bold

- New rule **H9, Two weights: bold and regular**, and an agent default **Font weight**: when an agent sets a weight itself it takes bold (what leads: a title, a heading, a price, a name) or regular (the rest). Semi-bold comes from the components that carry it (buttons, tabs, labels, list titles), or from a direct request of the person. CONSTITUTION.md, AGENTS.md and CLAUDE.md are regenerated (61 rules).
- The title of the cart panel, "Shopping Cart", is bold.

## Overgear: enhanced animations by default

- The example runs with the enhanced animations (highlights slide, menus grow from their trigger). It is set once for a browser, so a stored basic setting is lifted too; after that the Animation setting of the Theme page works as before, and its Reset goes back to enhanced.

## Overgear cart panel: details

- The title is "Shopping Cart 2": the count is the same size, secondary and regular, without the word "items".
- Every line of the cart lies on a card (Tertiary on the panel).
- "Sold by Overgear" and "Delivery time: ..." are regular (they were bold).
- The Item(s) row is removed from the cart summary (it stays in the checkout summary).
- The left corners of the panel are round on a desktop.

## Overgear cart and checkout, as on Overgear

- **Cart.** On a desktop the cart icon of the header opens a side panel (a scrim, Esc and the cross close it): "Shopping Cart (1 item)", the lines of the order (the picture, the name, the price, what it is, "Sold by Overgear", "Delivery time", a delete button), and at the bottom Item(s), "Apply promo code" (a section that opens into a field), Subtotal, "Cashback you will receive" with a hint and the amount in OG Coins, and the Secure checkout button. On a phone and by the link `/cart` the same parts are a page.
- **Checkout** has a slim top bar of its own (the logo, a back button and "Secure Checkout"), no header and no footer of the shop, and a small footer with the payment descriptor and the security badges. Left: "Review order" (the lines, an email field for a guest), "Payment method" (Card, Apple Pay, Google Pay, Klarna, Neteller with their service fees, "Show other payment methods" for PayPal, Cryptocurrency and Account balance) and "Apply promo code". Right: "Order summary" (Item(s), Payment fee, Amount to pay, Cashback) and Pay. On a phone the columns stack. The order is paid with the fee included.
- Cashback is 1% of the amount in OG Coins (the offer page agrees). The payment logos and the cashback icon moved to `ui.jsx`; the cart lines keep the picture and the delivery time of the offer.

## Overgear desktop header: 16px text

- On a desktop the Catalog and Log in buttons and the search text are 16px (they were 14px); a phone keeps its sizes.

## Overgear catalog: the row highlight is not cut, 8px more after the chips

- The highlight of a game row (hover and the chosen one) bled 12px past the text and was cut by the scrolling box; the box now keeps it inside (`--bui-list-bleed: 0px`), so the rounded corners are whole.
- In the right column the blocks are 32px under the quick-link chips (it was 16px).

## Overgear catalog (desktop): no card under the games, a divider, a sorting button

- The list of games is not on a card any more; the games and the offers of the chosen game are two zones split by a vertical divider (32px each side).
- At the right of the search an icon button opens a menu: by popularity (the order of the shop), A to Z, Z to A.

## Overgear catalog: the groups of a game as blocks

- Desktop (the catalog panel and `/catalog/:slug`): the right column of a chosen game is the name, a row of quick links (chips with a picture: Hot offers, WoW Gold, Season 2) and the groups of offers as blocks in columns: a heading (a link) and the kinds under it (Raids, Mythic+ Dungeons, Leveling, Character Boost, PvP, Delves, Achievements, Collectibles with the lines of the real menu). The columns are 220px at least, 40px between the rows, 24px between the columns.
- Phone (`/catalog/:slug`): the quick links, then a section per group (`CollapsibleGroup`, several can be open); a section opens into "All ..." and its kinds, one row each.
- Every line opens the listing of its group (`/games/:slug?s=group`); the other games have three generic groups (Currency, Items, Boosting). The data is `catalogOf` in `data.js`.

## Product card: the picture grows on hover

- The picture of a `ProductCard` (every listing) grows 6% when the pointer is over the card; only where hover exists and not with reduced motion. The motion uses the 300ms duration token.

## Status: a neutral info icon; Overgear: the same breadcrumbs on every game page

- `Status` with the default `neutral` state shows the info icon (an "i" in a circle), not the inbox: the box is no longer pulled into every empty state. A different icon is still set with `icon`. The story snapshot and the registry are updated.
- A game page that has no offers yet (Valorant and the others) now has the same top padding as the other pages with breadcrumbs, so the crumbs no longer jump by 4px. `Page` got a `crumbs` prop for a page whose crumbs are not a `PageHead`.

## Dropdowns and popovers: left edge by default, right edge when it does not fit

- The panel of a Dropdown or a Popover (`useAnchoredPosition`) is aligned with the left edge of its trigger by default. When it does not fit into the window that way it is aligned with the right edge of the trigger (and the other way round for `-end`). It is never centered or shifted by some pixels; only when neither alignment fits is it kept inside the window.

## Overgear offer page: the cashback tag at the right of the price, the icon from Overgear UI

- The "Cashback 3%" tag is at the right of the price. Its icon is the CashbackBadgeIcon from the Overgear UI icons page (an inline SVG in `offer.jsx`), instead of the linked picture of the site.

## Overgear offer page: the cashback beside the price

- In the checkout card a "Cashback 3%" badge with the cashback mark of the real service (a white SVG linked from overgear.com, not copied) stands at the left of the price. The percent is a fixed example value.

## Overgear offer page: back to the plain header, a smaller picture

- The card under the header is gone (the previous change is reverted): the header is as before, with the picture before the title.
- The square picture is smaller: 80px (60px on a phone), was 96px (72px).

## Overgear offer page: a square picture in the header

- The picture of the offer is a 96px square (72px on a phone) before the title and its line (badge, rating, purchases); it is removed from the "About this offer" section. `PageHead` got a `media` prop for it.

## Overgear offer page: sections instead of tabs, 16px text

- "About", "Requirements" and "Reviews" are three vertical sections (a heading each, the number of reviews beside the heading) instead of tabs.
- The text inside them (the list of what is included, the paragraph, the requirements, the reviews) is 16px.

## Overgear listings: the sorting at the right end of the chips row

- On a desktop the sorting chip stands at the right end of the row of subcategory chips (the chips scroll, the sorting stays); on a phone it stays on its own row under them.

## Overgear home: Show more instead of the endless scroll

- Popular products on the home page show two rows and a Show more button (each click adds rows, up to 100 products); the other listings keep the endless scroll.

## Chip: `endIcon`; sorting as a chip with a chevron

- `Chip` (and the options of `ChipGroup`) got `endIcon`: any icon at the right end of the chip, in the text color. The registry and the types are rebuilt.
- Overgear listings: the "Sort by" select is replaced by a chip with the current method ("Popular", "Price, low to high", "Rating") and a chevron at its right end; it opens the list of methods. Same on the sellers table of WoW Gold (Price, Reliability).

## Overgear: breadcrumbs 4px higher, more air under them

- On the pages that start with breadcrumbs (a game listing, an offer) the crumbs are 4px higher, and the title is 16px under them (it was 8px).

## Favorites heart: no tooltip

- The heart of `ProductCard` and the `WishButton` of the example have no hover tooltip (`tooltip={false}`); the accessible name stays. The story snapshots are updated (the generated ids shift by the removed tooltips).

## Overgear: endless scroll in every listing

- `OfferListing` (every listing of the example: home, games, offer, favorites) uses `more="infinite"`: the next rows appear on their own when the end of the listing comes near the screen, no Show more button.
- The Popular products on the home page load 20 more at a time up to 100, so the footer can still be reached.

## Overgear home: the hiring block on a card

- The hiring block (heading, text, button) is on a surface card with 40px padding, everything centered.

## Overgear home: steps, reviews and the hiring block

- "Overgear is streamlined...": the screenshots are gone, the four steps are numbered (1 to 4) with a title and a text.
- "Gamers trust Overgear...": the Start Your Journey button is removed.
- Reviews: five orange stars (icons, no number); on a desktop two buttons (previous, next) in the section header scroll the row sideways, a phone swipes it.
- The hiring block is a heading, a text and a button, not a banner.

## Overgear home: the game chips open the listing

- A game chip of the home page opens the listing of the game (`/games/:slug`), not the catalog.

## Overgear offer page: the checkout card

- Buy now is 16px under the price, in the accent color of Overgear, with a shield icon.
- Add to cart has a cart icon and is stretched up to the heart; the heart is a secondary Icon Button (with a background). `WishButton` got a `variant` prop (ghost by default).

## Overgear offer header: purchases instead of the time

- Under the title of an offer: the badge, the star with the score, the count of ratings in brackets again, and the number of purchases ("2.1K sold") in the same size and color as the count of ratings. The "Done in ..." line is removed from the header.

## Overgear rating: one star

- `Stars` is one filled star the size of the text (14px, 16px on the offer page) before the number, 4px apart, instead of five stars; the number and the count of ratings are as before. It is used everywhere `Stars` was (the offer page, the reliability column of the sellers table, reviews).

## Overgear rating line

- `Stars` (the stars with the score): the number is 8px from the stars, regular and in the primary color; the count of ratings is secondary, without brackets, 4px after the number. On the offer page it is the bigger size (medium stars, 16px text).

## Overgear offer page: the form on a card

- The order form is on a surface card with the same padding as the checkout and trust cards on the right.

## Overgear offer page: the title like in the listing, two columns by purpose

- The page starts like a listing: breadcrumbs, a 40px title, the badge, the rating and the time under it.
- Left column: the order form (difficulty, how it is played, extras, quantity, a note), then "About this offer" (the picture of the offer, details, requirements, reviews).
- Right column (sticky): the checkout card (price, Buy now, Add to cart, favorite) and a Trust and safety card (moneyback guarantee, ID-verified pros, secure payment, 24/7 support). On a phone the columns stack in the same order.

## Overgear: the Popular tag has equal margins

- The Popular tag of the World of Warcraft chip is 12px from the left edge and 12px from the bottom edge (it was 15px from the bottom: the tag sat in an inline box with a line gap).

## Overgear footer: a bigger logo

- The logo in the footer is 36px high (was 28px).

## Overgear footer: 14px text, white social buttons

- The links and the small print of the footer are 14px (were 12px); the column headings stay small caps.
- The social buttons are the primary Icon Button on the Text-and-Icon-Secondary background (the primary text color on hover), the mark in the color of the footer background.

## Overgear: a colored mark in the phone header

- The phone header shows the mark of the desktop logo in its colors: the full logo picture is cropped by CSS to the mark in the square, the name is hidden (no separate picture is needed). The grey `main-page/overgear-logo.svg` is no longer used.

## Overgear: fix the header broken by a class name clash

- The new wrapper of the home page's upper part had the class `og-top`, which the header already used: the header stacked in a column. The wrapper is now `og-lead`.
- The sections of the lower part are 96px from the listing and 80px apart on a desktop (it was 80 and 80, which the spacing check rightly flagged once the clash was gone); on a phone 40 and 32.

## Overgear home page: a bigger lower part

- From "Overgear is streamlined and really easy to use" down (the steps, the trust block, the reviews, the hiring banner) the section headings are Header 40 on a desktop (card and step titles 24 and 20), the heading is 24px from its content, the sections are 80px apart, and the lower part is 80px from the listing above.
- The upper part (headline, games, Popular products) stays 48px apart. On a phone the sections are 32px apart.

## Overgear: no fire icon in the Popular products heading

- The heading is plain text; the unused `og-title-ico` style is removed.

## Overgear: the Popular tag is white with a fire icon

- The Popular tag of the World of Warcraft chip is the white (primary) Badge with the Fire emoji (linked from Fluent Emoji; the icon set has no flame).

## Overgear game chips: 14px name on a desktop, the picture grows on hover

- On a desktop the name of a game chip is 14px (12px on a phone); on hover the picture grows 8% (only where hover exists, with the motion token).

## Overgear footer: social icons are Icon Buttons

- The social links are the `IconButton` component (secondary, sm, as links with a label and a tooltip); the marks are inline SVG in the text color, so the `assets/social` files are removed.

## Overgear footer: its own background, a tinted logo

- The footer has no divider on top: it sits on the Secondary background, different from the page.
- The logo in the footer is painted in Text-and-Icon-Secondary (an SVG filter, so it works for the linked picture); the social buttons are on Tertiary.
- The line "A baseui example with mock data" is removed.

## Overgear footer follows the site's layout

- Order as on the site: payment logos (8) in a row, a divider, the logo with the social icons (Facebook, Instagram, TikTok, YouTube, X; SVG saved in `overgear/example/assets/social/`, drawn in the text color through a mask), four columns with small uppercase headings, Other games in four columns, the full not-endorsed text, the copyright line with the SecureCode, Verified by Visa and PCI DSS badges on the right.
- Links are 12px, on a phone the columns are two per row.

## Overgear: the logo in its own colors, payment logos in the footer and the cart

- The logo of the header is shown in its real colors (the monochrome filter and its SVG filters are removed).
- The payment and security logos of the site (Mastercard, Visa, PayPal, Apple Pay, Google Pay, JCB, Stripe, SEPA, SecureCode, Verified by Visa, PCI DSS) are saved as SVG in `overgear/example/assets/payments/` (the site embeds them inline, so there is no address to link) and shown in the footer and in the cart instead of the text list.

## Overgear home page: the content after the listing and the footer follow overgear.com

- Sections below the listing use the real texts: "Overgear is streamlined and really easy to use" (4 steps with the pictures of the site), "Gamers trust Overgear to supply everything they're looking for in online games" with Start Your Journey and the three benefits (icons of the site), "What our clients say" with 12 real reviews, the hiring banner with Start earning with Overgear.
- Footer: columns Overgear, Legal, World of Warcraft, WoW Mists of Pandaria, the full Other games list, the not-endorsed note and the copyright line of the site. New demo info pages: careers, guides, consent, credential.
- Pictures are hotlinked from overgear.com, not copied.

## Overgear home page: more air between the blocks on a desktop

- The main blocks of the home page are 48px apart on a desktop (40px on the other pages, and on a phone).

## Header 56, a bigger headline and headings on the desktop home page, the Popular tag

- A new size of the header scale: **Header 56** (56px / 60px, the space between two paragraphs 24px), the next after Header 48; it is in `tokens.css`, the Tailwind theme and the typography pages.
- Overgear desktop: the headline of the home page is Header 56, the headings of the sections (Popular products and the ones below) are one size up (Header 28 instead of Header 24); the World of Warcraft tile of the games block has the tag Popular at the bottom left, under the name.

## Overgear: every page title is 40px on a desktop

- The `big` flag of the page head is gone: the title of every page of the example is 40px on a desktop (28px on a phone, as before), with no condition.

## Relative layout: a rule, and the game page follows its chips

- New rule **H8** (layout is relative, not fixed) and an entry **Relative layout** in the defaults for agents: blocks are placed by the gap of their container and sizes come from content or neighbours; blocks that move together are one container, so a change moves everything after it, and the neighbours of a change are checked for a hole or an overlap.
- The game page: the tabs, the chips, the sort and the listing are one group (16px apart), so the chips moved closer to the tabs and the content followed them.

## Overgear game page: a bigger title and tabs, the chips next to them

- The title of the listing of a game is 40px (32 on a phone) and the tabs of the versions are the medium size; the chips with the types of offers are 16px under the tabs, in one group with the title and the tabs; the sort and the listing are the next block.

## Overgear catalog panel: the whole height of the page

- The catalog panel of a desktop opens from the header to the bottom of the window, with the columns on its whole height; the page behind it does not scroll; it closes with the Catalog button, Escape and a choice of a kind (there is no scrim any more: the panel covers the page).

## Overgear catalog panel: a smaller search, a full-height list of games, a bigger title

- The search of the catalog is the small field with the text of 16px; the list of the games takes the whole height of the panel (it scrolls inside); the columns are 48px apart; the title of the right column is 32px.

## Overgear desktop: the catalog is a panel under the header

- The Catalog button of the desktop header opens and closes the catalog as a panel under the header (over a scrim; Escape, a click on the scrim, the Catalog button and a choice of a kind close it) with the two columns and no title; its icon turns into a cross while it is open. The page `/catalog` stays for a direct link.

## List: the details are centered

- The details of a List row (a value, an icon, a chevron) are centered in the row: an icon in the details sat on the baseline of the text, a few pixels above the center.

## Overgear desktop: the catalog in two columns

- On a desktop the catalog is one page of two columns: the games on the left (with a search), the kinds of offers of the chosen game on the right; a row on the right opens the listing. `/catalog` opens the first game, `/catalog/:slug` the chosen one. The phone keeps its steps.

## Overgear: the catalog is not in the breadcrumbs

- The breadcrumbs of the listings are Home → Games → game again; the catalog is a thing of its own and is not a step of that path, and its pages have no breadcrumbs.

## Overgear: the catalog and the listings are two things

- `/catalog` is the catalog, a classifier of the pages (`catalog.jsx`): the games by group and by name; `/catalog/:slug` the kinds of offers of a game (on a phone with the bar of the screen, on a desktop a page of its own). A row opens a listing. The Catalog button of the header (desktop) and the Catalog tab of the bottom bar open it; the games of the home page and of the search lead to it.
- `/games` is a listing of the offers of all the games, like the page of a game (`/games/:slug`): chips with the groups of games, the sort, the products. The step two of the phone no longer lives in the game page: a game opens its listing directly.
- Rule **U14** (catalog and listing are two things).

## Overgear game page: tabs for the versions, chips for the types of offers

- The versions of the game are tabs again, 16px under the title (they belong to the page head, not to the title); the types of offers (All offers, Raids, Mythic+ Dungeons, …) are toggle chips over the sort and the listing, on a desktop and on a phone.

## Overgear game page: a missing variable

- The game page on a desktop failed with "shown is not defined" after the listing was replaced by the Product Listing: the empty-state check still used the old variable. It uses the list now.

## Product Card and Product Listing

- New components. **ProductCard**: the card of a product in a listing (a 4:5 picture with a badge and a heart over it, the price in bold, a title of two lines, the rating and one line of meta); the heart is `favorite={{ active, onToggle }}` and plays a short move when it is tapped. **ProductListing**: the listing of the cards: they take the whole width of a row (the columns reflow), and the listing always shows whole rows, also while more products are loading (the cards that would start a new row wait). After the first `rows` it shows `more="button"` (Show more, the default), `more="infinite"` (an endless scroll) or `more="pagination"` (not used unless it is asked for). `hasMore`, `onLoadMore` and `loading` serve the products that come from a server; `useColumns` gives the number of columns of a grid.
- Rule **U13** (product listings) with a check in `tools/spacing-balance.js` (`rows`: a listing that shows a row with a gap at its end while more products are coming). Usage, stories, documentation, types and registry are there.
- The Overgear example uses them everywhere: the home page (Popular products, endless products with a Show more), the game page, the search, the favorites and the similar offers; its own tile, heart and grid are gone. The game page has no pagination now.

## Overgear game page: chips instead of tabs, no menu, no heading

- The game versions are toggle chips (a row that scrolls out to the edges) instead of tabs; the menu of the services on the left and the heading above the offers ("Hot offers") are gone, on a desktop and on a phone. The listing is under the chips with the sort.

## Tooltip: more rounded

- The tooltip bubble has the radius `xl` (12px) instead of `lg` (8px), and is a pill with the circle shape of the theme, as the chips and the buttons.

## Dropdown: the icon stands in the middle of its box

- The icon of a Dropdown row sat at the top of its 24px box when it was smaller (an icon of 20px), 2px above the center of the row. The box centers its icon now, as the icon of the List does.

## Dropdown: the details stand at the right edge in a menu of actions

- A Dropdown reserved a 24px column for the check mark at the end of every row, also in a menu of actions, so the extra text on the right (the value of a setting) stood 36px from the edge. The new `selectable` prop (true by default) turns the column off for a menu of actions: nothing else takes the place at the end of the row, and the details stand at the right edge. The menus of the Overgear header use it.

## Overgear desktop: the profile and the orders icons

- After the login the header has the same icon buttons as the favorites and the cart: My orders and Profile (a user icon instead of the avatar). The profile menu opens on hover and on a click, with the rows of the account list of the phone: My orders, Favorites, Settings, Currency, Language, Support, Log out. The currency and the language are shared with the account screen (`prefs.jsx`).

## Tooltip: it keeps inside the window

- The tooltip bubble is drawn in `<body>` with fixed coordinates, like the Dropdown and the Popover: it takes the opposite side when its side has not enough room in the window (a tooltip above a button at the top edge opens below it), is kept inside the window along the other axis, and is no longer cut by a container with `overflow`. The positioning is `useAnchoredSide` in `src/floating.js`.

## Overgear: the catalog button is closer to the search, a new catalog icon

- The catalog button and the search are one group, 8px apart; the group is 16px from the logo and 16px from the next button (measured to the button, not to its icon).
- The catalog has the menu icon (three lines) in the header and in the bottom bar.

## Overgear: the game tiles have one radius, the two rows end at the same place

- The picture of a game tile had the radius 12 inside a card of 20, so the corners on the side of the picture were different from the corners on the other side. The tile has the radius of its card now.
- The top row of the tiles was 10px shorter than the bottom one: both rows are 1208px wide.

## Overgear desktop: catalog button, a two-line headline, trust line, whole rows, game pictures

- The desktop header has a Catalog button before the search: a menu of the groups of games.
- The headline of the home page is two lines on a desktop; the rating and the orders are one line with a divider.
- The listing of Popular products always ends a row: the number of cards (and of the skeletons that are loading) is a multiple of the columns.
- Dropdown: a trigger given as an element now opens the menu (it gets the open handler and the ARIA attributes); before, only a render function was wired, so the account menu of the example did not open either.
- The offers of the other games have pictures from the service cards on the game pages of the real service (linked, not copied) instead of the 3D objects.

## Overgear desktop: the search takes the width of the header

- the desktop header has 16px between the logo, the search and the first icon, and the search takes all the width between them.

## Overgear desktop: the logo with the name, no category tabs in the header

- The desktop header has the logo of the service with its name (linked from its server, flattened to one color), instead of the square mark and a text. The row of the category tabs under the header is gone.

## Number Input: bigger buttons, balanced to the edge, the states of the Text Input

- The minus and plus are 36px buttons (32px in the small field) with 24px (20px) icons of the library instead of two 28px signs; the gap to the right edge of the field equals the gap above and below the buttons.
- The field takes the states of the Text Input: `disabled`, `loading` and `readOnly` switch the buttons and the arrow keys off too; `variant`, `status`, `caption`, `prefix`, `suffix`, `floatingLabel` and `ref` pass through.

## Navbar: the back icon stands on the margin of the content

- The padding of the Navbar is the padding of the page (`--bui-page-pad`), and the icon of the first and the last button of a bar stands on that margin: the 48px button reaches 12px past it. The back arrow now lines up with the text under it. Rule H7 says it.

## Overgear: no breadcrumbs in the cart

- The cart has no breadcrumbs, as the other screens of the bottom bar.

## The bars of a screen span the whole width

- Step two of the Overgear catalog rendered its Navbar inside the padded page, so it was a narrow strip with the edges eaten. It is now rendered outside it, as the header is.
- Rule H7 says that a top or bottom bar sits outside the padded page, the Navbar usage says so, and `tools/spacing-balance.js` finds a bar that does not span the width on a phone (`bar`).

## Overgear: no floating bars and no glass but the bottom bar

- Floating and glass are off in Overgear, whatever the stored theme says; the bottom bar of the example asks for both itself (`floating`, `glass` on the BottomBar). The two switches are gone from the Theme page of the showcase. `startTheme(name, force)` takes the settings to lay over the stored theme.

## Overgear: step two of the catalog

- On a phone a game of the catalog first opens the kinds of its offers (All offers, Gold, Raids, …) with a back button; a row opens the listing. The screen has no site header and no footer.

## Overgear: Wishlist is Favorites, and its empty state fills the screen

- Wishlist is called Favorites everywhere. The empty Favorites screen is one Status over the whole height with the heart icon and no title, like the empty cart.

## Overgear: no breadcrumbs on Catalog and Favorites, no count on Catalog

- The Catalog and Favorites screens have no breadcrumbs, and Catalog has no "61 games" line under the title.

## Overgear: one listing everywhere

- The offers of a game, the search results and the similar offers are the same tiles as on the home page (the heart, the price in bold, the rating and the purchases); the wide offer card is gone.

## Overgear: the price on the tiles is bold

- The price on the tiles is Bold (700), not Semi Bold.

## Overgear: the number of purchases instead of the time on the offer cards

- The tiles and cards of the offers show how many times the offer was bought ("1.2K sold") instead of the delivery time. The time stays on the page of the offer.

## Overgear: the heart moves when it is tapped

- A tap on the heart plays a short move: a pop when it fills and a quiet shrink when it empties. It follows the animation setting of the theme.

## Overgear: the heart is closer to the corner

- The heart over a picture is 4px closer to the corner.

## Overgear: the heart without a plate

- The heart over a picture has no plate: a white heart with a thin dark edge around it.

## Overgear: a grid icon for the catalog

- The Catalog tab of the bottom bar has the grid icon (four squares) instead of the dice.

## A big heading stays with its content

- The title of a page and the first block under it are one group, 16px apart (the example `Page`, the template kit `Page`); the other blocks are a section apart. The gap of a Section between its heading and its content is 16, and the head of a page is spaced by the ladder (8 / 12).
- `tools/spacing-balance.js`: the new `drift` finding: a heading (24px and up) whose content is farther than 60% of its font size (16 at least) falls off its content. It walks from the heading and its subtitle to the next block.

## Spacing by relation: rules, components, tool

- Rules: **H6** (two kinds of gap, what pulls close), **H7** (align by the content, let the container reach out) and **U12** (screens of a bottom bar, empty states); H3 now says to choose the step by how closely blocks belong together. The agent defaults have a **Spacing** entry with the numbers (inside an element 4 to 8, a heading to its content 8, related 16, groups 24, sections 40; a dense listing is 4 apart on a phone).
- `Stack` takes `relation` (`tight`, `related`, `group`, `section`: 8 / 16 / 24 / 40px) instead of a number. New `Group` (a heading with its content, tight) and `Bleed` (a row, a scroller or a listing that runs to the screen edges and keeps the page padding inside; `outset` for a card background that reaches out). Tokens `--bui-rel-*` and `--bui-page-pad`.
- `tools/spacing-balance.js` finds two more things: `pull` (a block pulled by a negative margin, only a Bleed may reach out) and `phone` (a gap over 40 between sections on a phone). The lead check does not take an icon plate for a heavy block.
- Overgear example: the tags, the games and the listings are `Bleed`; the hacks with a negative margin (`og-section--pull`, the orders line) are gone and the blocks are grouped; the gap of the page on a phone is the section gap (40, it was 48); a split and a footer on a phone are spaced by the ladder. The icon of a Status is a step farther from its title.

## Overgear: a smaller heart on the listing items

- The heart over a picture is a 24px icon on a 32px plate (it was a 48px button).

## Overgear: a heart on the items of a listing, the favorites are a listing

- Every offer in a listing (the tiles and the cards) has a heart over the corner of its picture; the heart is active for the offers in the wishlist.
- The wishlist screen is the same listing of tiles, with the active hearts: tap one to take the offer out. It opens without a login, the wishlist is kept on the device.

## Overgear: one list in the account

- My orders, Wishlist, Settings, Currency, Language, Support and Log out are one list, and Log out has a chevron too.

## Overgear: the account is a list

- After the login the account is one list like the profile of the real service: the profile, My orders, Wishlist, Settings, Currency, Language, Support and Log out. Orders, wishlist and settings are screens behind the rows; the table of orders is replaced by a list.

## Overgear: a title over the login button, the list after the login

- The account screen before the login has the title Account over the button, and the list is close under the button.
- After the login the same list (currency, language, support) sits under the greeting.

## Overgear: a plain login button, chevrons on the list

- The account screen before the login has a login button instead of the status block; the rows of the list have chevrons.

## Overgear: currency, language and support before the login

- The account screen before the login has a list under the prompt: Currency and Language (each opens a sheet with the choices, the choice is kept on the device) and Support (opens Contact us). The currency of the prices does not change yet.

## Overgear: the login prompt fills the screen, no recommendations in the empty cart

- On a phone the login prompt of the account and the empty cart are one block over the whole screen, centered.
- The empty cart no longer shows "Popular right now".

## Overgear: the tabs of the bottom bar have no header and no footer

- On a phone, Catalog, Favorites, Cart and Account are screens of their own: the header and the footer are not shown there.

## Glass: no dark smear under the floating bars

- The pieces of a floating bar on glass have only the lit edge, without the drop shadow, and the blur under the bar is no longer tinted with the page color: nothing dark shows through the glass under the icons.

## Bottom Bar: the active item on glass

- With the glass on, the active pill of the bottom bar is a tint of the text color (8%, with a very faint edge) instead of a gray that melts into the glass: it reads on any backdrop, in the light and the dark theme, and is not a bright fill.

## Icons: the standard stroke everywhere, no weight check

- The outline `Icon` has the standard stroke (2) by default, in the bottom bar and everywhere. `weight="auto"` (the stroke follows the text) is opt-in only.
- Rule D6 no longer asks for `weight="auto"` and is a review rule; the icon weight audit (`tools/check-icons.mjs`) is not part of the rules any more.

## Overgear: five tabs in the bottom bar

- The bottom bar of the example has Home, Catalog, Favorites, Cart and Account. Favorites opens the wishlist of the account and shows how many offers are in it.

## Overgear: its own theme settings, the light theme is off

- The Overgear showcase has a Theme page: shape, radius, animation, floating, glass and brand. They are kept in a cookie of their own (`baseui-overgear-theme`) and apply to the showcase and the example only; the site keeps its theme. `loadTheme`, `saveTheme` and `startTheme` take the cookie name.
- The light theme of Overgear is off for now: its pages are dark only.

## Overgear: a light blue glow behind the headline

- A soft radial gradient of blue sits behind the headline and the rating and orders lines at the start of the home page.

## Overgear: the orders line is closer to the rating

- The line with the number of orders is 8px closer to the rating line.

## Overgear: the tags scroll sideways, the cards line up by their pictures

- The tags of Popular products are one row that scrolls sideways out to the edges of the screen.
- The pictures of the cards line up with the page edge and the tags; the card background reaches 8px past them.

## Overgear: the home blocks are closer

- The game tiles are 16px closer to the orders line, and Popular products are 16px closer to the tiles.

## Overgear: the listing runs to the edges of the screen

- The dense tile is reverted. On a phone the grids of tiles and cards bleed past the page padding to the edges of the screen, and the gap between them is 4px.

## Overgear: the game rows stagger

- The two rows of the games block have different tile widths, so the edges of the tiles do not line up from row to row.

## Overgear: smaller game tiles with game pictures

- The tiles of the games block are smaller (76px high, the name in 12px) and show the picture of the game on the right, fading into the card (the covers of the real service, linked). The All games tile is gone; there are 14 games in the two rows.

## Overgear: the games block and Popular products

- The games on the home page are a block of two rows of light tiles of different widths: the name at the top and a 3D object in the corner (Microsoft Fluent Emoji, MIT, linked), only some of the games and the All games tile. The rows scroll sideways together, out to the edges of the page.
- Best deals became Popular products: the category filters (All Games, World of Warcraft, Action RPG, MMO, Shooters, Other) moved here and filter the products. There are 38 products now, from many games (Diablo 4, Path of Exile 2, Final Fantasy XIV, Valorant, Genshin Impact and others); the products of different games take turns, so the first screen is varied. A product of another game shows a 3D object on the color of its game. Show more stays endless.

## Overgear: the font Apfel Grotezk, and a Typography page

- Apfel Grotezk by Collletttivo (SIL Open Font License 1.1) is the heading font and the text font of the Overgear pages only, the showcase and the example. Three weights (Regular, Mittel, Fett) are in `overgear/fonts/`, the three the family is used in: Regular 400, Mittel 500 (Semi-Bold, 500 to 600) and Fett 700 (Bold); Satt is left out with the license, the authors and the font log; `overgear/overgear.css` sets them, with `!important` because the theme settings of the documentation site write the fonts inline. The rest of the site keeps its own fonts.
- The Overgear showcase has two pages now, Colors and Typography (tabs, `#/colors` and `#/typography`). Typography shows the font in its four weights and the scale of the system, headers and text, each style opening to a text set in it, without the colors of text. The Typography page of the main site stays as it was.

## Overgear: pictures of the offers

- The offers have the pictures of the matching offers of the real service (Venomous Abyss, Mythic+ Bundle, Power Leveling and others), linked from its server and not copied into the repository. The Best deals tiles show them 4:5; the offer card and the offer page show them too. An offer without a picture keeps the placeholder.

## Overgear: Best deals heading

- Explore all deals is gone. The Best deals heading has a 3D fire icon from the same pack as the headline of the page (Microsoft Fluent Emoji, linked) and is 4px closer to the tiles (8px).

## Overgear: Best deals never end

- The Best deals heading is closer to its tiles (12px instead of 24px). Show more in Best deals is endless: each press shows the same offers again after a short load with skeletons, and the button stays.

## Overgear: Show more with skeletons

- Games and Best deals on the home page have Show more instead of Show all: eight tiles at first, then eight more after a short load that shows skeletons of the tiles to come; the button is busy while it loads and goes away when everything is shown. The button is 16px from the tiles now (it was 8px).

## A hidden way to Overgear

- Five quick clicks (within 1.5s of each other) on the baseui logo of the main site open the Overgear showcase (`/overgear/`). It is in no menu, list or README.

## site/overgear: a showcase for Overgear

- New `overgear/`, a separate showcase that affects only Overgear. For now it has one section, Colors: the light and the dark palette side by side with real components in them, and a table of what the dark theme changes against the default one. The colors live in `overgear/overgear.css`, which only the showcase and the example load, so the rest of the site is not touched. The dark theme of Overgear leans to blue: a night-blue ground (#0b1024), blue-gray layers, a soft blue-white text.
- The example moved to `overgear/example/`. The entry points: the showcase has an Open the example button, and the footer of the example has an Overgear colors link. Neither is linked from the menu or the README: they open by the direct address.
- Fixed: on a phone the footer of the example was under the bottom bar.

## Overgear: Best deals as marketplace tiles

- Best deals on the home page is a grid of marketplace tiles, two to a row on a phone and more on a wide screen: a square picture with the badge over it, the price, the title in two lines, and a line with the rating and the time.

## Overgear: the logo of the real service

- The square in the header holds the logo of the real service, linked from its server (not copied), flattened to one color: the primary text color on the secondary background (black on light gray in the light theme, white on dark gray in the dark one). An inline SVG filter makes the gradient of the picture flat.

## Overgear: the rating first, a live count of orders

- Under the headline the rating comes first (a star and 4.9 out of 5), then the count of orders. Now and then the count grows by one to three: the number runs up to the new value in 0.7s with a small pop. With the animations off, or on a hidden tab, it stays still.

## Overgear: 3D icons in the headline

- The 3D icons stand before their words, each with its own short move: the gem shines (grows, tilts, brightens), the coin spins around its axis, the trophy jumps and lands. They play one at a time on their own every few seconds, and a click plays the icon at once. All of it follows the Animations setting and reduced motion (nothing plays, and the timer idles, when they are off). The headline of the home page is 8px lower and has a small 3D icon by each of the words items (a gem), currency (a coin) and skills (a trophy): Microsoft Fluent Emoji (MIT license), linked from a CDN, decorative (empty alt). Each word keeps its icon on one line.

## Overgear: the games of the real service

- The games of the Overgear example are the 61 games of the real home page, in its order, with their covers linked from the server of the real service (not copied into the repository). A game without a cover gets a gradient of its tone. The covers need a network connection and depend on that server.

## Links: the color of the text, underlined

- Link is in the color of the text around it (`color: inherit`) and underlined by default (`underline="always"`; `hover` and `none` stay for navigation). New rule D16 (must): a link in text has the text color and an underline; `auditConstitution()` finds a link inside a paragraph, a list or a cell without the underline or in another color (a link that is a whole list item is navigation and is skipped). 54 rules now (35 must, 19 should).
- Overgear sign-in sheet: the title is the standard title of the sheet, the three service logos are monochrome (the color of the text: black in the light theme, white in the dark one), the terms line is on the left with underlined links in the color of the text.

## Overgear: the sign-in sheet

- The sign-in dialog follows the real one: a centered title “Enter your email to get started”, an email field with a mail icon, Continue, an “Or” divider, three buttons to continue with Google, Discord or Facebook, and the terms and privacy line with links. Continue stays active: an empty or wrong email shows the error and puts focus in the field. A valid email leads to a step with a six-digit code (any code works in the demo) and a way back to another email.

## Sheet spacing, and no disabled button for empty fields

- Dialog title is one step larger in the scale (Header 24). In a bottom sheet there is more room under the last control for the home indicator of a phone: 32px plus the safe area.
- Fixed after a look on a phone: the room under the last control of a sheet is 16px plus the larger of 8px and the safe area (it was too much). A field with `status="error"` keeps a red ring while it has focus, so a form that moves focus to the first wrong field does not lose the error; the Overgear forms clear the error on the first typed character.
- New rule U11 (must): do not disable a button because fields are empty or wrong. The button stays active, a press shows the errors next to the fields and moves focus to the first one. `auditConstitution()` finds a disabled primary button in a form, dialog, card or section that holds an empty field. 53 rules now (34 must, 19 should). The Overgear login and the gold purchase follow it.

## Button: size and text size apart; a button beside an input

- Button has `textSize` besides `size`: the size sets the height and the padding (32 / 40 / 48 / 56), the text size is its own choice inside it: xsm 12, sm 14 or 12, md 16 or 14, lg 16 or 20. Another value falls back to the default of the size (xsm 12, sm 14, md 16, lg 16, so the old xsm and sm buttons are now one step smaller in text). New token `Typography-Text-12-Semi-Bold`; a Text Sizes example on the Button page.
- New rule D15 (must): a button in one row with an input has the height and the text size of the input: an input of 56px with 16px text takes size lg and textSize 16, an input of 48px with 14px text takes size md and textSize 14. `auditConstitution()` measures it in a browser. 52 rules now (33 must, 19 should).
- Overgear example: a square logo, the search says Search, the Log in button has no icon, 4px between the header elements, no line under the header.

## One example, hidden

- The messenger and Probe examples are removed, and so is the link to the messenger in Theme Settings. The Overgear example stays as a page that has no entry in the site, the README or the menus: it opens only from its direct link, `/examples/overgear/`. The templates are not affected.

## Example: Overgear

- New example `examples/overgear/`: a game-services marketplace after Overgear, built from the components and the template ladder of gaps, on mock data. Pages: home (hero, games, best deals, how it works, trust, reviews), all games and a category, search results, a game with services menu, version tabs, sort and pagination, the gold page (region, realm, faction, sellers table, amount slider, delivery, character), an offer (difficulty, how it is played, extras, quantity, reviews tabs), the cart (promo code WELCOME10), the checkout (contacts, payment method, terms), the order page and the account (orders, wishlist, settings). The cart, the wishlist, the orders and the login live in localStorage; on a phone it has a bottom bar. The audit (contrast aside) and the spacing balance are clean on every page.

## Stay inside the container, a count is a counter

- New rule D12 (must): a filled element (a highlighted row, a field, a bar) stays inside the box of its container; the audit measures it. The row highlight of a List bleeds 12px past the text on a page so that the text lines up; inside a Card, a dialog or a collapsible it now stays within the padding (`--bui-list-bleed`). Found in the file explorer template.
- New rule D13 (should): the count of a Tab, a Segmented Control item or a Token is its `counter`, never part of the label ("All 48"). The audit finds it; the Constitution page filter uses counters now.
- 50 rules now (32 must, 18 should).

## Secondary backgrounds sit on Primary or Surface

- New rule D11 (must): an element with Background-Secondary (a card, a filled field, an avatar, a progress track) sits on Background-Primary or Extensions-Background-Surface, never on Secondary, Tertiary or a colored fill. `auditConstitution()` checks it in a browser. 48 rules now (31 must, 17 should).
- Card has a `surface` variant: the Surface color, with a shadow in the light theme and none in the dark one. It is the card for content that holds Secondary elements. All templates use it; the template side navigation is a Surface too.
- Fixed where the audit found it: an avatar in an active list row, in a chip or in a selected table row, the skeleton card example, the size-balance tool panel.

## Templates

- New Templates tab in the menu (before Foundations): a gallery with category filters and a page per template, 47 templates in 10 categories (Dashboard, Table, Form, Settings, Login, Tools, Content, AI Chat, Gallery, Shell), after the set of Astryx. A template is a real page built from the components, shown in a frame so its media queries follow the frame width (desktop and mobile switch of the site), with the list of components it uses and a shadcn registry item (`template-<id>`). The menu has two tabs without headings: Templates and Theme Settings.

## No period after the last sentence

- New rule C6 (should): the last sentence of any text has no period (a caption, a hint, a description, a list item, a tooltip, a toast, a paragraph); the periods between sentences stay, and so do `?`, `!` and an ellipsis. 47 rules now (30 must, 17 should). `auditConstitution()` finds it in a rendered page (a line of text that ends with a period, outside code and marked examples). Typography page: a Final Period block; agent default added.
- Applied everywhere in the system: about 700 texts lost their final period: the descriptions and the prop docs of every component, the Usage and the rule texts, the story descriptions, the leads of the pages (the site no longer adds one), the Foundations pages, and the copy of both examples. The audit over all 67 pages and the two examples is clean for C6, and a test keeps the rules, the usage and the component docs clean.

## Primary text for the main text

- New rule H5 (must): the main text, what a person has to read, is set in `Text-and-Icon-Primary`; `Secondary` is for supporting text only (a caption, a hint, metadata, a timestamp, the helper line under a title); `Disabled` is for disabled controls. 46 rules now (30 must, 16 should). `auditConstitution()` finds it: 70 characters or more of text at 14px or larger in the Secondary color, outside captions and details.
- Typography page: a Text Color block with a do and a don't, and the agent default (when unsure, Primary).
- Fixed where main text was Secondary: the documentation prose and paragraphs, the Usage lists and the props descriptions, the rule explanations, the collapsible content, the Probe question description, the phone frame, the font sample in Theme Settings. The audit over all 67 pages of the site and both examples is clean for H5.

## Usage guidance and eight more rules

- Component pages have a **Usage** block (Do and Don't) for 50 components, from `src/usage.js`, attached by `describe()` and written to `docs/components/<name>.md`. It is the guidance an agent reads before it builds: one primary button per view, Cards for discrete things, Badges for exceptions, Select vs Radio vs SegmentedControl, Skeleton vs Spinner, Toast vs Banner and so on. Shaped by the usage guidelines of Astryx and reworded for baseui's components and props; what depends on Astryx-only parts (StyleX, `xstyle`, `disabledMessage`, Drawer, Stepper) is left out.
- Eight new constitution rules from the same source: D8 cards are for discrete things, D9 badges mark exceptions, D10 elevation shows stacking, U7 links navigate and buttons act, U8 the right control for the choice, U9 feedback in the right place, U10 tooltips are hints, M3 motion explains and never delays. 45 rules now (29 must, 16 should).

## Radius page and custom radii

- The Foundations page Shape is now **Radius** (`#/foundations/radius`); the Shape setting of the theme keeps its name. The page has Radius Scale, Custom Radius, Concentric Radius and For Agents.
- The sizes without a Tailwind name moved to a Custom group and are named `radius-custom-10 · 14 · 20 · 28` (they were `radius-10 · 14 · 20 · 28`); they follow the radius scale factor like the rest, and `tailwind.css` maps them (`rounded-custom-10`).
- Agents: by default only the named scale is used when generating. A custom radius is used in two cases: the person asks, or rule D4 (concentric corners) needs it, for the background around an entity (the entity's radius plus the padding; an inner one is the outer minus the padding) when that is not on the named scale. The text is `AGENT_DEFAULTS` in `src/constitution/rules.js`, printed in `CONSTITUTION.md`, `AGENTS.md` and on the Radius page; D4 now says it too.

## Tailwind defaults

Breaking renames, as with spacing; product CSS maps old to new:

- Radius: `radius-4 · 6 · 8 · 12 · 16 · 24 · 32` are `radius-sm · md · lg · xl · 2xl · 3xl · 4xl` (Tailwind's names and sizes). `radius-10 · 14 · 20 · 28` have no Tailwind name and keep their number; `none` and `full` stay.
- Shadow: `shadow-low · med · high` are `shadow-sm · md · lg`.
- Z-index: `z-index-100 … 500` are `z-index-10 … 50` (Tailwind's z-10 … z-50).
- Motion: `duration-fast · medium · slow` are `duration-150 · 300 · 500`; the easings are Tailwind's curves: `ease-in`, `ease-out` (was `standard`), `ease-in-out` (was `emphasized`).
- Breakpoints: `layout-breakpoint-mobile / sheet` are gone; `breakpoint-sm · md · lg · xl · 2xl` are Tailwind's 640 · 768 · 1024 · 1280 · 1536. Mobile is now below md (767px, was 859px) and the sheets of the Dialog, Selector, Typeahead and Date Picker are below xl (1279px, was 1200px).
- Type: new `text-xs · sm · base · xl · 2xl` (with `--line-height`) and `font-weight-normal · medium · semibold · bold` are Tailwind's; the 16px text now has a line height of 24px (was 22px) and the 20px text 28px (was 26px). The Header styles and the 28, 32, 40px sizes have no Tailwind step and stay.
- `tailwind.css` maps all of them, so `rounded-xl`, `shadow-md`, `ease-out`, `text-sm`, `font-semibold`, `duration-150` follow the tokens; `tests/tailwind-conformance.test.js` checks the tokens against Tailwind's own defaults.

## Negative spacing and the rest of the spacing

- `--baseui-spacing-negative` (`-1`): multiply any spacing token by it for a negative value, `calc(var(--baseui-spacing-4) * var(--baseui-spacing-negative))` is -16px. `spacing-0` is now `0px` so that this also works for it. New `--baseui-spacing-1-5` (6px).
- The paddings, margins and gaps in `components.css` and `site.css` that were written in pixels use the tokens (71 values; negative ones through `spacing-negative`). Left in pixels on purpose: the Badge paddings of 9, 7, 5 and 3px and the floating-label offset of the Text Input, which are fitted to the heights and the 1px strokes of those components.
- The spacing balance tool reports gaps next to pixels (`16px (4 gaps)`).

## Spacing in gaps

- The spacing unit is **1 gap = 4px** and a token is named by its number of gaps: `--baseui-spacing-1` is 4px, `-2` 8px, `-3` 12px, `-4` 16px, `-5` 20px, `-6` 24px, `-8` 32px, `-10` 40px, `-12` 48px, `-16` 64px, `-20` 80px (it was named by pixels, so `spacing-16` is now `spacing-4`). New: `--baseui-spacing-0-5`, half a gap, 2px (a dot is not allowed in a custom property name, so 0.5 is written `0-5`). This is also the Tailwind scale: `p-4` is `spacing-4`, `p-0.5` is `spacing-0-5`.
- `gap` of Stack, HStack, VStack and Grid, `padding` of Section and of the Cards, count in gaps too (`gap={4}` is 16px); the defaults are the same as before.
- Migration for product CSS: pixels / 4 (`var(--baseui-spacing-12)` becomes `var(--baseui-spacing-3)`).

## Constitution

- A design constitution: 37 rules (26 must, 11 should) in six groups, each with Do and Don't, why, source and how it is checked. Source `src/constitution/rules.js`; page Foundations / Constitution; `CONSTITUTION.md` and `AGENTS.md` generated by `npm run constitution`.
- Protocol for agents: a request that breaks a rule is built as asked, the answer begins with a warning that quotes the rules, and the prototype gets a `ConstitutionBanner` across the top.
- `ConstitutionBanner` (Components): a sticky full-width strip with the broken rules by id, details with Do and Don't, a link to the constitution, no close button; `audit` adds what the page breaks.
- `auditConstitution()` (`src/constitution/audit.js`): contrast, tiny text, touch targets, labels, alt text, heading order, several primary buttons, sideways scroll.
- Registry: `baseui-constitution` (the markdown); `constitution-banner` depends on it.

## Mobile navigation

- No pressed highlight in the Navbar buttons and the Bottom Bar icons (there was a tint on tap); the active destination keeps its pill.

## Progress Bar

- `color`: the fill takes a color of the design system (`brand` by default, `accent`, `success`, `warning`, `error` and the accent colors `blue`, `blue-light`, `green`, `green-light`, `orange`, `pink`, `red`); it is a `data-color` attribute that sets `--bui-progress-color`.
- `sections` (1 to 8): the bar is split into equal sections with a gap and the value fills them one after another. Indeterminate bars are not split. Examples: Colors and Sections.

## Slider range

- `Slider` takes `range`: two thumbs, `value` / `defaultValue` as `[low, high]`, `minStepsBetweenValues`, `showValue` ("20 – 70"), `thumbLabels`. The range version is built on the Base UI Slider; the single one stays a native input. There is no separate Range Slider component or page.

## Switch

- The Switch is the classic one by default: a pill track and a round thumb (tracks 32×20, 40×24, 48×28, thumb 4px from the edge). `shape="rounded"` keeps the previous look, a rounded-rectangle track with an oval thumb.

## Standard tooling: shadcn registry, Tailwind

- The registry is the shadcn format (`registry.json`, `r/<name>.json` with the file contents): `npx shadcn@latest add https://baseuikit.vercel.app/r/<name>.json` installs a component with the shared code (`baseui-core`), the styles (`baseui-styles`) and the icons (`baseui-icons`) it needs. The own `baseui` CLI is removed.
- `tailwind.css`: a Tailwind v4 theme generated from `tokens.css` (`npm run tailwind`): colors (`bg-bg-accent`, `text-fg-primary`, `border-border-primary`, accent colors), `rounded-<n>`, `shadow-low|med|high`, `ease-*`, `mobile:`/`sheet:` breakpoints, `type-*` text styles, `duration-*`, `focus-ring`. All values are `var()` of the tokens, so themes, shape and radius settings keep working.

## JSX, tests, type check

- Sources are JSX: every `h()` call became JSX (a codemod; the render snapshot of all 67 pages stayed identical). `npm run build:js` (esbuild) writes the `.js` next to each `.jsx`; the generated files are not committed (listed in `.gitignore`). Vercel runs the build (`vercel.json`). A few dynamic tags stay `h(Component, props)`.
- Tests (`npm test`): vitest + Testing Library on jsdom: a markup snapshot of every story and behaviour tests (Switch, Checkbox, Button, Tabs, Modal, Select, Text Input, OTP, Pagination, Rating). Rating's star row is now a `group` of toggle buttons, not a `radiogroup` without radios.
- `npm run typecheck`: `tsc` with `checkJs` over `src`, `site` and `examples`.

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
