# Theme Settings

The theme of this site and of your own app: the settings are applied at once and stored in a cookie on this device.

Pick a ready theme, the brand color, the shape, the base radius and the fonts. Everything is applied at once to this site and stored in a cookie on your device.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `preset` | `'default' \| 'ocean' \| 'forest' \| 'sunset' \| 'berry' \| 'graphite' \| 'custom'` | `'default'` | A ready set of the settings below; changing any of them switches it to custom |
| `brand` | `'default' \| 'blue' \| 'green' \| 'pink' \| 'orange' \| 'red' \| 'blue-light' \| 'green-light' \| 'custom'` | `'default'` | Brand color: primary buttons, the slider, the current step and page. default is the Overgear violet |
| `brandColor` | `string` | `'#564fff'` | Your own brand color, any CSS color (with brand: custom) |
| `shape` | `'rounded' \| 'circle'` | `'rounded'` | rounded follows the base radius; circle makes buttons, fields, tokens and segmented controls pills (`data-shape` on `<html>`) |
| `radius` | `number` | `12` | Base radius in px: every radius token (4 to 32) scales from it; 0 makes square corners |
| `headingFont` | `'Geist' \| 'Unbounded' \| 'Montserrat Alternates' \| …` | `'Geist'` | Font of the headings (`--baseui-Typography-Headline-Font-Family`); Google Fonts with Cyrillic |
| `textFont` | `'Geist' \| 'Inter' \| 'Manrope' \| …` | `'Geist'` | Font of all other text (`--baseui-Typography-Font-Family`); Google Fonts with Cyrillic |
| `motion` | `'off' \| 'basic' \| 'enhanced'` | `'basic'` | off: nothing moves (loading indicators still run); basic (the default): simple transitions, the highlight of a tab, segment or bar item appears in its new place with a fade; enhanced: the highlight slides there, and the underline of the tabs also nudges toward the hovered tab; menus and panels (Dropdown, Popover, the lists of Selector and Typeahead) grow from their trigger and play out when they close (`data-motion` on `<html>`) |
| `floating` | `boolean` | `false` | Bars and panels float above the content: rounded, inset, with a shadow (`data-floating` on `<html>`; the Navbar and Bottom Bar follow it) |
| `glass` | `boolean` | `false` | Translucent, blurred surfaces for bars, menus, dialogs and toasts (`data-glass` on `<html>`) |

## Examples

- Theme Preview

Live page: http://localhost:8765/#/theming/theme-settings
