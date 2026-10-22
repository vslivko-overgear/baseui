# Navbar

The bar at the top of a mobile screen: a back button on the left, the title in the middle and up to two icon actions on the right.

The bar at the top of a mobile screen.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Screen title, centered; a long one is truncated |
| `subtitle` | `string` | — | A second line under the title |
| `showBack` | `boolean` | `true` | Show the back button |
| `onBack` | `() => void` | — | Called when the back button is pressed |
| `backLabel` | `string` | `'Back'` | Accessible name of the back button |
| `floating` | `boolean` | `theme` | A floating bar: separate rounded pieces with a shadow over a gradient that fades the content (blurred when glass is on), inset from the screen edges; by default it follows the Floating setting of the theme |
| `glass` | `boolean` | `theme` | Translucent, blurred bar; true or false overrides the Glass setting of the theme |
| `actions` | `Array<{ icon: ReactNode; label: string; onClick?: () => void; disabled?: boolean }>` | `[]` | Icon buttons on the right; only the first two are shown. `label` is the accessible name |

## Examples

- Variants

Live page: http://localhost:8765/#/components/navbar
