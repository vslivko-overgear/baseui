# Slider

Selects a number in a range, or with `range` two numbers: a lower and an upper bound

## Usage

**Do**

- Give it a label
- Show the value with its unit ("$50", "75%")
- Use `range` to choose from and to

**Don't**

- Use it to enter an exact number: use NumberInput
- Give it so large a step that only a few positions exist: use SegmentedControl

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `range` | `boolean` | `false` | Two thumbs: `value` and `defaultValue` are `[low, high]` and `onValueChange` gets the pair. Built on the Base UI Slider |
| `value` | `number \| [number, number]` | — | Value; a pair with `range` |
| `defaultValue` | `number \| [number, number]` | `0` | Initial value; with `range` a pair, [25, 75] by default |
| `onValueChange` | `(value: number \| [number, number]) => void` | — | Called when the value changes |
| `min` | `number` | `0` | Minimum |
| `max` | `number` | `100` | Maximum |
| `step` | `number` | `1` | Step |
| `minStepsBetweenValues` | `number` | `0` | Range only: the least number of steps between the two thumbs |
| `label` | `ReactNode` | — | Label above the track |
| `showValue` | `boolean` | `false` | Show the current value; a range shows "lower – upper" |
| `thumbLabels` | `[string, string]` | `['Minimum', 'Maximum']` | Range only: accessible names of the two thumbs |
| `disabled` | `boolean` | `false` | Disabled state |

## Examples

- Minimum Gap
- Range
- Range Disabled

Live page: https://baseuikit.vercel.app/#/components/slider
