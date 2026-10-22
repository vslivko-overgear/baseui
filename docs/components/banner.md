# Banner

An inline message with a status.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `status` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Message type |
| `title` | `ReactNode` | — | Heading |
| `children` | `ReactNode` | — | Message text |
| `onClose` | `() => void` | — | When set, a close button is shown |
| `closeLabel` | `string` | `'Close'` | Accessible name of the close button |

## Examples

- Dismissable
- Statuses

Live page: http://localhost:8765/#/components/banner
