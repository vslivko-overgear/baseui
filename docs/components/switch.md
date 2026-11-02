# Switch

An instant on/off of an independent setting: a track, a thumb and an optional label. Several switches are independent boolean fields; to choose N of M use a Checkbox Group

A control that turns a setting on or off immediately

## Usage

**Do**

- Use it for a setting that applies at once, with no save
- Give it a short label that names the setting

**Don't**

- Use it for an option that needs a form to be submitted: use Checkbox
- Use it for more than on and off

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Text label to the right of the switch. Without it pass `aria-label` or `aria-labelledby` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size: the track is 32×20, 40×24 or 48×28, the thumb a circle 4px from the edge |
| `shape` | `'rounded' \| 'circle'` | `'circle'` | circle (default) is the classic switch: a pill track and a round thumb; rounded gives a rounded rectangle and an oval thumb |
| `error` | `ReactNode` | — | Error text under the switch; marks it invalid for screen readers. There is no outline: only the text |
| `checked` | `boolean` | — | Checked state (controlled) |
| `defaultChecked` | `boolean` | `false` | Initial state (uncontrolled) |
| `onCheckedChange` | `(checked: boolean, event) => void` | — | Called when the state changes |
| `disabled` | `boolean` | `false` | Disabled state |
| `readOnly` | `boolean` | `false` | The state cannot be changed |
| `required` | `boolean` | `false` | Required in a form |
| `name` | `string` | — | Name in a native form |
| `value` | `string` | — | Value submitted when the switch is on |
| `className` | `string` | — | Extra class on the wrapper (merged) |
| `ref` | `Ref<HTMLElement>` | — | Ref to the track (a `span role="switch"`) |

## Examples

- States
- With Error
- With Label

Live page: https://baseuikit.vercel.app/#/components/switch
