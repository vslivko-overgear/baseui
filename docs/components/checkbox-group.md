# Checkbox Group

A group of checkboxes on top of the Base UI CheckboxGroup: the value is an array of checked `value`s.
The error is a message under the group (the boxes do not turn red, like the Group node in Figma).
In forms the props are set by `CheckboxGroupField` from `@baseui/ui/rhf/CheckboxGroup`.

A list of checkboxes with a title, a caption, an error and nested subgroups with a parent checkbox.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Group title. |
| `onValueChange` | `(value: string[]) => void` | — | Called with the new array of checked values. |
| `onOptionChange` | `(option: CheckboxGroupOption, checked: boolean) => void` | — | Called for the specific changed option together with `onValueChange`, with its new `checked` state. For per-option analytics/side effects without diffing the value array by hand. Not called by a click on `parent` (“select all”): that changes the whole list at once. |
| `parent` | `ReactNode` | — | Label of the parent “select all” checkbox (Subgroup in Figma). When set, it toggles all options at once and shows indeterminate on a partial selection, and the options become indented sub-items. It is not part of the group value. |
| `options` | `CheckboxGroupOption[]` | — | Group options. |
| `caption` | `ReactNode` | — | Caption under the group (Caption). |
| `error` | `ReactNode` | — | Error text under the group (overrides `caption`). The boxes do NOT turn red: only the message. |
| `className` | `string` | — | Extra class on the wrapper (merged). |
| `id` | `string` | — | id of the outer `.field` container (title + options + caption/error), for example to scroll to the error of the whole block. The inner Base UI group (`role="group"`) does not get its own id. |
| `data-testid` | `string` | — | `data-testid` of the outer `.field` container (see `id`). |
| `ref` | `Ref<HTMLDivElement>` | — | Ref to the group root element (`<div role="group">`). |

## Examples

- With Caption
- With Error
- With Subgroup

Live page: http://localhost:8765/#/components/checkbox-group
