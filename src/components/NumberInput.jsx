import { useControllable } from '../react.js';
import { TextInput } from './TextInput.jsx';
import { Icon } from './Icon.jsx';
import { describe } from '../doc.js';

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function NumberInput({ value, defaultValue, onValueChange, min = -Infinity, max = Infinity, step = 1, label, size, disabled = false, loading = false, readOnly = false, ...rest }) {
  const [v, setV] = useControllable(value, defaultValue ?? '', onValueChange);
  const bump = (d) => setV(clamp((Number(v) || 0) + d * step, min, max));
  // the buttons are part of the field: they follow its disabled, loading and read-only states
  const frozen = disabled || loading || readOnly;
  const stepper = (
    <span data-slot="stepper-btns" className="bui-stepper-btns">
      <button type="button" aria-label="Decrease" tabIndex={-1} onClick={() => bump(-1)} disabled={frozen || Number(v) <= min}>
        <Icon name="Minus" size={24} weight={2} />
      </button>
      <button type="button" aria-label="Increase" tabIndex={-1} onClick={() => bump(1)} disabled={frozen || Number(v) >= max}>
        <Icon name="Plus" size={24} weight={2} />
      </button>
    </span>
  );
  return (
    <TextInput
      label={label}
      size={size}
      disabled={disabled}
      loading={loading}
      readOnly={readOnly}
      inputMode="decimal"
      value={String(v)}
      action={stepper}
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
}
describe(NumberInput, 'A text input for numbers with a minus and a plus button. It takes the props of the Text Input (variant, status, caption, prefix, suffix, floatingLabel)', {
  value: ['number | string', null, 'Value'],
  defaultValue: ['number', null, 'Initial value'],
  onValueChange: ['(value: number | string) => void', null, 'Called when the value changes'],
  min: ['number', null, 'Minimum'],
  max: ['number', null, 'Maximum'],
  step: ['number', '1', 'Step'],
  label: ['string', null, 'Floating label'],
  size: ["'sm' | 'md'", null, 'Input size (same as Text Input): the buttons are 36px in md and 32px in sm'],
  disabled: ['boolean', 'false', 'Disabled state of the field and of its buttons'],
  loading: ['boolean', 'false', 'Loading state of the field (the buttons are off)'],
  readOnly: ['boolean', 'false', 'The value can be read and copied but not changed: the buttons and the arrow keys are off'],
});
