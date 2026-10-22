# Popover

A floating panel anchored to a trigger. It opens over the page (drawn in the body, flipped and kept on screen), so it never pushes the content or gets clipped by a scrolling container.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `(props) => ReactElement` | — | Render function that receives the trigger props |
| `children` | `ReactNode` | — | Panel content |
| `open` | `boolean` | — | Open state |
| `defaultOpen` | `boolean` | `false` | Initially open |
| `onOpenChange` | `(open: boolean) => void` | — | Called when it opens or closes |
| `placement` | `'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom-start'` | Where the panel appears |
| `label` | `string` | — | Accessible name of the panel |
| `motion` | `'off' \| 'basic' \| 'enhanced'` | `theme` | Animation of opening and closing: off, basic (a quick fade), or enhanced (the panel grows from its trigger and plays out when it closes); by default the Animations setting of the theme |
| `glass` | `boolean` | `theme` | Translucent, blurred panel; true or false overrides the Glass setting of the theme |

Live page: http://localhost:8765/#/components/popover
