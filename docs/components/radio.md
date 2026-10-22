# Radio

A group of radio buttons on top of Base UI RadioGroup: the value is the `value` of the selected option.
The error is a message under the group (the circles do not turn red, like the Group node in Figma).
In forms the props are set by `RadioGroupField` from `@baseui/ui/rhf/RadioGroup`.

Radio buttons for choosing one option from a list.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Group title. |
| `options` | `RadioGroupOption[]` | — | Group options. |
| `caption` | `ReactNode` | — | Caption under the group (Caption). |
| `error` | `ReactNode` | — | Error text under the group (overrides `caption`). The circles do NOT turn red: only the message. |
| `value` | `string \| null` | — | Selected value (controlled mode). `null` means nothing is selected. |
| `defaultValue` | `string` | — | Initial value (uncontrolled mode). |
| `onValueChange` | `(value: string) => void` | — | Called with the value of the selected option. |
| `className` | `string` | — | Extra class on the wrapper (merged). |
| `ref` | `Ref<HTMLDivElement>` | — | Ref to the group root element (`<div role="radiogroup">`). |

## Examples

- Disabled Checked
- States
- With Caption
- With Error

Live page: http://localhost:8765/#/components/radio
