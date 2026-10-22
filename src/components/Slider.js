import { h, cx, useControllable, useId } from '../react.js';
import { describe } from '../doc.js';

export function Slider({ value, defaultValue = 0, onValueChange, min = 0, max = 100, step = 1, label, showValue = false, disabled = false, className, ...rest }) {
  const [v, setV] = useControllable(value, defaultValue, onValueChange);
  const id = useId();
  const pct = ((v - min) / (max - min)) * 100;
  return h('div', { 'data-slot': 'slider', className: cx('bui-slider', disabled && 'bui-slider--disabled', className) },
    (label || showValue) && h('div', { 'data-slot': 'slider-head', className: 'bui-slider__head' }, h('label', { htmlFor: id }, label), showValue && h('output', { htmlFor: id }, v)),
    h('input', {
      id, type: 'range', min, max, step, value: v, disabled, style: { '--bui-slider-pct': `${pct}%` },
      onChange: (e) => setV(Number(e.target.value)), ...rest,
    }));
}
describe(Slider, 'Selects a number in a range.', {
  value: ['number', null, 'Value'],
  defaultValue: ['number', '0', 'Initial value'],
  onValueChange: ['(value: number) => void', null, 'Called when the value changes'],
  min: ['number', '0', 'Minimum'], max: ['number', '100', 'Maximum.'], step: ['number', '1', 'Step.'],
  label: ['ReactNode', null, 'Label above the track'],
  showValue: ['boolean', 'false', 'Show the current value'],
  disabled: ['boolean', 'false', 'Disabled state'],
});
