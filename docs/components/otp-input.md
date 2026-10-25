# OTP Input

A one-time code field. It checks the code through onComplete and shows the states of that check: verifying, error (the row shakes) and success. Digits arrive with a short animation and the focus ring slides between the cells; both follow the Animations setting.

A field for entering a one-time code.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `length` | `4 \| 5 \| 6` | `6` | Number of cells |
| `groups` | `number[]` | — | Sizes of the groups the cells are split into, for example [3, 3]; a gap and a separator open between groups |
| `value` | `string` | — | The code (controlled) |
| `defaultValue` | `string` | `''` | Initial code (uncontrolled) |
| `onValueChange` | `(value: string) => void` | — | Called on every change; ignored while the code is being verified |
| `onComplete` | `(code: string) => void \| boolean \| Promise<boolean \| void>` | — | Called when every cell is filled. A promise puts the field in the verifying state until it settles; false or a rejection is an error, anything else a success |
| `status` | `'idle' \| 'verifying' \| 'error' \| 'success'` | — | Sets the state from outside; by default it follows onComplete |
| `autoReset` | `boolean` | `true` | Clear the cells after an error and put the cursor in the first one |
| `captureTyping` | `boolean` | `false` | Typing a character anywhere on the page goes into the field, unless focus is in another editable control |
| `validationType` | `'numeric' \| 'alpha' \| 'alphanumeric' \| 'none'` | `'numeric'` | Characters the cells accept; any other key shakes the row |
| `mask` | `boolean` | `false` | Hide the typed characters |
| `error` | `ReactNode` | — | Error text under the cells; marks all cells invalid. With status error and no text, errorText is shown |
| `errorText` | `string` | `'Invalid code'` | Text of the error state when error is not given |
| `verifyingText` | `string` | `'Verifying your code…'` | Announced to screen readers while verifying |
| `successText` | `string` | `'Code verified'` | Announced to screen readers after a success |
| `motion` | `'off' \| 'basic' \| 'enhanced'` | `theme` | The ring slides and the cells pulse while verifying unless off; the digits arrive and the row shakes on enhanced |
| `disabled` | `boolean` | `false` | Disabled state |

## Examples

- Failed
- Grouped
- Lengths
- Masked
- Verified
- Verifying

Live page: http://localhost:8765/#/components/otp-input
