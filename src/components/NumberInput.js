import { h, useControllable } from '../react.js';
import { TextField } from '../base.js';
import { describe } from '../doc.js';

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function NumberInput({ value, defaultValue, onValueChange, min = -Infinity, max = Infinity, step = 1, label, size, ...rest }) {
  const [v, setV] = useControllable(value, defaultValue ?? '', onValueChange);
  const bump = (d) => setV(clamp((Number(v) || 0) + d * step, min, max));
  const stepper = h('span', { 'data-slot': 'stepper-btns', className: 'bui-stepper-btns' },
    h('button', { type: 'button', 'aria-label': 'Decrease', tabIndex: -1, onClick: () => bump(-1), disabled: Number(v) <= min }, '−'),
    h('button', { type: 'button', 'aria-label': 'Increase', tabIndex: -1, onClick: () => bump(1), disabled: Number(v) >= max }, '+'));
  return h(TextField, {
    label, size, inputMode: 'decimal', value: String(v), action: stepper,
    onChange: (e) => { const raw = e.target.value; setV(raw === '' || raw === '-' ? raw : Number.isNaN(Number(raw)) ? v : clamp(Number(raw), min, max)); },
    onKeyDown: (e) => { if (e.key === 'ArrowUp') { e.preventDefault(); bump(1); } if (e.key === 'ArrowDown') { e.preventDefault(); bump(-1); } },
    ...rest,
  });
}
describe(NumberInput, 'A text input for numbers.', {
  value: ['number | string', null, 'Value'],
  defaultValue: ['number', null, 'Initial value'],
  onValueChange: ['(value: number | string) => void', null, 'Called when the value changes'],
  min: ['number', null, 'Minimum'], max: ['number', null, 'Maximum.'], step: ['number', '1', 'Step.'],
  label: ['string', null, 'Floating label'],
  size: ["'sm' | 'md'", null, 'Input size (same as Text Input)'],
});
