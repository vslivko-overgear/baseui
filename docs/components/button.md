# Button

Triggers an action or navigates. A label that does not fit in the width of the button is cut with an ellipsis, never wrapped.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Visible text and accessible name |
| `children` | `ReactNode` | — | Visible content in place of `label` |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'destructive'` | `'secondary'` | Visual style |
| `size` | `'xsm' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Height: 32 / 40 / 48 / 56 px |
| `disabled` | `boolean` | `false` | Disables the button |
| `loading` | `boolean` | `false` | Shows a spinner and blocks interaction |
| `icon` | `ReactNode` | — | Icon before the label |
| `endContent` | `ReactNode` | — | Content after the label, e.g. a chevron |
| `shape` | `'rounded' \| 'circle'` | `'rounded'` | circle makes a pill (a circle for an icon button); rounded follows the theme radius. `data-shape="circle"` on a parent does it for all buttons inside |
| `width` | `number \| string` | — | Number is px; `"100%"` fills the container |
| `tooltip` | `string \| false` | — | Hover text; false turns the tooltip off (an icon-only button shows its label by default) |
| `href` | `string` | — | Renders a link |
| `onClick` | `(event) => void` | — | Click handler |
| `clickAction` | `(event) => void \| Promise<void>` | — | Async action; shows loading while pending |

## Examples

- Icons
- Loading
- Sizes
- Variants
- Width

Live page: http://localhost:8765/#/components/button
