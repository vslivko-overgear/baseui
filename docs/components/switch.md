# Switch

A switch on top of the headless Base UI Switch: an instant on/off of an
independent setting. A track + a thumb + an optional label; checked/disabled
states come from Base UI data attributes. Styles use semantic
`--baseui-*` tokens (inverted by theme).

There is no switch group on purpose: several switches are independent
boolean fields, not one array field (for choosing N of M use CheckboxGroup).

If `label` is not set, pass an accessible name through `aria-label`
or `aria-labelledby`, otherwise the switch stays unnamed for screen readers.

The component renders the error itself (the `error` text), so it works without
react-hook-form; in forms `SwitchField` sets `error` automatically.

A control that turns a setting on or off immediately.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Text label to the right of the switch. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size. @default 'md' |
| `error` | `ReactNode` | — | Error text under the switch. There is no outline (the design has none): only the text and `aria-invalid` for screen readers. Works without react-hook-form too. |
| `className` | `string` | — | Extra class on the wrapper (merged). |
| `ref` | `Ref<HTMLElement>` | — | Ref to the switch element (Base UI renders `<span role="switch">`). |

## Examples

- States
- With Error
- With Label

Live page: http://localhost:8765/#/components/switch
