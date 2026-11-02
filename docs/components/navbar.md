# Navbar

The bar at the top of a mobile screen: a back button on the left, the title in the middle and up to two icon actions on the right

The bar at the top of a mobile screen

## Usage

**Do**

- Use a short title; put the back button on the left and the actions on the right
- Render it outside the padded page, so it spans the whole width of the screen at the top

**Don't**

- Put more than two or three actions in it: group them in a menu
- Put it inside a container with side padding: it turns into a narrow strip

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

Live page: https://baseuikit.vercel.app/#/components/navbar
