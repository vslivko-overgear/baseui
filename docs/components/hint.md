# Hint

A question mark that explains the text next to it: a tooltip with a mouse, a dialog with the text and a Close button on a touch screen or a phone (a tooltip has no hover there)

## Usage

**Do**

- Use it for a short explanation next to a label or a value (what a fee or a cashback is)
- Write the text so that it makes sense on its own: on a phone it opens in a dialog

**Don't**

- Use a bare Tooltip around an info icon: it never shows on a touch screen
- Put links, buttons or what a person needs to finish the task in it

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `ReactNode` | — | The text of the hint |
| `label` | `string` | `'More information'` | Accessible name of the question mark |
| `closeLabel` | `string` | `'Close'` | Label of the button that closes the dialog on a touch screen |
| `size` | `number` | `16` | Size of the icon, px |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Side of the tooltip with a mouse |

## Examples

- Next To ALabel

Live page: https://baseuikit.vercel.app/#/components/hint
