# Product Listing

A listing of products: the cards take the whole width of a row and the listing always shows whole rows. After the first rows come a "Show more" button (the default), an endless scroll or pagination, by setting

A listing of products: cards that take the whole width of a row, whole rows, then Show more, an endless scroll or pagination by setting

## Usage

**Do**

- Let the cards take the whole width of a row: the columns reflow and the listing always shows whole rows
- Choose `more="button"`, `more="infinite"` or `more="pagination"` for the navigation the product needs
- Set `hasMore`, `onLoadMore` and `loading` when the products come from a server

**Don't**

- Leave a gap at the end of a row, or end a loaded part in the middle of a row
- Mix loading and pagination state from different data sources

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `Array<object>` | — | The products: the props of a ProductCard (or what `renderItem` takes); an `id` is the key |
| `renderItem` | `(item, index) => ReactNode` | — | Draws a card; by default a ProductCard with the props of the item |
| `more` | `'button' \| 'infinite' \| 'pagination'` | `'button'` | What comes after the first rows: a Show more button (the default), an endless scroll, or pagination. Choose the mode that fits the product |
| `rows` | `number` | `2` | How many rows are shown at first, and how many come at a time |
| `hasMore` | `boolean` | `false` | More products can be loaded: with `onLoadMore`, and until they come the cards that would start a new row wait |
| `onLoadMore` | `() => void` | — | Called when the listing needs more products than it has |
| `loading` | `boolean` | `false` | Loading: skeletons of the next rows are shown, and the button waits |
| `page` | `number` | — | Pagination: the current page |
| `onPageChange` | `(page: number) => void` | — | Pagination: called with the new page |
| `moreLabel` | `string` | `'Show more'` | The label of the button |
| `label` | `string` | `'Products'` | Accessible name of the list |

## Examples

- Endless

Live page: https://baseuikit.vercel.app/#/components/product-listing
