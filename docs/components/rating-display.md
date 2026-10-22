# Rating Display

Shows a rating as stars, for example an average score. It cannot be changed.

Stars that show a rating, such as an average score.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | `0` | The rating, from 0 to `max` |
| `max` | `number` | `5` | Number of stars |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Star size |
| `color` | `'accent' \| 'warning'` | `'accent'` | Star color |
| `round` | `boolean` | `true` | Round the value down to the nearest half star; off shows the exact fill |
| `label` | `string` | — | Label above the stars |
| `caption` | `string` | — | Text under the stars |

## Examples

- Colors

Live page: http://localhost:8765/#/components/rating-display
