import { h, cx, useState } from '../react.js';
import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { Checkbox, SIZE_DOC, MOTION_DOC } from './Checkbox.js';
import { describe } from '../doc.js';

/** A group of checkboxes on top of the Base UI CheckboxGroup: the value is the array of the checked `value`s. */
export function CheckboxGroup({ title, parent, options, caption, error, size = 'md', motion, className, ref, id, 'data-testid': testId, value, defaultValue, onValueChange, onOptionChange, ...rest }) {
  const [inner, setInner] = useState(defaultValue ?? []);
  const current = value ?? inner;
  const change = (next) => { setInner(next); onValueChange?.(next); };
  const checked = options.filter((o) => current.includes(o.value)).length;
  const all = checked === options.length;
  return h('div', { className: cx('bui-checkbox-group__field', size === 'sm' && 'bui-check--sm', className), id, 'data-testid': testId },
    title && h('div', { className: 'bui-checkbox-group__title' }, title),
    h(BaseCheckboxGroup, { ref, 'data-slot': 'checkbox-group', 'data-size': size, 'data-motion': motion, className: 'bui-checkbox-group__list', value: current, onValueChange: change, ...rest },
      parent && h(Checkbox, { label: parent, size, motion, checked: all, indeterminate: !!checked && !all, onCheckedChange: () => change(all ? [] : options.map((o) => o.value)) }),
      options.map((o) => h(Checkbox, {
        key: o.value, name: o.value, label: o.label, size, motion, disabled: o.disabled, 'data-testid': o.dataTestId,
        onCheckedChange: (c) => onOptionChange?.(o, c), className: cx(parent && 'bui-checkbox-group__subgroup'),
      }))),
    error ? h('span', { className: 'bui-checkbox-group__error', 'data-test': 'inputError' }, error) : caption && h('span', { className: 'bui-checkbox-group__caption' }, caption));
}
describe(CheckboxGroup, 'A group of checkboxes: the value is an array of the checked `value`s. The error is a message under the group; the boxes do not turn red.', {
  title: ['ReactNode', null, 'Group title'],
  options: ['Array<{ value: string; label: ReactNode; disabled?: boolean }>', null, 'The checkboxes of the group'],
  value: ['string[]', null, 'Checked values (controlled)'],
  defaultValue: ['string[]', '[]', 'Initially checked values (uncontrolled)'],
  onValueChange: ['(value: string[]) => void', null, 'Called with the new array of checked values'],
  onOptionChange: ['(option, checked: boolean) => void', null, 'Called for the changed option together with `onValueChange`, with its new state; not for a click on `parent`'],
  parent: ['ReactNode', null, 'Label of a parent “select all” checkbox. It toggles all options, shows the mixed state on a partial selection and indents the options. It is not part of the value'],
  caption: ['ReactNode', null, 'Caption under the group'],
  error: ['ReactNode', null, 'Error text under the group (replaces the caption). The boxes do not turn red: only the message'],
  size: ["'sm' | 'md'", "'md'", SIZE_DOC],
  motion: ["'off' | 'basic' | 'enhanced'", 'theme', MOTION_DOC],
  disabled: ['boolean', 'false', 'Disables every checkbox of the group'],
  className: ['string', null, 'Extra class on the wrapper (merged)'],
  id: ['string', null, 'id of the outer container, for example to scroll to the error of the whole group'],
  ref: ['Ref<HTMLDivElement>', null, 'Ref to the group (`<div role="group">`)'],
});
