# Tooltip

A short hint on hover or focus. It is never shown on a touch screen (no hover there), so keep the information available some other way.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `ReactNode` | — | Hint text |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Side it appears on |
| `delay` | `number` | `300` | Show delay, ms |
| `children` | `ReactElement` | — | Trigger element (receives `aria-describedby`) |

## Examples

- Placements

Live page: http://localhost:8765/#/components/tooltip
