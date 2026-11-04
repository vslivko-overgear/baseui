# Popover

A floating panel anchored to a trigger. It opens over the page (drawn in the body, flipped and kept on screen), so it never pushes the content or gets clipped by a scrolling container

## Usage

**Do**

- Keep it to one task or one piece of information
- Give it a clear way to close

**Don't**

- Open a popover from inside a popover

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `(props) => ReactElement` | — | Render function that receives the trigger props |
| `children` | `ReactNode` | — | Panel content |
| `panelClassName` | `string` | — | Class of the floating panel (it is drawn in the body, so a class on the trigger does not reach it) |
| `matchWidth` | `boolean \| { min?: number; max?: number }` | `false` | Give the panel the width of its trigger; `{ min, max }` keeps that width between two limits in px |
| `open` | `boolean` | — | Open state |
| `defaultOpen` | `boolean` | `false` | Initially open |
| `onOpenChange` | `(open: boolean) => void` | — | Called when it opens or closes |
| `placement` | `'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom-start'` | Where the panel appears |
| `label` | `string` | — | Accessible name of the panel |
| `motion` | `'off' \| 'basic' \| 'enhanced'` | `theme` | Animation of opening and closing: off, basic (a quick fade), or enhanced (the panel grows from its trigger and plays out when it closes); by default the Animations setting of the theme |
| `glass` | `boolean` | `theme` | Translucent, blurred panel; true or false overrides the Glass setting of the theme |

Live page: https://baseuikit.vercel.app/#/components/popover
