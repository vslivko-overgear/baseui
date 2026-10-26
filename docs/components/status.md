# Status

Tells the user the state of a view: nothing to show, information, success, a warning or an error. It fills the container it is in, in width and height, and centers its content.

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

Live page: http://localhost:8765/#/components/status
