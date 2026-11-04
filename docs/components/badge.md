# Badge

A compact label for a status, category or count

## Usage

**Do**

- Badge only what a person needs to notice or act on: errors, warnings, items that wait for them
- Use success, warning and error variants only for system status; use the color variants to categorize (team, type, priority)
- Keep the label to one or two words
- Put a text label next to any icon

**Don't**

- Put a success badge on every healthy item: when every row says "Active", none stands out
- Use a badge for metadata (a duration, a date, a description): use supporting text. A counter on a tab or an icon is what the counter type is for
- Repeat the same badge in every row of a table
- Make a badge clickable: it is a read-only indicator

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'info' \| 'success' \| 'warning' \| 'warning-light' \| 'error' \| 'blue' \| 'blue-light' \| 'green' \| 'green-light' \| 'orange' \| 'pink' \| 'red'` | `'secondary'` | primary is the inverse of the page, secondary a soft gray; the rest are semantic and accent colors, solid (with `light`, a tint) |
| `light` | `boolean` | `false` | The light version of the color of the variant: a tint of it with the main text color, for places where a bright tag shouts (a list, a table, many tags in a row). Every color has it; primary and secondary are not colors and ignore it |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge height: 18, 22 or 28px; the dot is 6, 8 or 10px |
| `type` | `'label' \| 'counter' \| 'dot'` | `'label'` | label is a text pill; counter is a round number; dot is a small mark with no text |
| `max` | `number` | `99` | Counter only: numbers above it show as `99+` |
| `disabled` | `boolean` | `false` | Muted look that replaces the variant color |
| `label` | `ReactNode` | — | Badge text or number; with the dot it is the accessible name |
| `icon` | `ReactNode` | — | Icon before the label |

## Examples

- Disabled
- Light
- Sizes
- Types
- Variants
- With Icon

Live page: https://baseuikit.vercel.app/#/components/badge
