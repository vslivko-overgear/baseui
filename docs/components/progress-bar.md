# Progress Bar

A linear progress indicator

## Usage

**Do**

- Use a determinate bar when the amount of work is known, and an indeterminate one when it is not
- Choose the color for the context: brand or accent for progress, success for done, warning or error for trouble
- Use `sections` for a process with named steps, like a password strength or a step 2 of 4
- Give it a label

**Don't**

- Use it for an action that is instant
- Stack several bars for one operation: use one bar with a value
- Put text or icons inside the bar

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | — | Progress from 0 to 100; omit for indeterminate |
| `size` | `'sm' \| 'md'` | `'md'` | Bar thickness |
| `color` | `'brand' \| 'accent' \| 'success' \| 'warning' \| 'error' \| 'blue' \| 'blue-light' \| 'green' \| 'green-light' \| 'orange' \| 'pink' \| 'red'` | `'brand'` | Color of the fill, a color of the design system: the brand and accent backgrounds, the status colors or an accent color |
| `sections` | `1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8` | `1` | Splits the bar into equal sections (1 to 8) with a gap; the value fills them one after another. Indeterminate bars are not split |
| `label` | `ReactNode` | — | Label above the bar |
| `showValue` | `boolean` | `false` | Show the value as a percentage |

## Examples

- Colors
- Indeterminate
- Sections

Live page: https://baseuikit.vercel.app/#/components/progress-bar
