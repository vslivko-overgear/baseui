# Product Card

The card of a product in a listing: a picture with a badge and a heart over it, the price, the title in two lines, the rating and one line of meta (for example how many were sold)

## Usage

**Do**

- Use it for a compact product summary: a picture, the price, a title of two lines, the rating and one line of meta; when a listing mixes games, put the name of the game above the price with `eyebrow`
- Give the heart through `favorite` when the product can be kept
- Put it inside a ProductListing, which lays the cards in rows

**Don't**

- Use it when the content needs a different structure than this compact card supports
- Add more lines to it (a description, three badges): a listing is scanned, not read

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | — | Name of the product, two lines at most |
| `price` | `ReactNode` | — | Price, in bold |
| `image` | `string` | — | Picture url; it fills the square (1:1) area. Without it the fallback icon is shown |
| `imageAlt` | `string` | `''` | Alternative text of the picture (empty when the title says the same) |
| `fallbackIcon` | `string` | `'Image01'` | Icon of the catalog shown when there is no picture |
| `badge` | `string` | — | A mark over the top left corner of the picture: Sale, Hot offer |
| `badgeVariant` | `'primary' \| 'secondary' \| 'accent' \| 'success' \| 'warning' \| 'critical'` | `'secondary'` | Color of the badge |
| `eyebrow` | `ReactNode` | — | A line above the price in 12px Secondary: the game or the category the product belongs to |
| `points` | `string[]` | — | The selling points under the title, up to three, each a line with a check (a point that does not fit ends with an ellipsis). With points the title takes one line, so the points stand close under it |
| `rating` | `number` | — | Rating, shown with a star |
| `meta` | `ReactNode` | — | The line on the right of the rating: sold, delivery time |
| `favorite` | `{ active?: boolean, onToggle?: (active: boolean) => void, label?: string }` | — | The heart over the top right corner of the picture: filled when active; tapping it plays a short move |
| `onClick` | `() => void` | — | Opens the product |
| `href` | `string` | — | Opens the product as a link |
| `label` | `string` | — | Accessible name of the card (the title by default) |

## Examples

- Without Picture
- art

Live page: https://baseuikit.vercel.app/#/components/product-card
