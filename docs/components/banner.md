# Banner

An inline message with a status

## Usage

**Do**

- Choose the status that matches the message: info for news, warning for caution, error for problems, success for confirmation
- Let people close info and success banners; keep an error banner until the problem is fixed
- Keep the title short and scannable: "Payment failed"
- Say the status in the text: the icon and color are not enough for a screen reader

**Don't**

- Use a banner for a message that should disappear on its own: use Toast
- Stack several banners of the same status: combine them into one

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

Live page: https://baseuikit.vercel.app/#/components/banner
