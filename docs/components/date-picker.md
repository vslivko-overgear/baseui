# Date Picker

A date field. It opens the calendar in a popover, and in a Dialog sheet on small screens. The field is a Text Input, so its size, variant, label and status come from Text Input.

A date field that opens the calendar in a popover, or in a Dialog sheet on small screens.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `ISODateString \| { start, end } \| null` | — | Selected date or range (controlled) |
| `defaultValue` | `ISODateString \| { start, end } \| null` | — | Initial selection (uncontrolled) |
| `onValueChange` | `(value) => void` | — | Called when a date (or a complete range) is chosen |
| `mode` | `'single' \| 'range'` | `'single'` | One date or a range of two |
| `presentation` | `'auto' \| 'popover' \| 'dialog'` | `'auto'` | Where the calendar opens: auto uses the dialog up to 1200px |
| `confirmLabel` | `string` | `'Apply'` | Dialog apply button text |
| `cancelLabel` | `string` | `'Cancel'` | Dialog cancel button text |
| `min` | `ISODateString` | — | Earliest selectable date |
| `max` | `ISODateString` | — | Latest selectable date |
| `dateConstraints` | `Array<(date: Date) => boolean>` | — | Custom rules: a date is selectable when every function returns true |
| `weekStartsOn` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 'mon' \| …` | `0` | First day of the week |
| `locale` | `string` | — | BCP 47 locale for names and the formatted value |
| `variant` | `'filled' \| 'standard'` | `'filled'` | Visual variant: `filled` has a background (the main one), `standard` has none (specific scenarios, for example chat). @default 'filled' |
| `size` | `'md' \| 'sm'` | `'md'` | Size: md is 56px with 16px text, sm is 48px with 14px text. @default 'md' |
| `floatingLabel` | `boolean` | `true` | Label behavior on focus/value: true floats it up in small text, false works like a placeholder and hides when a value is entered. @default true |
| `caption` | `ReactNode` | — | The only text under the field: a gray hint, and with `status` a colored message. Swapping “hint → error” is up to the caller (the RHF wrapper does it itself). |
| `status` | `FieldStatus` | — | Validation status: `error` is a red outline/caption + `aria-invalid`; `warning` is amber; `success` is green (no `aria-invalid`). |
| `disabled` | `` | `false` |  |
| `loading` | `boolean` | `false` | Loading state: a skeleton instead of the content, input is blocked. |

## Examples

- In Dialog
- Range Value

Live page: http://localhost:8765/#/components/date-picker
