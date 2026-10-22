# Typeahead

Autocomplete: Base UI Combobox on the shared field shell `FieldShell`. The search text and the
selected value have independent states (`inputValue`/`value`). The shell
(Field.Root) sits outside Combobox.Root so that Combobox.setFilled finds the Field context
(otherwise data-filled/floating label do not work). The input group fills the cell;
the popup is anchored to the cell (full field width). Outline/label follow focus (like text).

The field (label, size, variant, status, caption, prefix/suffix, loading) is Text Input's own shell, so those settings and their docs come from Text Input. The list is the shared Dropdown.

A text field that suggests options as you type.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `emptyText` | `ReactNode` | `'Nothing found'` | Content of the empty state after filtering. |
| `multipleDisplay` | `'chips' \| 'counter'` | `'chips'` | How selected values are shown in multiple mode. |
| `mobileModalProps` | `ChoiceFieldMobileModalProps` | — | Settings of the Modal used instead of the dropdown up to 1200px inclusive. |
| `mobileSearchPlaceholder` | `string` | `'Type'` | Placeholder of the search input inside the mobile sheet. @default 'Type' |
| `mobileSearchLabel` | `string` | — | Accessible name of the search input inside the mobile sheet. @default 'Search' |
| `ref` | `Ref<HTMLInputElement>` | — | Ref to the visible search input. |
| `floatingLabel` | `boolean` | `true` | Label behavior on focus/value: true floats it up in small text, false works like a placeholder and hides when a value is entered. @default true |
| `multiple` | `` | `false` |  |
| `disabled` | `` | `false` |  |
| `loading` | `boolean` | `false` | Loading state: a skeleton instead of the content, input is blocked. |
| `modal` | `` | `true` |  |
| `defaultOpen` | `` | `false` |  |
| `openOnInputClick` | `` | `true` |  |
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

Live page: http://localhost:8765/#/components/typeahead
