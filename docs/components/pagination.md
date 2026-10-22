# Pagination

Navigation between pages. The number of items is always the same (the first and the last page, the current one with its neighbours, and a gap on each side), so nothing jumps; a gap is a button that jumps to the middle of the pages it hides, when the page changes; the arrows stay and are disabled at the ends. It can also move through the pages by itself.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `number` | — | Current page (1-based) |
| `total` | `number` | — | Number of pages |
| `onPageChange` | `(page: number) => void` | — | Called with the new page |
| `siblings` | `number` | `1` | Pages shown on each side of the current one |
| `autoScroll` | `boolean` | `false` | Loads the next page by itself every `autoScrollInterval`; it waits while the pointer or the focus is on the control and while the tab is hidden |
| `autoScrollInterval` | `number` | `3000` | Auto scroll: milliseconds between pages (at least 300) |
| `loop` | `boolean` | `true` | Auto scroll: after the last page go back to the first; off stops on the last page |
| `label` | `string` | `'Pagination'` | Accessible name |

Live page: http://localhost:8765/#/components/pagination
