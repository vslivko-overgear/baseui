# Typeahead

A text field that suggests options as you type: the Base UI Combobox in the shared field shell. The typed text and the selected value are separate states. Below 768px the list is a bottom sheet with a search

A text field that suggests options as you type

## Usage

**Do**

- Use it for long lists and remote search, with a placeholder that says what can be searched
- Keep the typed text and the chosen value as separate things

**Don't**

- Use it for a short fixed list: use Selector
- Place several of them side by side without clear labels

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `Array<{ value: string; label: ReactNode; details?; icon?; avatar?; subitem?; disabled? }>` | — | Options |
| `value` | `string \| string[] \| null` | — | Selected value, or the values when `multiple` (controlled) |
| `defaultValue` | `string \| string[] \| null` | — | Initial selection (uncontrolled) |
| `onValueChange` | `(value) => void` | — | Called when the selection changes |
| `label` | `ReactNode` | — | Field label (a single field only; a multiple field shows tokens) |
| `placeholder` | `string` | — | Placeholder of the search input |
| `floatingLabel` | `boolean` | `true` | Label behavior on focus/value: true floats it up in small text, false works like a placeholder |
| `variant` | `'filled' \| 'standard'` | `'filled'` | Visual variant: `filled` has a background (the main one), `standard` has none |
| `size` | `'md' \| 'sm'` | `'md'` | Size: md is 56px with 16px text, sm is 48px with 14px text; the list follows it |
| `caption` | `ReactNode` | — | The only text under the field: a gray hint, and with `status` a colored message |
| `status` | `'error' \| 'warning' \| 'success'` | — | Validation status: `error` is a red outline and caption plus `aria-invalid`; `warning` is amber; `success` is green |
| `prefix` | `ReactNode` | — | Prefix before the value (a single field) |
| `suffix` | `ReactNode` | — | Suffix after the value (a single field) |
| `startIcon` | `ReactNode` | — | Icon at the start of the field (24px) |
| `multiple` | `boolean` | `false` | Several options can be selected |
| `multipleDisplay` | `'tokens' \| 'counter'` | `'tokens'` | How the selected values are shown in multiple mode |
| `selectAll` | `boolean` | `false` | Multiple only: a "Select all" / "Remove all" row above the options |
| `emptyText` | `ReactNode` | `'Nothing found'` | Content of the empty state after filtering |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state: a skeleton instead of the content, input is blocked |
| `modal` | `boolean` | `true` | Block the page behind the open list |
| `open` | `boolean` | — | Open state (controlled) |
| `defaultOpen` | `boolean` | `false` | Initially open |
| `onOpenChange` | `(open: boolean, details) => void` | — | Called when the list opens or closes |
| `openOnInputClick` | `boolean` | `true` | Open the list when the input is clicked |
| `mobileDialogProps` | `object` | — | Settings of the Dialog used instead of the dropdown below 768px |
| `mobileSearchPlaceholder` | `string` | `'Type'` | Placeholder of the search input inside the sheet |
| `mobileSearchLabel` | `string` | `'Search'` | Accessible name of the search input inside the sheet |
| `className` | `string` | — | Extra class on the outer wrapper (merged) |
| `ref` | `Ref<HTMLInputElement>` | — | Ref to the visible search input |

## Examples

- Icon And Loading
- Mobile Sheet
- Multiple
- Opened
- States

Live page: https://baseuikit.vercel.app/#/components/typeahead
