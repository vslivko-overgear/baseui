# Avatar

A person or entity shown as an image, initials or a placeholder.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Source of the initials and the default alt text |
| `src` | `string` | — | Image URL |
| `fallbackSrc` | `string` | — | Used when `src` fails; if it fails too, initials are shown |
| `alt` | `string` | — | Accessible name; defaults to `name` |
| `size` | `'xsm' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `'md'` | Size: 20 / 24 / 36 / 48 / 128 px, or a number in px |
| `shape` | `'circle' \| 'rounded' \| 'square'` | `'circle'` | Corner shape |
| `status` | `ReactNode` | — | Corner content, usually an `AvatarStatusDot` |
| `tooltip` | `string \| boolean` | `true` | Hover text; `true` uses the name, `false` hides it |
| `href` | `string` | — | Renders a link |
| `onClick` | `(event) => void` | — | Renders a button when there is no `href` |

## Examples

- Image
- Interactive
- Shapes
- Sizes
- Status

Live page: http://localhost:8765/#/components/avatar
