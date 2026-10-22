# Dropdown

A menu of options that opens from any trigger. It opens over the page (drawn in the body, flipped and kept on screen), so it never pushes the content or gets clipped by a scrolling container. It stands alone: Selector and Typeahead draw their lists with the same items, groups and dividers.

The list that opens under a Selector or a Typeahead.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `ReactNode \| (props) => ReactElement` | — | What opens the menu; a render function receives the trigger props. Default: an Open button |
| `options` | `Array<{ value; label; details?; icon?; avatar?; subitem?; disabled? } \| { type: 'group'; label } \| { type: 'divider' }>` | — | Items, group titles and dividers |
| `value` | `string \| string[] \| null` | — | Selected value, or the values when `multiple` (controlled) |
| `defaultValue` | `string \| string[] \| null` | — | Initial selection (uncontrolled) |
| `onValueChange` | `(value) => void` | — | Called when the selection changes |
| `multiple` | `boolean` | `false` | Several items can be selected; the menu stays open |
| `selectAll` | `boolean` | `false` | Multiple only: a "Select all" / "Remove all" row above the items |
| `open` | `boolean` | — | Open state (controlled) |
| `defaultOpen` | `boolean` | `false` | Initially open |
| `onOpenChange` | `(open: boolean) => void` | — | Called when it opens or closes |
| `placement` | `'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom-start'` | Where the menu appears |
| `label` | `string` | — | Accessible name of the menu |
| `motion` | `'off' \| 'basic' \| 'enhanced'` | `theme` | Animation of opening and closing: off, basic (a quick fade), or enhanced (the menu grows from its trigger, and it plays out when it closes); by default the Animations setting of the theme |
| `glass` | `boolean` | `theme` | Translucent, blurred menu; true or false overrides the Glass setting of the theme |

## Examples

- Groups
- Icons
- Multiple

Live page: http://localhost:8765/#/components/dropdown
