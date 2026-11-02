# Alert Dialog

A dialog that asks the user to confirm or cancel

## Usage

**Do**

- Label the confirm button with the action: "Delete project", not "OK"
- Say in the text what will happen and what cannot be undone
- Keep Cancel as the safe default

**Don't**

- Use it for an action that is not destructive: use Dialog
- Signal danger by color alone: the label has to say it

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Open state |
| `floating` | `boolean` | `theme` | A floating sheet on small screens (margins at the bottom and the sides, rounded on every side); by default it follows the Floating setting of the theme |
| `onOpenChange` | `(open: boolean) => void` | — | Called when it should open or close |
| `title` | `ReactNode` | — | Question or statement |
| `description` | `ReactNode` | — | Explains the consequence |
| `confirmLabel` | `string` | `'Confirm'` | Confirm button text |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button text |
| `onConfirm` | `() => void` | — | Called when confirmed |
| `destructive` | `boolean` | `false` | Style the confirm button as destructive |

Live page: https://baseuikit.vercel.app/#/components/alert-dialog
