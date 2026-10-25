# Selectable Card

A card that can be selected, like a checkbox.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Accessible name |
| `checked` | `boolean` | — | Selected (controlled) |
| `defaultChecked` | `boolean` | `false` | Initially selected (uncontrolled) |
| `onCheckedChange` | `(checked: boolean) => void` | — | Called with the next state |
| `disabled` | `boolean` | `false` | Disables the card |
| `variant` | `'default' \| 'transparent' \| 'muted' \| 'blue' \| 'green' \| 'orange' \| 'pink' \| 'red'` | `'default'` | Background |
| `padding` | `number` | `16` | Inner padding in px (spacing token) |
| `elevation` | `'none' \| 'low' \| 'med' \| 'high'` | `'none'` | Shadow depth |
| `width` | `number \| string` | — | Number is px |
| `height` | `number \| string` | — | Number is px |
| `maxWidth` | `number \| string` | — | Number is px |
| `children` | `ReactNode` | — | Card content |

## Examples

- Group

Live page: http://localhost:8765/#/components/selectable-card
