# Dialog

The dialog: a centered window on a wide screen and a bottom sheet on small ones, built on the Base UI Dialog. The sheet can be dragged down by its header to close. A control inside it with `data-dialog-close` (a Close or Done button) closes the dialog without wiring an onClick

A modal window for focused content. On small screens it becomes a bottom sheet

## Usage

**Do**

- Close it from a button with `data-dialog-close` (Done, Close, Cancel): the dialog closes by itself, a dialog in a dialog closes only its own
- Give it a clear title, so that a person knows at once what it asks
- Keep it to a single task, with a primary and a secondary action
- Use it for content that needs focus: a form, a choice, a detail

**Don't**

- Use it for a simple message: show it inline or as a Toast
- Open a dialog from inside a dialog: make it steps in one dialog
- Let it grow into a page: if the content is long or complex, use a page

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Open state (controlled) |
| `defaultOpen` | `boolean` | `false` | Initially open (uncontrolled) |
| `onOpenChange` | `(open: boolean, details) => void` | — | Called when the dialog opens or closes |
| `title` | `ReactNode` | — | Title of the window |
| `subtitle` | `ReactNode` | — | Subtitle. Shown only together with the title and always takes one line |
| `header` | `'close' \| 'close-and-back' \| 'title-only' \| false` | `'close'` | Header variant: close, back and close, title only, or no header |
| `height` | `'content' \| 'viewport'` | `'content'` | Height by content or the whole available viewport |
| `floating` | `boolean` | `theme` | A floating sheet on small screens: margins at the bottom and the sides, rounded on every side; by default it follows the Floating setting of the theme. On a wide screen the dialog already floats in the middle |
| `children` | `ReactNode` | — | Main content of the window |
| `primaryAction` | `ReactNode` | — | The primary action, usually a Button with variant="primary" |
| `secondaryAction` | `ReactNode` | — | The secondary action, usually a Button with variant="secondary" |
| `onBack` | `() => void` | — | Handler of the back button for header="close-and-back" |
| `swipeToClose` | `boolean` | `true` | Swipe down on the header to close the bottom sheet (touch and mouse drag, narrow screens only) |
| `closeLabel` | `string` | `'Close'` | Accessible name of the close button |
| `backLabel` | `string` | `'Back'` | Accessible name of the back button |
| `aria-label` | `string` | — | Accessible name of the dialog when there is no visual title |
| `className` | `string` | — | Extra class of the popup |
| `contentClassName` | `string` | — | Extra class of the content part |
| `portalContainer` | `HTMLElement` | — | Container of the portal; the body by default |
| `keepMounted` | `boolean` | — | Keep the portal mounted after closing |
| `initialFocus` | `RefObject \| boolean \| function` | — | Initial focus after opening |
| `finalFocus` | `RefObject \| boolean \| function` | — | Focus after closing |
| `modal` | `boolean` | `true` | Block the page behind the dialog |
| `ref` | `Ref<HTMLDivElement>` | — | Ref to the popup |

## Examples

- Close And Back
- Keyboard
- Scroll
- Title Only
- Viewport
- Without Header

Live page: https://baseuikit.vercel.app/#/components/dialog
