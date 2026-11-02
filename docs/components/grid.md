# Grid

A CSS grid with equal columns

## Usage

**Do**

- Use columns that reflow, like `repeat(auto-fit, minmax(240px, 1fr))`, for anything that must work on a phone
- Use `gap` for the space between cells

**Don't**

- Use `columns={4}` for a row that must survive a narrow screen: a number never reflows
- Write your own CSS grid when Grid does it

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `columns` | `number \| string` | `2` | Number of columns or a template string |
| `gap` | `number` | `4` | Gap in gaps (1 gap = 4px), a step of the spacing scale: 4 is 16px |

Live page: https://baseuikit.vercel.app/#/components/grid
