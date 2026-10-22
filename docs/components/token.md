# Token

A chip on top of the headless Base UI Toggle: an interactive element “for selection
or indication”. `size` (`md` / `sm`),
the selected state comes from Base UI `pressed` / `defaultPressed` / `onPressedChange`
(in a group, through `ChipGroup`). `status` (`success` / `error`) colors
the fill. Slots: `icon` or `avatar` on the left,
`counter` on the right. The `action` mode turns the chip into a remove button
(`true`: a cross + `onAction`) or a plain button (`'press'`). Styles use `--baseui-*` tokens (theme via `data-theme`).

A chip is always a `<button>`. For pure indication do not pass a handler; if
there is no visible text, add `aria-label`.

A small chip that can be selected or removed.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'md' \| 'sm'` | `'md'` | Size. @default 'md' |
| `status` | `'error' \| 'success'` | — | Semantic status: colors the fill. |
| `icon` | `ReactNode` | — | Leading icon. |
| `avatar` | `ReactNode` | — | Leading avatar instead of the icon: reduces the left padding. The chip reserves a fixed box for the slot, so the `<Avatar>` must match: `size="sm"` (32px) with `size="md"`, `size="xsmall"` (24px) with `size="sm"`. |
| `counter` | `ReactNode` | — | Counter to the right of the label. |
| `action` | `boolean \| 'press'` | `false` | Not a toggle. `true`: a removable chip with a cross; a click calls `onAction`. `'press'`: a plain button without a cross or a selected state; a click calls `onClick`. The Base UI Toggle props (`pressed` / `defaultPressed` / `onPressedChange`) do not apply. |
| `onAction` | `() => void` | — | Remove callback for `action`. |
| `actionLabel` | `string` | — | Accessible name of the remove button for `action` (the visible label by default). |
| `children` | `ReactNode` | — | Label text. |
| `style` | `CSSProperties` | — | Inline styles on the root element. The Base UI function form is not supported. |
| `className` | `string` | — | Extra class (merged). The Base UI function form is not supported. |
| `ref` | `Ref<HTMLButtonElement>` | — | Ref to the button element (React 19: a regular prop, no forwardRef). |

## Examples

- Action
- Slots
- States
- Status
- With Avatar
- With Icon

Live page: http://localhost:8765/#/components/token
