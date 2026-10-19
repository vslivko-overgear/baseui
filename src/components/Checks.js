import { h, cx } from '../react.js';
import { Checkbox as BaseCheckbox, CheckboxGroup as BaseCheckboxGroup, Radio as BaseRadio, RadioGroup as BaseRadioGroup } from '../base.js';

const DOC = {
  size: { required: false, tsType: { name: "'sm' | 'md'", raw: "'sm' | 'md'" }, defaultValue: { value: "'md'", computed: false }, description: 'sm is a 20px control with a 14px label; md is 24px with a 16px label' },
  motion: { required: false, tsType: { name: "'off' | 'basic' | 'enhanced'", raw: "'off' | 'basic' | 'enhanced'" }, defaultValue: { value: 'theme', computed: false }, description: 'Animations: off, basic (the state changes at once), or enhanced (the check mark is drawn, the box and the dot pop); by default the Animations setting of the theme' },
};

/** Adds `size` and `motion` to a compiled checkbox or radio component; the classes drive the CSS. */
function withSizeAndMotion(Base, name) {
  const C = ({ size = 'md', motion, className, ...rest }) =>
    h(Base, { className: cx(size === 'sm' && 'bui-check--sm', motion && `bui-motion--${motion}`, className), ...rest });
  C.displayName = name;
  const doc = Base.__docgenInfo || { description: '', props: {} };
  C.__docgenInfo = { ...doc, props: { ...doc.props, ...DOC } };
  return C;
}

export const Checkbox = withSizeAndMotion(BaseCheckbox, 'Checkbox');
export const CheckboxGroup = withSizeAndMotion(BaseCheckboxGroup, 'CheckboxGroup');
export const Radio = withSizeAndMotion(BaseRadio, 'Radio');
export const RadioGroup = withSizeAndMotion(BaseRadioGroup, 'RadioGroup');
