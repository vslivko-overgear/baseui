# Selectable Card

A card that can be selected, like a checkbox

## Usage

**Do**

- Use it to choose from a few rich options, like plans, with a clear selected state
- Name the group for what is being chosen

**Don't**

- Use it for a long list of choices: use a list with Checkbox or Radio
- Put interactive elements inside it

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Accessible name |
| `checked` | `boolean` | — | Selected (controlled) |
| `defaultChecked` | `boolean` | `false` | Initially selected (uncontrolled) |
| `onCheckedChange` | `(checked: boolean) => void` | — | Called with the next state |
| `disabled` | `boolean` | `false` | Disables the card |
| `variant` | `'default' \| 'surface' \| 'transparent' \| 'muted' \| 'blue' \| 'green' \| 'orange' \| 'pink' \| 'red'` | `'default'` | Background; surface is the Surface color of the theme (a shadow in the light theme, none in the dark one) for a card that holds Secondary elements: fields, avatars, a progress track |
| `padding` | `number \| 'list'` | `4` | Inner padding in gaps (1 gap = 4px), a step of the spacing scale: 4 is 16px. `list` is for a card that holds a List: 16px above and below and 4px at the sides, because the rows reach 12px out of their box, so the icons stand 16px from the edge and the rows are 4px from it |
| `elevation` | `'none' \| 'low' \| 'med' \| 'high'` | `'none'` | Shadow depth |
| `width` | `number \| string` | — | Number is px |
| `height` | `number \| string` | — | Number is px |
| `maxWidth` | `number \| string` | — | Number is px |
| `minHeight` | `number \| string` | — | Number is px |
| `radius` | `'fit' \| number \| string` | `'fit'` | The corner: `fit` follows the size of the card (the smaller side: a big card is rounder than a small one, 12 to 32px), a number is px, a string is any CSS length. What stands inside takes `var(--bui-card-radius)` minus the padding |
| `children` | `ReactNode` | — | Card content |

## Examples

- Group

Live page: https://baseuikit.vercel.app/#/components/selectable-card
