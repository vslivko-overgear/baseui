# Bottom Bar

The bar at the bottom of a mobile screen for switching between 2 to 6 top-level sections. The active one is highlighted; it can also float above the content, like the tab bar in iOS.

The bar at the bottom of a mobile screen for switching sections.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `Array<{ value: string; label: string; icon: ReactNode; activeIcon?: ReactNode; badge?: number \| string \| true; disabled?: boolean }>` | — | The destinations (2 to 6); only the first six are shown. `activeIcon` (for example a filled icon) replaces `icon` when selected; `badge: true` shows a dot and a number shows a counter |
| `value` | `string` | — | Active destination (controlled) |
| `defaultValue` | `string` | — | Initially active destination; the first by default |
| `onValueChange` | `(value: string) => void` | — | Called when a destination is chosen |
| `showLabels` | `boolean` | `true` | Show the labels under the icons; without them each label stays as the accessible name |
| `floating` | `boolean` | `theme` | A floating bar: separate rounded pieces with a shadow over a gradient that fades the content (blurred when glass is on), inset from the screen edges; by default it follows the Floating setting of the theme |
| `glass` | `boolean` | `theme` | Translucent, blurred bar; true or false overrides the Glass setting of the theme |
| `motion` | `'off' \| 'basic' \| 'enhanced'` | `theme` | Animations of this bar: off, basic, or enhanced (the highlight slides); by default the Animations setting of the theme |
| `label` | `string` | `'Main navigation'` | Accessible name of the navigation |

## Examples

- Floating
- Without Labels

Live page: http://localhost:8765/#/components/bottom-bar
