import { h, cx } from '../react.js';
import { describeWrapper } from '../doc.js';
import { Checkbox as BaseCheckbox, CheckboxGroup as BaseCheckboxGroup, Radio as BaseRadio, RadioGroup as BaseRadioGroup } from '../base.js';

const DOC = {
  size: ["'sm' | 'md'", "'md'", 'sm is a 20px control with a 14px label; md is 24px with a 16px label'],
  motion: ["'off' | 'basic' | 'enhanced'", 'theme', 'Animations: off, basic (the state changes at once), or enhanced (the check mark is drawn, the box and the dot pop); by default the Animations setting of the theme'],
};

/** Adds `size` and `motion` to a compiled checkbox or radio component: the size class and data-motion drive the CSS. */
function withSizeAndMotion(Base, name) {
  const C = ({ size = 'md', motion, className, ...rest }) =>
    h(Base, { ...(name === 'CheckboxGroup' && { 'data-slot': 'checkbox-group' }), 'data-size': size, 'data-motion': motion, className: cx(size === 'sm' && 'bui-check--sm', className), ...rest });
  C.displayName = name;
  return describeWrapper(C, Base, DOC);
}

export const Checkbox = withSizeAndMotion(BaseCheckbox, 'Checkbox');
export const CheckboxGroup = withSizeAndMotion(BaseCheckboxGroup, 'CheckboxGroup');
export const Radio = withSizeAndMotion(BaseRadio, 'Radio');
export const RadioGroup = withSizeAndMotion(BaseRadioGroup, 'RadioGroup');
