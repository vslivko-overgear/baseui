# Layout

A flex container with a consistent gap

Containers that arrange content with consistent spacing

## Usage

**Do**

- Use `relation` (tight, related, group, section) for the gap when the blocks belong together to a degree; use `gap` for a number of the scale
- Use `gap` for the space between items, never margins on the children
- Let items flow with `wrap` when they do not fit

**Don't**

- Nest stacks inside stacks to get a grid: use Grid

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `'row' \| 'column'` | `'column'` | Main axis |
| `gap` | `number` | `4` | Gap in gaps (1 gap = 4px), a step of the spacing scale: 4 is 16px |
| `relation` | `'pair' \| 'tight' \| 'related' \| 'group' \| 'section'` | — | The gap by how closely the blocks belong together (0 / 8 / 16 / 24 / 40px); it replaces `gap`. `pair` is a title and the line that describes it: no gap, the line-height is the space |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | — | Cross-axis alignment |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around'` | — | Main-axis distribution |
| `wrap` | `boolean` | `false` | Allow items to wrap |
| `as` | `ElementType` | `'div'` | HTML tag |

## Examples

- Bleed Row
- Horizontal Stack
- Relation
- Vertical Stack

Live page: https://baseuikit.vercel.app/#/components/layout
