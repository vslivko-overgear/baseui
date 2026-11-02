# Dropdown

A menu of options that opens from any trigger. It opens over the page (drawn in the body, flipped and kept on screen), so it never pushes the content or gets clipped by a scrolling container. It stands alone: Selector and Typeahead draw their lists with the same items, groups and dividers

The list that opens under a Selector or a Typeahead

## Usage

**Do**

- Keep items short and about an action
- Group related items in sections when there are many

**Don't**

- Use a menu for navigation
- Put more than 10–12 items in one menu without sections

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `ReactElement \| (props) => ReactElement` | — | What opens the menu: an element (it gets the open handler and the ARIA attributes) or a render function that receives the trigger props. Default: an Open button |
| `options` | `Array<{ value; label; details?; icon?; avatar?; subitem?; disabled? } \| { type: 'group'; label } \| { type: 'divider' }>` | — | Items, group titles and dividers |
| `value` | `string \| string[] \| null` | — | Selected value, or the values when `multiple` (controlled) |
| `defaultValue` | `string \| string[] \| null` | — | Initial selection (uncontrolled) |
| `onValueChange` | `(value) => void` | — | Called when the selection changes |
| `multiple` | `boolean` | `false` | Several items can be selected; the menu stays open |
| `selectAll` | `boolean` | `false` | Multiple only: a "Select all" / "Remove all" row above the items |
| `selectable` | `boolean` | `true` | Whether the list shows what is chosen: a check mark column is reserved at the end of every row. false for a menu of actions: no column, so the details of a row stand at the right edge |
| `open` | `boolean` | — | Open state (controlled) |
| `defaultOpen` | `boolean` | `false` | Initially open |
| `onOpenChange` | `(open: boolean) => void` | — | Called when it opens or closes |
| `placement` | `'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom-start'` | Where the menu appears |
| `size` | `'sm' \| 'md'` | `'md'` | Item size: sm (40px items) or md (48px). Set it to the size of the field or button the menu opens from; Selector and Typeahead do it by themselves |
| `label` | `string` | — | Accessible name of the menu |
| `motion` | `'off' \| 'basic' \| 'enhanced'` | `theme` | Animation of opening and closing: off, basic (a quick fade), or enhanced (the menu grows from its trigger, and it plays out when it closes); by default the Animations setting of the theme |
| `glass` | `boolean` | `theme` | Translucent, blurred menu; true or false overrides the Glass setting of the theme |

## Examples

- Groups
- Icons
- Multiple

Live page: https://baseuikit.vercel.app/#/components/dropdown
