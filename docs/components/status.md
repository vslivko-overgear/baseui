# Status

Tells the user the state of a view: nothing to show, information, success, a warning or an error. It fills the container it is in, in width and height, and centers its content

## Usage

**Do**

- Give an empty state a title that says what is empty and why, and a button (`actionLabel`) that says what to do next
- Pick the status that fits: neutral for empty, accent for news, and success, warning, error for outcomes

**Don't**

- Write "No data"
- Use it for an error that needs action at once: use Banner

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `status` | `'neutral' \| 'accent' \| 'success' \| 'warning' \| 'error'` | `'neutral'` | The state; it sets the color of the circle, the icon, the title and the description |
| `icon` | `ReactNode` | — | Replaces the icon (the circle keeps the color of the status) |
| `title` | `ReactNode` | — | Replaces the title of the status |
| `description` | `ReactNode` | — | Replaces the text under the title |
| `action` | `ReactNode` | — | A custom action in place of the button below |
| `actionLabel` | `string` | — | Label of the action button; without it there is no button |
| `actionVariant` | `'primary' \| 'secondary'` | `'primary'` | Button style |
| `onAction` | `() => void` | — | Called when the button is pressed |

## Examples

- Actions
- Custom Content
- Statuses

Live page: https://baseuikit.vercel.app/#/components/status
