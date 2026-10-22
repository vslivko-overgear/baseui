# Selector

Select: Base UI Select on the shared field shell `FieldShell`. Supports
single and multiple selection. The shell (Field.Root) sits outside Select.Root so that
Select.setFilled finds the Field context (otherwise data-filled is not set). The trigger
fills the cell; the popup is anchored to the cell (full field width). For searching
options use a separate `Autocomplete`.

The field (label, size, variant, status, caption, prefix/suffix, loading) is Text Input's own shell, so those settings and their docs come from Text Input. The list is the shared Dropdown.

A field, or any element, that opens a list of options.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `ReactNode` | — | Any element that opens the list: a button, an icon button or text. Without it the field itself is the trigger. A string becomes a plain button; an element gets the trigger props and a ref. |
| `ref` | `Ref<HTMLButtonElement>` | — | Ref to the trigger button (`<button role="combobox">`). |
| `selectAll` | `boolean` | `false` | Multiple only: a "Select all" / "Remove all" row above the options. |
| `mobileModalProps` | `ChoiceFieldMobileModalProps` | — | Settings of the Modal used instead of the dropdown up to 1200px inclusive. |
| `floatingLabel` | `boolean` | `true` | Label behavior on focus/value: true floats it up in small text, false works like a placeholder and hides when a value is entered. @default true |
| `multiple` | `` | `false` |  |
| `disabled` | `` | `false` |  |
| `loading` | `boolean` | `false` | Loading state: a skeleton instead of the content, input is blocked. |
| `modal` | `` | `true` |  |
| `defaultOpen` | `` | `false` |  |
| `variant` | `'filled' \| 'standard'` | `'filled'` | Visual variant: `filled` has a background (the main one), `standard` has none (specific scenarios, for example chat). @default 'filled' |
| `size` | `'md' \| 'sm'` | `'md'` | Size: md is 56px with 16px text, sm is 48px with 14px text. @default 'md' |
| `caption` | `ReactNode` | — | The only text under the field: a gray hint, and with `status` a colored message. Swapping “hint → error” is up to the caller (the RHF wrapper does it itself). |
| `status` | `FieldStatus` | — | Validation status: `error` is a red outline/caption + `aria-invalid`; `warning` is amber; `success` is green (no `aria-invalid`). |
| `prefix` | `ReactNode` | — | Prefix before the value (for example, a currency). Visible on focus or value. |
| `suffix` | `ReactNode` | — | Suffix after the value. Visible on focus or value. |

## Examples

- Icon And Loading
- Mobile Sheet
- Multiple
- Opened
- States
- Without Floating Label

Live page: http://localhost:8765/#/components/selector
