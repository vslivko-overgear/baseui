# Segmented Control

A control for switching between a few exclusive options

## Usage

**Do**

- Use it to switch between 2–5 views or modes where all options should stay visible
- Give it a label

**Don't**

- Use it for navigation between pages: use Tabs
- Use it for a single on and off: use Switch

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `Array<{ value: string; label: string; icon?: ReactNode; counter?: number \| string; badge?: ReactNode \| string; disabled?: boolean }>` | — | Segments |
| `value` | `string` | — | Selected value |
| `defaultValue` | `string` | — | Initial value (first enabled) |
| `onValueChange` | `(value: string) => void` | — | Called when the selection changes |
| `size` | `'sm' \| 'md'` | `'md'` | Control height |
| `fullWidth` | `boolean` | `false` | Fill the container width; segments are equal |
| `showIcon` | `boolean` | `true` | Show the item icons |
| `showLabel` | `boolean` | `true` | Show the item labels; with it off the control is icons only and the label becomes the accessible name |
| `showCounter` | `boolean` | `true` | Show the item counters |
| `showBadge` | `boolean` | `true` | Show the item badges |
| `motion` | `'off' \| 'basic' \| 'enhanced'` | `theme` | Animations of this control: off, basic, or enhanced (the highlight slides); by default the Animations setting of the theme |
| `shape` | `'rounded' \| 'circle'` | `'rounded'` | circle makes the control and its items pills; rounded follows the theme radius |
| `label` | `string` | — | Accessible name |

## Examples

- Counter And Badge
- Full Width
- Icons Only
- Item

Live page: https://baseuikit.vercel.app/#/components/segmented-control
