# Checkbox Group

A group of checkboxes: the value is an array of the checked `value`s. The error is a message under the group; the boxes do not turn red

A list of checkboxes with a title, a caption, an error and nested subgroups with a parent checkbox

## Usage

**Do**

- Keep it to 3–7 options; beyond that use Selector with `multiple`
- Give the group a label that says what the choices are: "Export formats", not "Options"

**Don't**

- Use it when only one thing can be chosen: use RadioGroup

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Group title |
| `options` | `Array<{ value: string; label: ReactNode; disabled?: boolean }>` | — | The checkboxes of the group |
| `value` | `string[]` | — | Checked values (controlled) |
| `defaultValue` | `string[]` | `[]` | Initially checked values (uncontrolled) |
| `onValueChange` | `(value: string[]) => void` | — | Called with the new array of checked values |
| `onOptionChange` | `(option, checked: boolean) => void` | — | Called for the changed option together with `onValueChange`, with its new state; not for a click on `parent` |
| `parent` | `ReactNode` | — | Label of a parent “select all” checkbox. It toggles all options, shows the mixed state on a partial selection and indents the options. It is not part of the value |
| `caption` | `ReactNode` | — | Caption under the group |
| `error` | `ReactNode` | — | Error text under the group (replaces the caption). The boxes do not turn red: only the message |
| `size` | `'sm' \| 'md'` | `'md'` | sm is a 20px control with a 14px label; md is 24px with a 16px label |
| `motion` | `'off' \| 'basic' \| 'enhanced'` | `theme` | Animations: off, basic (the state changes at once), or enhanced (the check mark is drawn, the box and the dot pop); by default the Animations setting of the theme |
| `disabled` | `boolean` | `false` | Disables every checkbox of the group |
| `className` | `string` | — | Extra class on the wrapper (merged) |
| `id` | `string` | — | id of the outer container, for example to scroll to the error of the whole group |
| `ref` | `Ref<HTMLDivElement>` | — | Ref to the group (`<div role="group">`) |

## Examples

- Subgroup
- With Caption
- With Error

Live page: https://baseuikit.vercel.app/#/components/checkbox-group
