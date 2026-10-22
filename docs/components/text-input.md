# Text Input

A text field on the shared shell `FieldShell` (Base UI Field): the shell gives
the box, floating label, caption and a11y wiring, TextField is the input/textarea itself and
the input logic (actions, prefix/suffix, auto-sizing multiline).

Without `label`, the accessible name is set by `aria-label`/`aria-labelledby`, otherwise the field
is unnamed for screen readers.

`status` + `caption` are drawn by the component itself, so it works without react-hook-form;
in forms they are set by `TextFieldField` (the form error wins over `status`).

A single-line or multi-line text field with a floating label.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'filled' \| 'standard'` | `'filled'` | Visual variant: `filled` has a background (the main one), `standard` has none (specific scenarios, for example chat). @default 'filled' |
| `size` | `'md' \| 'sm'` | `'md'` | Size: md is 56px with 16px text, sm is 48px with 14px text. @default 'md' |
| `label` | `ReactNode` | — | Field label. An empty field shows it centered like a placeholder; on focus or value it floats up (see floatingLabel). |
| `floatingLabel` | `boolean` | `true` | Label behavior on focus/value: true floats it up in small text, false works like a placeholder and hides when a value is entered. @default true |
| `caption` | `ReactNode` | — | The only text under the field: a gray hint, and with `status` a colored message. Swapping “hint → error” is up to the caller (the RHF wrapper does it itself). |
| `status` | `FieldStatus` | — | Validation status: `error` is a red outline/caption + `aria-invalid`; `warning` is amber; `success` is green (no `aria-invalid`). |
| `loading` | `boolean` | `false` | Loading state: a skeleton instead of the content, input is blocked. |
| `clearable` | `boolean` | `false` | Clear button (×) once there is a value. |
| `onClear` | `() => void` | — | Callback after the field is cleared with the × button. The component clears the value itself (a regular onChange with an empty value fires too). |
| `startIcon` | `ReactNode` | — | Icon at the start of the field (24px). |
| `action` | `ReactNode` | — | A custom action at the end of the field (any icon/button). Not rendered if the action slots are taken: for `type="password"` the visibility toggle, for `clearable` the clear button. |
| `actionLabel` | `string` | — | aria-label of the built-in action button (clear / password toggle). Without it the button has no accessible name: set it for a11y. |
| `prefix` | `ReactNode` | — | Prefix before the value (for example, a currency). Visible on focus or value. |
| `suffix` | `ReactNode` | — | Suffix after the value. Visible on focus or value. |
| `multiline` | `boolean` | `false` | Multiline mode: a textarea that auto-sizes to its content. |
| `minRows` | `number` | `1` | Minimum number of textarea rows (multiline). @default 1 |
| `maxRows` | `number` | — | Maximum number of textarea rows, then it scrolls (multiline). @default unlimited |
| `className` | `string` | — | Extra class on the outer wrapper (merged). |
| `ref` | `Ref<HTMLInputElement \| HTMLTextAreaElement>` | — | Ref to the input element itself (input, or textarea with multiline). |
| `type` | `` | `'text'` |  |
| `disabled` | `` | `false` |  |

## Examples

- Actions
- Caption
- Multiline
- Placeholder Label
- Prefix Suffix
- Sizes
- States
- Types
- With Icon

Live page: http://localhost:8765/#/components/text-input
