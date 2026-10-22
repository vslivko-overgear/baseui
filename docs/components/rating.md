# Rating

Collects a rating as stars. Only whole values can be chosen.

Stars the user picks to leave a rating.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | — | Selected stars (controlled) |
| `defaultValue` | `number` | `0` | Initially selected stars (uncontrolled) |
| `onValueChange` | `(value: number) => void` | — | Called when a star is chosen |
| `max` | `number` | `5` | Number of stars |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Star size |
| `label` | `string` | — | Label above the stars; also the accessible name |
| `caption` | `string` | — | Hint under the stars |
| `disabled` | `boolean` | `false` | Stars cannot be chosen |

## Examples

- Sizes

Live page: http://localhost:8765/#/components/rating
