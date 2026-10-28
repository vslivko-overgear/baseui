import { h, cx } from '../react.js';
import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { describe } from '../doc.js';

/**
 * A switch: an instant on/off of an independent setting. A track, a thumb and an optional label on top of the Base UI Switch,
 * which brings the state (data-checked, data-disabled), the keyboard, the hidden input of a form and the field context.
 * If `label` is not set, give the switch a name with `aria-label` or `aria-labelledby`.
 */
export function Switch({ label, size = 'md', shape, error, className, ref, ...rest }) {
  return h('span', { 'data-slot': 'switch', 'data-size': size, className: cx('bui-switch__field', shape && `bui-shape-${shape}`, className) },
    h('label', { 'data-slot': 'switch-label', className: 'bui-switch' },
      h(BaseSwitch.Root, { ref, 'data-slot': 'switch-track', className: 'bui-switch__track', 'aria-invalid': error ? true : undefined, ...rest },
        h(BaseSwitch.Thumb, { 'data-slot': 'switch-thumb', className: 'bui-switch__thumb' })),
      label && h('span', null, label)),
    error && h('span', { 'data-slot': 'switch-error', className: 'bui-switch__error' }, error));
}
describe(Switch, 'An instant on/off of an independent setting: a track, a thumb and an optional label. Several switches are independent boolean fields; to choose N of M use a Checkbox Group.', {
  label: ['ReactNode', null, 'Text label to the right of the switch. Without it pass `aria-label` or `aria-labelledby`'],
  size: ["'sm' | 'md' | 'lg'", "'md'", 'Size: the track is 44×20, 52×24 or 60×28'],
  shape: ["'rounded' | 'circle'", 'theme', 'rounded gives the track and the thumb a radius that follows the size; circle makes them pills. By default the Shape setting of the theme'],
  error: ['ReactNode', null, 'Error text under the switch; marks it invalid for screen readers. There is no outline: only the text'],
  checked: ['boolean', null, 'Checked state (controlled)'],
  defaultChecked: ['boolean', 'false', 'Initial state (uncontrolled)'],
  onCheckedChange: ['(checked: boolean, event) => void', null, 'Called when the state changes'],
  disabled: ['boolean', 'false', 'Disabled state'],
  readOnly: ['boolean', 'false', 'The state cannot be changed'],
  required: ['boolean', 'false', 'Required in a form'],
  name: ['string', null, 'Name in a native form'],
  value: ['string', null, 'Value submitted when the switch is on'],
  className: ['string', null, 'Extra class on the wrapper (merged)'],
  ref: ['Ref<HTMLElement>', null, 'Ref to the track (a `span role="switch"`)'],
});
