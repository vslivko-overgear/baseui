# Number Input

A text input for numbers: a minus button first, the number in the middle, a plus button last. It takes the props of the Text Input (variant, status, caption, prefix, suffix, floatingLabel)

## Usage

**Do**

- Set `min`, `max` and `step` to guide toward valid values
- Show the unit

**Don't**

- Use it for free text that has numbers in it: use TextInput

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number \| string` | — | Value |
| `defaultValue` | `number` | — | Initial value |
| `onValueChange` | `(value: number \| string) => void` | — | Called when the value changes |
| `min` | `number` | — | Minimum |
| `max` | `number` | — | Maximum |
| `step` | `number` | `1` | Step |
| `label` | `string` | — | Text above the field, outside of it, semi-bold (the field hugs its content). Without it pass `aria-label` |
| `size` | `'sm' \| 'md'` | — | Input size (same as Text Input): the buttons are 36px in md and 32px in sm |
| `disabled` | `boolean` | `false` | Disabled state of the field and of its buttons |
| `loading` | `boolean` | `false` | Loading state of the field (the buttons are off) |
| `readOnly` | `boolean` | `false` | The value can be read and copied but not changed: the buttons and the arrow keys are off |

Live page: https://baseuikit.vercel.app/#/components/number-input
