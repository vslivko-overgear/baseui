# Checkbox

A checkbox on top of the headless Base UI Checkbox.
A box plus an optional label; checked/disabled/indeterminate states
come from Base UI data attributes. Styles use semantic `--baseui-*` tokens
(checked colors invert by theme).

If `label` is not set, pass an accessible name through `aria-label`
or `aria-labelledby`, otherwise the checkbox stays unnamed for screen readers.

The component renders the error itself (the `error` text, no outline), so it works without
react-hook-form; in forms `CheckboxField` sets `error` automatically.

A box that turns one option on or off.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Text label to the right of the checkbox. |
| `error` | `ReactNode` | — | Error text under the checkbox. The box has no outline (the design has none): only the text and `aria-invalid` for screen readers. Works without react-hook-form too. |
| `className` | `string` | — | Extra class on the wrapper (merged). |
| `ref` | `Ref<HTMLElement>` | — | Ref to the checkbox element (Base UI renders `<span role="checkbox">`). |

## Examples

- States
- With Error
- With Label

Live page: http://localhost:8765/#/components/checkbox
