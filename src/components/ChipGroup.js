import { h, cx, useId } from '../react.js';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { Chip } from './Chip.js';
import { describe } from '../doc.js';

/**
 * A group of chips: a title, a wrapping container and a caption or an error. With `options` it is a Base UI ToggleGroup
 * (the value is the array of the selected `value`s); with `children` a free layout of chips.
 */
export function ChipGroup({ title, options, children, size = 'md', value, defaultValue, onValueChange, multiple = false, caption, error, className, ref, ...rest }) {
  const titleId = useId();
  return h('div', { className: cx('bui-chip-group__field', size === 'sm' && 'bui-chip-group__small', className) },
    title && h('div', { id: titleId, className: 'bui-chip-group__title' }, title),
    options
      ? h(ToggleGroup, { ref, className: 'bui-chip-group__list', multiple, value, defaultValue, onValueChange: (v) => onValueChange?.(v), 'aria-labelledby': title ? titleId : undefined, ...rest },
        options.map((o) => h(Chip, { key: o.value, value: o.value, size, disabled: o.disabled, icon: o.icon, avatar: o.avatar, counter: o.counter }, o.label)))
      : h('div', { ref, className: 'bui-chip-group__list' }, children),
    error ? h('span', { className: 'bui-chip-group__error', 'data-test': 'inputError' }, error) : caption && h('span', { className: 'bui-chip-group__caption' }, caption));
}
describe(ChipGroup, 'A group of chips: a title, a wrapping container and a caption or an error. With `options` a managed set (the value is an array of the selected values), with `children` a free layout.', {
  title: ['ReactNode', null, 'Group title'],
  options: ['Array<{ value: string; label: ReactNode; disabled?: boolean; icon?; avatar?; counter? }>', null, 'The chips of a managed group'],
  children: ['ReactNode', null, 'Chips of a free layout (without `options`)'],
  size: ["'md' | 'sm'", "'md'", 'Size of the chips and the title'],
  multiple: ['boolean', 'false', 'Several chips can be selected'],
  value: ['string[]', null, 'Selected values (controlled)'],
  defaultValue: ['string[]', null, 'Initially selected values (uncontrolled)'],
  onValueChange: ['(value: string[]) => void', null, 'Called with the new array of selected values'],
  caption: ['ReactNode', null, 'Caption under the group'],
  error: ['ReactNode', null, 'Error text under the group (replaces the caption)'],
  className: ['string', null, 'Extra class on the wrapper (merged)'],
  ref: ['Ref<HTMLDivElement>', null, 'Ref to the group'],
});
