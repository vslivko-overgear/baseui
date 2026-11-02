# Checkbox

A box that turns one option on or off, with an optional label. The error is text under the box: it has no outline

A box that turns one option on or off

## Usage

**Do**

- Use it for an independent yes or no, or an option in a form
- Write the label as the statement that is true when checked

**Don't**

- Use one when only one choice is possible: use Radio

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Text label to the right of the checkbox. Without it pass `aria-label` or `aria-labelledby` |
| `error` | `ReactNode` | — | Error text under the checkbox; marks it invalid for screen readers. There is no outline: only the text |
| `size` | `'sm' \| 'md'` | `'md'` | sm is a 20px control with a 14px label; md is 24px with a 16px label |
| `motion` | `'off' \| 'basic' \| 'enhanced'` | `theme` | Animations: off, basic (the state changes at once), or enhanced (the check mark is drawn, the box and the dot pop); by default the Animations setting of the theme |
| `checked` | `boolean` | — | Checked state (controlled) |
| `defaultChecked` | `boolean` | `false` | Initial state (uncontrolled) |
| `onCheckedChange` | `(checked: boolean, event) => void` | — | Called when the state changes |
| `indeterminate` | `boolean` | `false` | A mixed state, drawn as a dash |
| `disabled` | `boolean` | `false` | Disabled state |
| `readOnly` | `boolean` | `false` | The state cannot be changed |
| `required` | `boolean` | `false` | Required in a form |
| `name` | `string` | — | Name in a native form |
| `value` | `string` | — | Value submitted when the box is checked |
| `className` | `string` | — | Extra class on the wrapper (merged) |
| `ref` | `Ref<HTMLElement>` | — | Ref to the box (a `span role="checkbox"`) |

## Examples

- States
- With Error
- With Label

Live page: https://baseuikit.vercel.app/#/components/checkbox
