import { Slider as BaseSlider } from '@base-ui/react/slider';
import { cx, useControllable, useId } from '../react.js';
import { describe } from '../doc.js';

function SingleSlider({
  value,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  showValue = false,
  disabled = false,
  className,
  ...rest
}) {
  const [v, setV] = useControllable(value, defaultValue, onValueChange);
  const id = useId();
  const pct = ((v - min) / (max - min)) * 100;
  return (
    <div data-slot="slider" className={cx('bui-slider', disabled && 'bui-slider--disabled', className)}>
      {(label || showValue) && (
        <div data-slot="slider-head" className="bui-slider__head">
          <label htmlFor={id}>{label}</label>
          {showValue && <output htmlFor={id}>{v}</output>}
        </div>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={v}
        disabled={disabled}
        style={{ '--bui-slider-pct': `${pct}%` }}
        onChange={(e) => setV(Number(e.target.value))}
        {...rest}
      />
    </div>
  );
}
/** Two thumbs: built on the Base UI Slider, which keeps them apart, moves them by keyboard and gives each its own input for a form. */
function RangeSlider({
  value,
  defaultValue = [25, 75],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenValues = 0,
  label,
  showValue = false,
  disabled = false,
  thumbLabels = ['Minimum', 'Maximum'],
  className,
  ...rest
}) {
  const [v, setV] = useControllable(value, defaultValue, onValueChange);
  const id = useId();
  return (
    <BaseSlider.Root
      data-slot="range-slider"
      className={cx('bui-range', className)}
      value={v}
      onValueChange={(next) => setV(next)}
      min={min}
      max={max}
      step={step}
      minStepsBetweenValues={minStepsBetweenValues}
      disabled={disabled}
      aria-labelledby={label ? `${id}-label` : undefined}
      {...rest}
    >
      {(label || showValue) && (
        <div data-slot="slider-head" className="bui-slider__head">
          <span id={`${id}-label`}>{label}</span>
          {showValue && (
            <output>
              {v[0]} – {v[1]}
            </output>
          )}
        </div>
      )}
      <BaseSlider.Control data-slot="range-slider-control" className="bui-range__control">
        <BaseSlider.Track data-slot="range-slider-track" className="bui-range__track">
          <BaseSlider.Indicator data-slot="range-slider-indicator" className="bui-range__indicator" />
          {v.map((_, i) => (
            <BaseSlider.Thumb key={i} index={i} aria-label={thumbLabels[i]} data-slot="range-slider-thumb" className="bui-range__thumb" />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}

export function Slider({ range = false, ...props }) {
  return range ? <RangeSlider {...props} /> : <SingleSlider {...props} />;
}
describe(Slider, 'Selects a number in a range, or with `range` two numbers: a lower and an upper bound', {
  range: ['boolean', 'false', 'Two thumbs: `value` and `defaultValue` are `[low, high]` and `onValueChange` gets the pair. Built on the Base UI Slider'],
  value: ['number | [number, number]', null, 'Value; a pair with `range`'],
  defaultValue: ['number | [number, number]', '0', 'Initial value; with `range` a pair, [25, 75] by default'],
  onValueChange: ['(value: number | [number, number]) => void', null, 'Called when the value changes'],
  min: ['number', '0', 'Minimum'],
  max: ['number', '100', 'Maximum'],
  step: ['number', '1', 'Step'],
  minStepsBetweenValues: ['number', '0', 'Range only: the least number of steps between the two thumbs'],
  label: ['ReactNode', null, 'Label above the track'],
  showValue: ['boolean', 'false', 'Show the current value; a range shows "lower – upper"'],
  thumbLabels: ['[string, string]', "['Minimum', 'Maximum']", 'Range only: accessible names of the two thumbs'],
  disabled: ['boolean', 'false', 'Disabled state'],
});
