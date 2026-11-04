# Avatar

A person or entity shown as an image, initials or a placeholder

## Usage

**Do**

- Always pass the name: it makes the initials when the picture fails and is what a screen reader says
- Choose the size for the place: xsm or sm inline, md or lg in lists and cards, xl in a profile header
- Add a status dot when availability matters, like in chat

**Don't**

- Use an avatar for a logo or a product picture: use an image or an icon
- Override its shape with CSS: use the `shape` prop

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Source of the initials and the default alt text |
| `src` | `string` | — | Image URL |
| `fallbackSrc` | `string` | — | Used when `src` fails; if it fails too, initials are shown |
| `alt` | `string` | — | Accessible name; defaults to `name` |
| `rel` | `string` | — | The rel of the link when `href` is set |
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

Live page: https://baseuikit.vercel.app/#/components/avatar
