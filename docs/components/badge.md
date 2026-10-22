# Badge

A compact label for a status, category or count.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'info' \| 'success' \| 'warning' \| 'error' \| 'blue' \| 'blue-light' \| 'green' \| 'green-light' \| 'orange' \| 'pink' \| 'red'` | `'secondary'` | primary is the inverse of the page, secondary a soft gray; the rest are semantic and accent colors, all solid |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge height: 18, 22 or 28px; the dot is 6, 8 or 10px |
| `type` | `'label' \| 'counter' \| 'dot'` | `'label'` | label is a text pill; counter is a round number; dot is a small mark with no text |
| `max` | `number` | `99` | Counter only: numbers above it show as `99+` |
| `disabled` | `boolean` | `false` | Muted look that replaces the variant color |
| `label` | `ReactNode` | — | Badge text or number; with the dot it is the accessible name |
| `icon` | `ReactNode` | — | Icon before the label |

## Examples

- Disabled
- Sizes
- Types
- Variants
- With Icon

Live page: http://localhost:8765/#/components/badge
