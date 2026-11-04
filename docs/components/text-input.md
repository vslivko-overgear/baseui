# Text Input

A single-line or multi-line text field with a floating label, built on the Base UI Input

A single-line or multi-line text field with a floating label

## Usage

**Do**

- Give every field a visible label
- Explain a validation error in words, next to the field: "Email must include @", with `status="error"` and a caption
- Size the field to the expected input
- Mark as required only what is

**Don't**

- Use the placeholder in place of a label
- Use a single-line field for long text: use the multi-line one
- Mark every field as required

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'filled' \| 'standard'` | `'filled'` | Visual variant: `filled` has a background (the main one), `standard` has none (specific scenarios, for example a chat) |
| `size` | `'md' \| 'sm'` | `'md'` | Size: md is 56px with 16px text, sm is 48px with 14px text |
| `label` | `ReactNode` | — | Field label. An empty field shows it centered like a placeholder; on focus or value it floats up (see floatingLabel) |
| `floatingLabel` | `boolean` | `true (false for type="search")` | Label behavior on focus/value: true floats it up in small text, false works like a placeholder and hides when a value is entered |
| `caption` | `ReactNode` | — | The only text under the field: a gray hint, and with `status` a colored message. Swapping “hint → error” is up to the caller |
| `status` | `'error' \| 'warning' \| 'success'` | — | Validation status: `error` is a red outline and caption plus `aria-invalid`; `warning` is amber; `success` is green |
| `loading` | `boolean` | `false` | Loading state: a skeleton instead of the content, input is blocked |
| `clearable` | `boolean` | `true unless the field has an `action`, a password toggle, several lines or is read-only` | Clear button (×): shown while the field is in focus and has a character, never out of focus. Set it to false to switch it off, or to true to have it with an action or on several lines |
| `onClear` | `() => void` | — | Called after the field is cleared with the × button. The field clears the value itself (an ordinary onChange with an empty value fires too) |
| `startIcon` | `ReactNode` | — | Icon at the start of the field (24px) |
| `action` | `ReactNode` | — | A custom action at the end of the field (any icon or button). Not shown where the action slot is taken: the visibility toggle of `type="password"` and the clear button |
| `actionLabel` | `string` | — | aria-label of the built-in action button (clear or password toggle); set it, or the button has no accessible name |
| `prefix` | `ReactNode` | — | Prefix before the value (for example a currency); visible on focus or value |
| `suffix` | `ReactNode` | — | Suffix after the value; visible on focus or value |
| `multiline` | `boolean` | `false` | Multiline mode: a textarea that auto-sizes to its content |
| `minRows` | `number` | `1` | Minimum number of textarea rows (multiline) |
| `maxRows` | `number` | — | Maximum number of textarea rows, then it scrolls (multiline) |
| `value` | `string` | — | Value (controlled) |
| `defaultValue` | `string` | — | Initial value (uncontrolled) |
| `onChange` | `(event) => void` | — | Called on every change |
| `type` | `string` | `'text'` | Input type; `password` adds the visibility toggle; `search` makes a search field: the label works as a placeholder and never floats, the icon is SearchSm at 24px, the clear button is on and the label defaults to Search |
| `disabled` | `boolean` | `false` | Disabled state |
| `className` | `string` | — | Extra class on the outer wrapper (merged) |
| `ref` | `Ref<HTMLInputElement \| HTMLTextAreaElement>` | — | Ref to the input element itself (input, or textarea with multiline) |

## Examples

- Actions
- Caption
- Multiline
- Placeholder Label
- Prefix Suffix
- Search
- Sizes
- States
- Types
- With Icon

Live page: https://baseuikit.vercel.app/#/components/text-input
