# Table

Tabular data with sorting, selection and several looks.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `object[]` | — | Row data; without it the table renders its children |
| `columns` | `Array<{ key: string; header?: ReactNode; width?: number \| pixel() \| proportional(); align?: 'start' \| 'center' \| 'end'; sortable?: boolean \| { sortKey }; sortValue?: (row) => any; renderCell?: (row) => ReactNode }>` | — | Column definitions |
| `rowKey` | `string \| (row) => string` | `'id'` | Field or function that gives a row its key |
| `caption` | `string` | — | Accessible caption |
| `density` | `'compact' \| 'balanced' \| 'spacious'` | `'balanced'` | Row height |
| `dividers` | `'rows' \| 'columns' \| 'grid' \| 'none'` | `'rows'` | Which divider lines to draw |
| `isStriped` | `boolean` | `false` | Tint every second row |
| `hasHover` | `boolean` | `false` | Highlight the row under the pointer |
| `verticalAlign` | `'middle' \| 'top' \| 'bottom'` | `'middle'` | Vertical alignment of cells |
| `textOverflow` | `'wrap' \| 'truncate'` | `'wrap'` | Wrap long text or cut it with an ellipsis |
| `sort` | `{ key: string; direction: 'asc' \| 'desc' } \| null` | — | Sort state (controlled) |
| `defaultSort` | `{ key: string; direction: 'asc' \| 'desc' } \| null` | — | Initial sort state |
| `onSortChange` | `(sort) => void` | — | Called when a sortable header is clicked |
| `manualSort` | `boolean` | `false` | Do not sort rows; sort the data yourself |
| `selectionMode` | `'none' \| 'single' \| 'multiple'` | `'none'` | Adds a selection column |
| `selectedKeys` | `string[]` | — | Selected row keys (controlled) |
| `defaultSelectedKeys` | `string[]` | `[]` | Initially selected row keys |
| `onSelectionChange` | `(keys) => void` | — | Called when the selection changes |
| `onRowClick` | `(row) => void` | — | Makes rows clickable |
| `isStickyHeader` | `boolean` | `false` | Keep the header visible while scrolling |
| `maxHeight` | `number \| string` | — | Scroll the rows inside this height |
| `isLoading` | `boolean` | `false` | Show skeleton rows |
| `emptyState` | `ReactNode` | `'No data'` | Shown when there are no rows |

## Examples

- Actions
- Composition
- Density
- Dividers
- Overflow
- Rich Cells
- Selection
- Sorting
- States
- Sticky Header
- Striped

Live page: http://localhost:8765/#/components/table
