# Button Group

Lays out the buttons of one decision: a row that wraps (horizontal) or a column in which every button fills the width (vertical). The layout is the group’s, so a button needs no width of its own

The layout of the buttons of one decision: a row, or a column in which every button fills the width

## Usage

**Do**

- Put the buttons of one decision in a ButtonGroup; let the group, not the buttons, decide the width
- Use `orientation="vertical"` when the buttons are stacked: they fill the width of the group
- In a vertical group put the primary action first; use `stackOnMobile` for a footer that is a row on a desktop and a column on a phone

**Don't**

- Set `width="100%"` on each button of a stack by hand: the group does it
- Put two primary buttons in one group: one primary, the rest secondary or ghost
- Use it for unrelated buttons or for a toolbar of icon buttons: use ControlRow

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Horizontal is a row; vertical is a column and the buttons take the full width of the group |
| `stackOnMobile` | `boolean` | `false` | A horizontal group becomes vertical below 768px (the mobile breakpoint), so the buttons of a dialog or a card are full width on a phone |
| `size` | `'xsm' \| 'sm' \| 'md' \| 'lg'` | — | One tier for the buttons of the group: the same height, text size and icon size. A button with its own size keeps it |
| `gap` | `number` | `3` | Gap between the buttons in steps of 4px |
| `justify` | `'start' \| 'center' \| 'end' \| 'between'` | — | Horizontal only: where the buttons stand in the row |
| `label` | `string` | — | The name of the group for a screen reader (aria-label), when the buttons alone do not say what they are for |
| `as` | `ElementType` | `'div'` | The element of the group |
| `children` | `ReactNode` | — | Buttons, icon buttons and links that look like buttons |

## Examples

- Horizontal
- Size
- Stack On Mobile
- Vertical

Live page: https://baseuikit.vercel.app/#/components/button-group
