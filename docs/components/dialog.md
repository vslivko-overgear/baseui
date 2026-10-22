# Dialog

A universal modal window on top of Base UI Dialog.
On mobile it sticks to the bottom, on desktop it centers automatically.

A modal window for focused content. On small screens it becomes a bottom sheet.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Modal window title. |
| `subtitle` | `ReactNode` | — | Subtitle. Shown only together with title and always takes one line. |
| `header` | `(typeof MODAL_HEADER)[keyof typeof MODAL_HEADER] \| false` | `'close'` | Header variant. @default 'close' |
| `height` | `'content' \| 'viewport'` | `'content'` | Height by content or the whole available viewport. @default 'content' |
| `children` | `ReactNode` | — | Main content of the modal window. |
| `primaryAction` | `ReactNode` | — | Any primary action button, usually Button variant="primary". |
| `secondaryAction` | `ReactNode` | — | Any secondary action button, usually Button variant="secondary". |
| `onBack` | `() => void` | — | Handler of the “Back” button for header="close-and-back". |
| `swipeToClose` | `boolean` | `true` | Swipe down on the header to close the bottom sheet (touch and mouse drag, narrow screens only). @default true |
| `closeLabel` | `string` | `'Close'` | Accessible name of the close button. @default 'Close' |
| `backLabel` | `string` | `'Back'` | Accessible name of the “Back” button. @default 'Back' |
| `aria-label` | `string` | — | Accessible name of the dialog when there is no visual title. |
| `className` | `string` | — | Extra class of the popup. |
| `contentClassName` | `string` | — | Extra class of the content part. |
| `portalContainer` | `Dialog.Portal.Props['container']` | — | Container for the React Portal. body by default. |
| `keepMounted` | `boolean` | — | Keep the Portal mounted after closing. @default false |
| `initialFocus` | `Dialog.Popup.Props['initialFocus']` | — | Initial focus after opening. |
| `finalFocus` | `Dialog.Popup.Props['finalFocus']` | — | Focus after closing. |
| `ref` | `Ref<HTMLDivElement>` | — | Ref to the popup. |
| `defaultOpen` | `` | `false` |  |
| `modal` | `` | `true` |  |

## Examples

- Close And Back
- Keyboard
- Scroll
- Title Only
- Viewport
- Without Header

Live page: http://localhost:8765/#/components/dialog
