# Radio

A group of radio buttons: the value is the `value` of the selected option. The error is a message under the group; the circles do not turn red

Radio buttons for choosing one option from a list

## Usage

**Do**

- Keep it to 2–7 options
- Pre-select a sensible default
- Use clear labels that differ at a glance

**Don't**

- Use it when several can be chosen: use CheckboxGroup
- Use it for a long list: use Selector
- Lay out more than 4 options in a row

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Group title |
| `options` | `Array<{ value: string; label: ReactNode; disabled?: boolean }>` | — | The radio buttons of the group |
| `value` | `string \| null` | — | Selected value (controlled); null means nothing is selected |
| `defaultValue` | `string` | — | Initial value (uncontrolled) |
| `onValueChange` | `(value: string) => void` | — | Called with the value of the selected option |
| `caption` | `ReactNode` | — | Caption under the group |
| `error` | `ReactNode` | — | Error text under the group (replaces the caption). The circles do not turn red: only the message |
| `size` | `'sm' \| 'md'` | `'md'` | sm is a 20px control with a 14px label; md is 24px with a 16px label |
| `motion` | `'off' \| 'basic' \| 'enhanced'` | `theme` | Animations: off, basic (the state changes at once), or enhanced (the check mark is drawn, the box and the dot pop); by default the Animations setting of the theme |
| `disabled` | `boolean` | `false` | Disables every radio of the group |
| `className` | `string` | — | Extra class on the wrapper (merged) |
| `ref` | `Ref<HTMLDivElement>` | — | Ref to the group (`<div role="radiogroup">`) |

## Examples

- Locked
- States
- With Caption
- With Error

Live page: https://baseuikit.vercel.app/#/components/radio
