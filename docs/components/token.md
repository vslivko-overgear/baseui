# Token

A chip for selection or indication: a Base UI Toggle with a size, a status and slots. With `action` it is a button, removable or plain

A small token that can be selected or removed

## Usage

**Do**

- Use it for a filter or a tag a person switches on (`pressed`) or takes away (`action`)
- Keep the label to one to three words
- Use `status` only for a real state, success or error

**Don't**

- Use a token for a main action or for navigation: use Button or Link
- Hide the label unless the icon is universally understood

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'md' \| 'sm'` | `'md'` | Size |
| `status` | `'success' \| 'error'` | — | Semantic status: colors the fill |
| `icon` | `ReactNode` | — | Leading icon; it follows the text color |
| `avatar` | `ReactNode` | — | Leading avatar instead of the icon: reduces the left padding. The Avatar must fit the box of the chip: `sm` with `md`, `xsm` with `sm` |
| `counter` | `ReactNode` | — | Counter to the right of the label |
| `endIcon` | `ReactNode` | — | Any icon at the right end of the chip (a chevron for a chip that opens a menu); it follows the text color |
| `action` | `boolean \| 'press'` | `false` | Not a toggle. `true`: a removable chip with a cross, a click calls `onAction`. `press`: a plain button, a click calls `onClick` |
| `onAction` | `() => void` | — | Called when a removable chip is pressed |
| `actionLabel` | `string` | — | Accessible name of an `action` chip without visible text |
| `pressed` | `boolean` | — | Selected state (controlled) |
| `defaultPressed` | `boolean` | `false` | Initially selected (uncontrolled) |
| `onPressedChange` | `(pressed: boolean) => void` | — | Called when the selected state changes |
| `value` | `string` | — | The value of the chip in a TokenGroup |
| `disabled` | `boolean` | `false` | Disabled state |
| `children` | `ReactNode` | — | Label |
| `className` | `string` | — | Extra class (merged) |
| `ref` | `Ref<HTMLButtonElement>` | — | Ref to the button |

## Examples

- Removable
- Slots
- States
- Status

Live page: https://baseuikit.vercel.app/#/components/token
