# List

A vertical list of rows with an optional title and divider

A vertical list of rows with an optional title and divider. Text, titles and dividers line up with the content edge; hover reaches beyond it

## Usage

**Do**

- Give the list a header or a name that says what it holds
- Use the start and end slots for icons, avatars and badges

**Don't**

- Put interactive elements inside an interactive row
- Use a list for a single item
- Mix clickable and plain rows without telling them apart

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md'` | `'md'` | Row height of every `ListItem` inside: `sm` (40px, 14px text) or `md` (48px); a row can set its own |
| `spacing` | `'sm' \| 'md' \| 'lg'` | `'sm'` | The space between the rows: sm is compact, md adds 4px to each row, lg adds 8px |
| `title` | `ReactNode` | — | Group title above the list, aligned with the text of the rows; it gives the list its accessible name |
| `divider` | `boolean` | `false` | A divider below the group, as wide as the text of the rows: it separates the group from the next one |
| `children` | `ReactNode` | — | `ListItem` rows |
| `className` | `string` | — | Extra class on the group wrapper (merged) |
| `ref` | `Ref<HTMLUListElement>` | — | Ref to the `<ul>` |

## Examples

- Sections
- Settings
- Sizes
- Spacing

Live page: https://baseuikit.vercel.app/#/components/list
