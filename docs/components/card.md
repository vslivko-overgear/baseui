# Card

A container that groups related content

## Usage

**Do**

- Ask "could I reorder or remove this on its own?": if yes it is a card (one profile, one notification, one metric, one product)
- Try removing the card first: spacing and type often group things well enough
- Keep padding the same across sibling cards so they line up in a grid
- Truncate long ids and urls inside a card instead of letting them stretch it

**Don't**

- Use cards as the default way to group things, or wrap page sections ("General settings", a form group) in them: use Section or a heading with a Stack
- Nest a card in a card
- Repeat identical cards of icon, heading and text: vary the layout, or ask whether cards are needed
- Use a card color variant to show status: use Banner or Badge

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'surface' \| 'transparent' \| 'muted' \| 'blue' \| 'green' \| 'orange' \| 'pink' \| 'red'` | `'default'` | Background; surface is the Surface color of the theme (a shadow in the light theme, none in the dark one) for a card that holds Secondary elements: fields, avatars, a progress track |
| `padding` | `number \| 'list'` | `4` | Inner padding in gaps (1 gap = 4px), a step of the spacing scale: 4 is 16px. `list` is for a card that holds a List: 16px above and below and 4px at the sides, because the rows reach 12px out of their box, so the icons stand 16px from the edge and the rows are 4px from it |
| `elevation` | `'none' \| 'low' \| 'med' \| 'high'` | `'none'` | Shadow depth |
| `width` | `number \| string` | — | Number is px |
| `height` | `number \| string` | — | Number is px |
| `maxWidth` | `number \| string` | — | Number is px |
| `minHeight` | `number \| string` | — | Number is px |
| `radius` | `'fit' \| number \| string` | `'fit'` | The corner: `fit` follows the size of the card (the smaller side: a big card is rounder than a small one, an even number from 12 to 32px), a number is px, a string is any CSS length. What stands inside takes `var(--bui-card-radius)` minus the padding |
| `children` | `ReactNode` | — | Card content |

## Examples

- Elevation
- Variants

Live page: https://baseuikit.vercel.app/#/components/card
