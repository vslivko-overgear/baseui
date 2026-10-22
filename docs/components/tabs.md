# Tabs

Switches between related views.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | — | Selected tab |
| `defaultValue` | `string` | — | Initially selected tab |
| `onValueChange` | `(value: string) => void` | — | Called when the selected tab changes |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Tab size: the label goes from 16 to 28px (Figma Small to Extra Large) |
| `fullWidth` | `boolean` | `false` | The divider fills the container width; the tabs stay hugging their content |
| `showIcon` | `boolean` | `true` | Show the tab icons |
| `showCounter` | `boolean` | `true` | Show the tab counters |
| `showBadge` | `boolean` | `true` | Show the tab badges |
| `motion` | `'off' \| 'basic' \| 'enhanced'` | `theme` | Animations of this row: off, basic, or enhanced (the underline slides to the selected tab and nudges toward the hovered one); by default the Animations setting of the theme |
| `label` | `string` | — | Accessible name |

## Examples

- Full Width
- Single Tab
- Sizes
- Slide

Live page: http://localhost:8765/#/components/tabs
