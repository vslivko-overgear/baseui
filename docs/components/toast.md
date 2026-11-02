# Toast

Shows brief notifications: a message, an optional action and a close button. Call `useToast()` to add one

## Usage

**Do**

- Keep it to a few words that say what happened: "Changes saved"
- Add a short undo for a reversible action
- Use the error type for failures that need attention but not at once: it stays until closed

**Don't**

- Use a toast for an error that blocks the person: use Banner
- Put long or multi-line content in it: it goes away before it is read
- Show form validation errors as toasts: show them next to the field

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `placement` | `'bottom-right' \| 'bottom-center' \| 'top-right' \| 'top-center'` | `'bottom-right'` | Where the stack appears |
| `limit` | `number` | `4` | Maximum simultaneous toasts |
| `glass` | `boolean` | `theme` | Translucent, blurred base toasts; also a toast() option; true or false overrides the Glass setting of the theme |
| `message` | `ReactNode` | — | toast() option: the text |
| `variant` | `'base' \| 'inverse'` | `'base'` | toast() option: base is a surface with a shadow, inverse is dark (light in a dark theme) without a shadow |
| `status` | `'neutral' \| 'success' \| 'error' \| 'info'` | `'neutral'` | toast() option: the icon; neutral has none. Settings: none, success, error, info, or custom (a custom icon) |
| `icon` | `ReactNode` | — | toast() option: a custom icon instead of the status one |
| `action` | `{ label: string; onClick?: () => void }` | — | toast() option: an optional button; it closes the toast |
| `duration` | `number` | `5000` | toast() option: milliseconds before it closes; 0 keeps it open |
| `promise` | `(promise, { loading, success?, error? }) => Promise` | — | useToast() method: a toast that follows a promise. It shows a spinner and `loading` while the promise runs, then switches to success or error (a message or a function of the result / error) and closes by `duration`. Returns the promise |

Live page: https://baseuikit.vercel.app/#/components/toast
