# Selector

A field, or any element, that opens a list of options: the Base UI Select in the shared field shell. Single and multiple selection; below 768px the list is a bottom sheet

A field, or any element, that opens a list of options

## Usage

**Do**

- Give it a visible label and a placeholder that says what to choose ("Choose a country")
- Group the options in sections when there are more than about 8
- Use `multiple` when several can be chosen

**Don't**

- Use it for a menu of actions: use Dropdown
- Use it for two options: use SegmentedControl or Radio
- Use it for yes or no: use Switch or Checkbox
- Put more than about 20 options in without sections: use Typeahead

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `Array<{ value: string; label: ReactNode; details?; icon?; avatar?; subitem?; disabled? } \| { type: 'group'; label } \| { type: 'divider' }>` | — | Options, group titles and dividers |
| `value` | `string \| string[] \| null` | — | Selected value, or the values when `multiple` (controlled) |
| `defaultValue` | `string \| string[] \| null` | — | Initial selection (uncontrolled) |
| `onValueChange` | `(value) => void` | — | Called when the selection changes |
| `trigger` | `ReactNode` | — | Any element that opens the list: a button, an icon button or text. Without it the field itself is the trigger. A string becomes a plain button; an element gets the trigger props and a ref |
| `label` | `ReactNode` | — | Field label |
| `placeholder` | `string` | — | Shown when nothing is selected; by default the label |
| `floatingLabel` | `boolean` | `true` | Label behavior on focus/value: true floats it up in small text, false works like a placeholder and hides when a value is entered |
| `variant` | `'filled' \| 'standard'` | `'filled'` | Visual variant: `filled` has a background (the main one), `standard` has none |
| `size` | `'md' \| 'sm'` | `'md'` | Size: md is 56px with 16px text, sm is 48px with 14px text; the list follows it |
| `caption` | `ReactNode` | — | The only text under the field: a gray hint, and with `status` a colored message |
| `status` | `'error' \| 'warning' \| 'success'` | — | Validation status: `error` is a red outline and caption plus `aria-invalid`; `warning` is amber; `success` is green |
| `prefix` | `ReactNode` | — | Prefix before the value |
| `suffix` | `ReactNode` | — | Suffix after the value |
| `startIcon` | `ReactNode` | — | Icon at the start of the field (24px) |
| `multiple` | `boolean` | `false` | Several options can be selected; on a phone the sheet gets an Apply button |
| `selectAll` | `boolean` | `false` | Multiple only: a "Select all" / "Remove all" row above the options |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading state: a skeleton instead of the content, input is blocked |
| `modal` | `boolean` | `true` | Block the page behind the open list |
| `open` | `boolean` | — | Open state (controlled) |
| `defaultOpen` | `boolean` | `false` | Initially open |
| `onOpenChange` | `(open: boolean, details) => void` | — | Called when the list opens or closes |
| `mobileDialogProps` | `object` | — | Settings of the Dialog used instead of the dropdown below 768px |
| `className` | `string` | — | Extra class on the outer wrapper (merged) |
| `ref` | `Ref<HTMLButtonElement>` | — | Ref to the trigger button (`<button role="combobox">`) |

## Examples

- Icon And Loading
- Mobile Sheet
- Multiple
- Opened
- States
- Without Floating Label

Live page: https://baseuikit.vercel.app/#/components/selector
