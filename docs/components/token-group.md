# Token Group

A group of chips: a title, a wrapping container and a caption or an error. With `options` a managed set (the value is an array of the selected values), with `children` a free layout

A group of tokens with single or multiple selection

## Usage

**Do**

- Use it for filters and tags a person can pick or remove
- Keep a group to a handful of tokens; beyond that give it a search

**Don't**

- Mix tokens that do different things (filter, remove, status) in one group

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Group title |
| `options` | `Array<{ value: string; label: ReactNode; disabled?: boolean; icon?; avatar?; counter? }>` | — | The chips of a managed group |
| `children` | `ReactNode` | — | Chips of a free layout (without `options`) |
| `size` | `'md' \| 'sm'` | `'md'` | Size of the chips and the title |
| `multiple` | `boolean` | `false` | Several chips can be selected |
| `value` | `string[]` | — | Selected values (controlled) |
| `defaultValue` | `string[]` | — | Initially selected values (uncontrolled) |
| `onValueChange` | `(value: string[]) => void` | — | Called with the new array of selected values |
| `caption` | `ReactNode` | — | Caption under the group |
| `error` | `ReactNode` | — | Error text under the group (replaces the caption) |
| `className` | `string` | — | Extra class on the wrapper (merged) |
| `ref` | `Ref<HTMLDivElement>` | — | Ref to the group |

## Examples

- Caption And Error
- Free Layout
- Single
- Small
- With Avatars
- With Icons

Live page: https://baseuikit.vercel.app/#/components/token-group
