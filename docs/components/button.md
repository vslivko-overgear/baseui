# Button

Triggers an action or navigates. A label that does not fit in the width of the button is cut with an ellipsis, never wrapped

## Usage

**Do**

- Give one primary button to the most important action of a view; use secondary or ghost for the rest
- Label it with the action: "Save changes", "Delete account", "Send invite"
- Show progress for an action that takes time: `loading`, or `clickAction` for an async handler
- Use IconButton for a button with only an icon
- Beside an input, take the height and the text size of the input: size lg and textSize 16 for a 56px input, size md and textSize 14 for a 48px one

**Don't**

- Put more than one primary button in the same view
- Use the destructive variant for something irreversible without a confirmation step (AlertDialog)
- Use a button to go to another page: pass `href`, or use Link. Buttons act, links navigate
- Label it "OK", "Submit" or "Click here"

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Visible text and accessible name |
| `children` | `ReactNode` | — | Visible content in place of `label` |
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'destructive'` | `'secondary'` | Visual style |
| `size` | `'xsm' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Height and padding: 32 / 40 / 48 / 56 px |
| `textSize` | `12 \| 14 \| 16 \| 20` | `the first of the size` | Text size inside the size: xsm 12; sm 14 or 12; md 16 or 14; lg 16 or 20. Another value falls back to the default of the size. A button in a row with an input takes the input text size and height |
| `disabled` | `boolean` | `false` | Disables the button |
| `loading` | `boolean` | `false` | Shows a spinner and blocks interaction |
| `icon` | `ReactNode` | — | Icon before the label |
| `endContent` | `ReactNode` | — | Content after the label, e.g. a chevron |
| `shape` | `'rounded' \| 'circle'` | `'rounded'` | circle makes a pill (a circle for an icon button); rounded follows the theme radius. `data-shape="circle"` on a parent does it for all buttons inside |
| `width` | `number \| string` | — | Number is px; `"100%"` fills the container |
| `tooltip` | `string \| false` | — | Hover text; false turns the tooltip off (an icon-only button shows its label by default) |
| `href` | `string` | — | Renders a link |
| `onClick` | `(event) => void` | — | Click handler |
| `clickAction` | `(event) => void \| Promise<void>` | — | Async action; shows loading while pending |

## Examples

- Icons
- Loading
- Sizes
- Text Sizes
- Variants
- Width

Live page: https://baseuikit.vercel.app/#/components/button
