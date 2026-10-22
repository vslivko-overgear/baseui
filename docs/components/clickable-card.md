# Clickable Card

A card that acts as one link or button.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Accessible name |
| `onClick` | `(event) => void` | — | Click handler |
| `href` | `string` | — | Renders a link |
| `isDisabled` | `boolean` | `false` | Disables the card |
| `variant` | `'default' \| 'transparent' \| 'muted' \| 'blue' \| 'green' \| 'orange' \| 'pink' \| 'red'` | `'default'` | Background |
| `padding` | `number` | `16` | Inner padding in px (spacing token) |
| `elevation` | `'none' \| 'low' \| 'med' \| 'high'` | `'none'` | Shadow depth |
| `width` | `number \| string` | — | Number is px |
| `height` | `number \| string` | — | Number is px |
| `maxWidth` | `number \| string` | — | Number is px |
| `children` | `ReactNode` | — | Card content |

## Examples

- Nested Action

Live page: http://localhost:8765/#/components/clickable-card
