# List Item

A list row: an icon or an avatar, a title with a caption, details and a control. A row with `onClick` or `items` is a button; otherwise it is plain text.

A row with an icon or avatar, text, details and a control: the Avatar, Switch, Checkbox and Badge of the design system.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md'` | — | Row height: `sm` (40px) or `md` (48px); by default the `size` of the `List` |
| `children` | `ReactNode` | — | Main text of the row |
| `subtitle` | `ReactNode` | — | Small muted text under the title (one size smaller than the title); use it or `overline` |
| `overline` | `ReactNode` | — | The same small muted text above the title; use it instead of `subtitle` |
| `details` | `ReactNode` | — | Text or a `Badge` on the right of the title |
| `icon` | `ReactNode` | — | Leading icon, 24px (20px in `sm` rows); it follows `currentColor` and dims with the row |
| `avatar` | `ReactNode` | — | Leading `Avatar`: size `sm` in `sm` rows and `md` in `md` rows; it dims with its own `disabled` |
| `control` | `ReactNode` | — | Slot on the right: a `Switch` (size md) or a `Checkbox`, or your own control. It sits outside the row button, so it is never a button inside a button |
| `items` | `ReactNode` | — | Nested `ListItem` rows: they make the row expandable (a button with a chevron) |
| `expanded` | `boolean` | — | Whether the row is expanded (controlled) |
| `defaultExpanded` | `boolean` | `false` | Whether the row is initially expanded |
| `onExpandedChange` | `(expanded: boolean) => void` | — | Called with the new expansion state |
| `subitem` | `boolean` | `false` | A second-level row: shifted to the right by the indent width |
| `active` | `boolean` | `false` | The current item: a filled background and `aria-current` on an interactive row |
| `disabled` | `boolean` | `false` | An inactive row: muted texts, no clicks, the control is inert |
| `onClick` | `(event) => void` | — | Click handler: makes the row a button; with `items` it is called before expanding |

## Examples

- Captions
- Expandable
- Leading
- States
- Trailing

Live page: http://localhost:8765/#/components/list-item
