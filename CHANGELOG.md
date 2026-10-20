# Changelog

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
