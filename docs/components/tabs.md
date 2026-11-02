# Tabs

Switches between related views: the row of tabs and the panel under it. A row wider than its container scrolls, with slide buttons and a fade at the edges from the lg breakpoint (1024px); below it the row is scrolled by touch or the wheel

## Usage

**Do**

- Use tabs to move between views of the same thing, with short labels
- Put what a tab owns in the panel: the `content` of its item, or `children` (a node or a function of the selected value). The page order is: what is true for the whole page, the tabs, then the panel
- Use a counter or a badge for what is waiting in a tab

**Don't**

- Change the title, the lead or anything above the row when a tab is pressed (D17): the panel is the place for it
- Use tabs for actions, or for the steps of a form
- Hide critical content in a tab nobody opens

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `Array<{ value: string; label: ReactNode; icon?: ReactNode; counter?: number \| string; badge?: ReactNode \| string; disabled?: boolean; content?: ReactNode }>` | — | The tabs. `content` is the panel of the tab; a badge is red by default (sm for sm and md tabs, md otherwise) |
| `value` | `string` | — | Selected tab (controlled) |
| `defaultValue` | `string` | `the first enabled tab` | Initially selected tab |
| `onValueChange` | `(value: string) => void` | — | Called when the selected tab changes |
| `children` | `ReactNode \| ((value: string) => ReactNode)` | — | The panel under the row for tabs that have no `content`: a node, or a function of the selected value. Everything a tab switches goes here |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Tab size: the label goes from 16 to 28px (Figma Small to Extra Large) |
| `showIcon` | `boolean` | `true` | Show the tab icons |
| `showCounter` | `boolean` | `true` | Show the tab counters |
| `showBadge` | `boolean` | `true` | Show the tab badges |
| `motion` | `'off' \| 'basic' \| 'enhanced'` | `theme` | Animations of the row: off, basic, or enhanced (the underline slides to the selected tab and nudges toward the hovered one); by default the Animations setting of the theme |
| `label` | `string` | — | Accessible name of the row |
| `panelClassName` | `string` | — | Class of the panel under the row |

## Examples

- Sizes
- Slide
- Slot

Live page: https://baseuikit.vercel.app/#/components/tabs
