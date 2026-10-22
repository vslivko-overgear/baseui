# Alert Dialog

A dialog that asks the user to confirm or cancel.

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

Live page: http://localhost:8765/#/components/alert-dialog
