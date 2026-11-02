# Icon Button

A button with only an icon

## Usage

**Do**

- Give it a specific `label` ("Delete conversation", not "Delete"): it is the accessible name and the tooltip
- Use the ghost variant in toolbars and dense areas
- Keep the tooltip on, so that sighted people get the hint a screen reader gets from the label

**Don't**

- Use it when the icon alone does not say what happens: use Button with text
- Turn the tooltip off for an icon that has no text beside it

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `ReactNode` | — | Icon element |
| `label` | `string` | — | Accessible name and tooltip |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'destructive'` | `'secondary'` | Visual style |
| `size` | `'xsm' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Height: 32 / 40 / 48 / 56 px |
| `disabled` | `boolean` | `false` | Disables the button |
| `loading` | `boolean` | `false` | Shows a spinner and blocks interaction |
| `tooltip` | `string \| false` | — | Hover text; the label by default, false turns it off |

## Examples

- Variants

Live page: https://baseuikit.vercel.app/#/components/icon-button
