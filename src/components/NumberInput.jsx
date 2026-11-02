import { useControllable, useId } from '../react.js';
import { TextInput } from './TextInput.jsx';
import { Icon } from './Icon.jsx';
import { describe } from '../doc.js';

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function NumberInput({ value, defaultValue, onValueChange, min = -Infinity, max = Infinity, step = 1, label, size, disabled = false, loading = false, readOnly = false, ...rest }) {
  const [v, setV] = useControllable(value, defaultValue ?? '', onValueChange);
  const labelId = useId();
  const bump = (d) => setV(clamp((Number(v) || 0) + d * step, min, max));
  // the buttons are part of the field: they follow its disabled, loading and read-only states
  const frozen = disabled || loading || readOnly;
  const button = (name, label, d, off, side) => (
    <span data-slot="stepper-btns" className={`bui-stepper-btns bui-stepper-btns--${side}`}>
      <button type="button" aria-label={label} tabIndex={-1} onClick={() => bump(d)} disabled={frozen || off}>
        <Icon name={name} size={24} weight={2} />
      </button>
    </span>
  );
  const field = (
    <TextInput
      aria-labelledby={label ? labelId : undefined}
      size={size}
      disabled={disabled}
      loading={loading}
      readOnly={readOnly}
      inputMode="decimal"
      value={String(v)}
      startIcon={button('Minus', 'Decrease', -1, Number(v) <= min, 'start')}
      action={button('Plus', 'Increase', 1, Number(v) >= max, 'end')}
      className="bui-number"
      onChange={(e) => {
        const raw = e.target.value;
        setV(raw === '' || raw === '-' ? raw : Number.isNaN(Number(raw)) ? v : clamp(Number(raw), min, max));
      }}
      onKeyDown={(e) => {
        if (frozen) return;
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          bump(1);
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          bump(-1);
        }
      }}
      {...rest}
    />
  );
  if (!label) return field;
  // the label is outside of the field, to the right of it, as the label of a checkbox or a radio; the field hugs its content
  return (
    <span data-slot="number-input" className={`bui-number-row${size === 'sm' ? ' bui-number-row--sm' : ''}`}>
      {field}
      <span id={labelId} className="bui-number-row__label">
        {label}
      </span>
    </span>
  );
}
describe(NumberInput, 'A text input for numbers: a minus button first, the number in the middle, a plus button last. It takes the props of the Text Input (variant, status, caption, prefix, suffix, floatingLabel)', {
  value: ['number | string', null, 'Value'],
  defaultValue: ['number', null, 'Initial value'],
  onValueChange: ['(value: number | string) => void', null, 'Called when the value changes'],
  min: ['number', null, 'Minimum'],
  max: ['number', null, 'Maximum'],
  step: ['number', '1', 'Step'],
  label: ['string', null, 'Text to the right of the field, outside of it, as the label of a checkbox or a radio (the field hugs its content). Without it pass `aria-label`'],
  size: ["'sm' | 'md'", null, 'Input size (same as Text Input): the buttons are 36px in md and 32px in sm'],
  disabled: ['boolean', 'false', 'Disabled state of the field and of its buttons'],
  loading: ['boolean', 'false', 'Loading state of the field (the buttons are off)'],
  readOnly: ['boolean', 'false', 'The value can be read and copied but not changed: the buttons and the arrow keys are off'],
});
