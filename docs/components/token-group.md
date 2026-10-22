# Token Group

A group of chips: a title, a wrapping container and a caption/error.
With `options`, a managed set on Base UI ToggleGroup (the value is an array
of selected `value`s, `multiple` allows several). With `children`, a free
layout of arbitrary `<Chip>`s. The error is shown as a message under the group
(like the Group node in Figma). Styles use `--baseui-*` tokens.

A group of tokens with single or multiple selection.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Group title. |
| `options` | `ChipGroupOption[]` | — | Group options. When set, the component renders the chips itself inside Base UI ToggleGroup (keyboard arrows, shared value). Otherwise use `children`. |
| `children` | `ReactNode` | — | Arbitrary content instead of `options`: a set of `<Chip>`s under manual control. |
| `size` | `ChipSize` | `'md'` | Size of the chips and the title. @default 'md' |
| `value` | `string[]` | — | Selected values (controlled mode). |
| `defaultValue` | `string[]` | — | Initial values (uncontrolled mode). |
| `onValueChange` | `(value: string[]) => void` | — | Called with the new array of selected values. |
| `caption` | `ReactNode` | — | Caption under the group (Caption). |
| `error` | `ReactNode` | — | Error text under the group (overrides `caption`). The chips do NOT turn red: only the message. |
| `className` | `string` | — | Extra class on the wrapper (merged). |
| `ref` | `Ref<HTMLDivElement>` | — | Ref to the chip group element. |

## Examples

- Caption And Error
- Single Select
- Small
- With Avatars
- With Children
- With Icons

Live page: http://localhost:8765/#/components/token-group
