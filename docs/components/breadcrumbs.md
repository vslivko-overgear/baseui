# Breadcrumbs

Links that show where the user is in a hierarchy

## Usage

**Do**

- Put them above the page heading
- Keep the labels short and equal to the page titles they lead to
- Leave the last item as plain text for the current page (or hide it with `showCurrent={false}`)

**Don't**

- Use them as the main navigation: they come with a sidebar or a top bar
- Show them on a top-level page with no parent
- Let the trail grow beyond 5 levels

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `Array<{ label: ReactNode; href?: string; onClick?: () => void }>` | — | Breadcrumb items in order |
| `showCurrent` | `boolean` | `true` | Show the current page, the last item. Off, the trail ends at its parent |
| `label` | `string` | `'Breadcrumbs'` | Accessible name |

## Examples

- Item
- Without Current

Live page: https://baseuikit.vercel.app/#/components/breadcrumbs
