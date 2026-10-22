# OTP Input

A one-time code field on the Base UI OTP Field primitives.
Base UI manages focus movement, paste, character filtering,
autofill and native form integration.

A field for entering a one-time code.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | — | Extra class of the outer field wrapper. |
| `style` | `CSSProperties` | — | Inline styles of the outer field wrapper. |
| `length` | `number` | `6` | Number of OTP cells. @default 6 |
| `error` | `ReactNode` | — | Error text. Marks all cells invalid. |
| `inputRef` | `Ref<HTMLInputElement>` | — | Ref to the first focusable input cell. |

## Examples

- Alphanumeric
- Disabled
- Empty
- Filled
- Masked
- With Error

Live page: http://localhost:8765/#/components/otp-input
