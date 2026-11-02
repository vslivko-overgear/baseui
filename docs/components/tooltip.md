# Tooltip

A short hint on hover or focus. It is never shown on a touch screen (no hover there), so keep the information available some other way

## Usage

**Do**

- Keep it short, under about 140 characters of plain text
- Use it to name icon-only controls

**Don't**

- Put links or buttons in a tooltip: use Popover
- Put in it what a person needs to finish the task

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `ReactNode` | — | Hint text |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Side it appears on; the opposite side is used when there is no room in the window, and it is kept inside the window |
| `delay` | `number` | `300` | Show delay, ms |
| `children` | `ReactElement` | — | Trigger element (receives `aria-describedby`) |

## Examples

- Placements

Live page: https://baseuikit.vercel.app/#/components/tooltip
