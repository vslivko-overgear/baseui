import { h, cx } from '../react.js';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Icon } from '../icons.js';
import { describe } from '../doc.js';

export const SIZE_DOC = "sm is a 20px control with a 14px label; md is 24px with a 16px label";
export const MOTION_DOC = 'Animations: off, basic (the state changes at once), or enhanced (the check mark is drawn, the box and the dot pop); by default the Animations setting of the theme';

/**
 * A checkbox: a box and an optional label on top of the Base UI Checkbox, which brings the state (data-checked, data-indeterminate,
 * data-disabled), the keyboard, the hidden input of a form and the field context.
 * If `label` is not set, give the checkbox a name with `aria-label` or `aria-labelledby`.
 */
export function Checkbox({ label, error, size = 'md', motion, className, ref, ...rest }) {
  return h('span', { className: cx('bui-checkbox__field', size === 'sm' && 'bui-check--sm', className) },
    h('label', { 'data-slot': 'checkbox-root', className: 'bui-checkbox' },
      h(BaseCheckbox.Root, { ref, 'data-slot': 'checkbox-box', className: 'bui-checkbox__box', 'aria-invalid': error ? true : undefined, 'data-size': size, 'data-motion': motion, ...rest },
        h(BaseCheckbox.Indicator, { 'data-slot': 'checkbox-indicator', className: 'bui-checkbox__indicator' },
          h(Icon, { name: 'check', size: 16, strokeWidth: 3 }), h(Icon, { name: 'minus', size: 16, strokeWidth: 3 }))),
      label && h('span', null, label)),
    error && h('span', { className: 'bui-checkbox__error', 'data-test': 'inputError' }, error));
}
describe(Checkbox, 'A box that turns one option on or off, with an optional label. The error is text under the box: it has no outline.', {
  label: ['ReactNode', null, 'Text label to the right of the checkbox. Without it pass `aria-label` or `aria-labelledby`'],
  error: ['ReactNode', null, 'Error text under the checkbox; marks it invalid for screen readers. There is no outline: only the text'],
  size: ["'sm' | 'md'", "'md'", SIZE_DOC],
  motion: ["'off' | 'basic' | 'enhanced'", 'theme', MOTION_DOC],
  checked: ['boolean', null, 'Checked state (controlled)'],
  defaultChecked: ['boolean', 'false', 'Initial state (uncontrolled)'],
  onCheckedChange: ['(checked: boolean, event) => void', null, 'Called when the state changes'],
  indeterminate: ['boolean', 'false', 'A mixed state, drawn as a dash'],
  disabled: ['boolean', 'false', 'Disabled state'],
  readOnly: ['boolean', 'false', 'The state cannot be changed'],
  required: ['boolean', 'false', 'Required in a form'],
  name: ['string', null, 'Name in a native form'],
  value: ['string', null, 'Value submitted when the box is checked'],
  className: ['string', null, 'Extra class on the wrapper (merged)'],
  ref: ['Ref<HTMLElement>', null, 'Ref to the box (a `span role="checkbox"`)'],
});
