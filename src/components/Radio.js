import { h, cx } from '../react.js';
import { Radio as BaseRadio } from '@base-ui/react/radio';
import { describe } from '../doc.js';
import { SIZE_DOC, MOTION_DOC } from './Checkbox.js';

/**
 * A radio button: a circle and an optional label on top of the Base UI Radio. It lives inside a RadioGroup, which checks it by the value.
 * If `label` is not set, give the radio a name with `aria-label` or `aria-labelledby`.
 */
export function Radio({ label, size = 'md', motion, className, ref, ...rest }) {
  return h('label', { 'data-slot': 'radio-root', className: cx('bui-radio', size === 'sm' && 'bui-check--sm', className) },
    h(BaseRadio.Root, { ref, 'data-slot': 'radio-button', className: 'bui-radio__button', 'data-size': size, 'data-motion': motion, ...rest },
      h(BaseRadio.Indicator, { 'data-slot': 'radio-indicator', className: 'bui-radio__indicator' })),
    label && h('span', null, label));
}
describe(Radio, 'A radio button for a RadioGroup: it is checked by the group value, it has no `checked` of its own.', {
  value: ['string', null, 'The value of this option in the group'],
  label: ['ReactNode', null, 'Text label to the right of the radio button. Without it pass `aria-label` or `aria-labelledby`'],
  size: ["'sm' | 'md'", "'md'", SIZE_DOC],
  motion: ["'off' | 'basic' | 'enhanced'", 'theme', MOTION_DOC],
  disabled: ['boolean', 'false', 'Disabled state'],
  className: ['string', null, 'Extra class on the wrapper (merged)'],
  ref: ['Ref<HTMLElement>', null, 'Ref to the radio (a `span role="radio"`)'],
});
