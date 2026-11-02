# Clickable Card

A card that acts as one link or button

## Usage

**Do**

- Give the card one action (`href` or `onClick`) and a `label` that names it
- Make the whole card the target

**Don't**

- Put buttons or links inside a clickable card: two competing click targets

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Accessible name |
| `onClick` | `(event) => void` | — | Click handler |
| `href` | `string` | — | Renders a link |
| `disabled` | `boolean` | `false` | Disables the card |
| `variant` | `'default' \| 'surface' \| 'transparent' \| 'muted' \| 'blue' \| 'green' \| 'orange' \| 'pink' \| 'red'` | `'default'` | Background; surface is the Surface color of the theme (a shadow in the light theme, none in the dark one) for a card that holds Secondary elements: fields, avatars, a progress track |
| `padding` | `number` | `4` | Inner padding in gaps (1 gap = 4px), a step of the spacing scale: 4 is 16px |
| `elevation` | `'none' \| 'low' \| 'med' \| 'high'` | `'none'` | Shadow depth |
| `width` | `number \| string` | — | Number is px |
| `height` | `number \| string` | — | Number is px |
| `maxWidth` | `number \| string` | — | Number is px |
| `children` | `ReactNode` | — | Card content |

## Examples

- Nested Action

Live page: https://baseuikit.vercel.app/#/components/clickable-card
