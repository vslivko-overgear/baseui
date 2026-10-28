import { h, cx, useState, useRef, useEffect, useCallback, useId } from '../../react.js';
import { Slider } from '@base-ui/react/slider';
import { describe } from '../../doc.js';

/**
 * Calls `onChange` at most once per `wait` ms while dragging; `flush` cancels the pending call and fires at once
 * (the end of a drag), so a consumer that refetches on change is not flooded.
 */
function useThrottledChange(onChange, wait) {
  const timer = useRef(null);
  const last = useRef(0);
  const latest = useRef(onChange);
  latest.current = onChange;
  useEffect(() => () => clearTimeout(timer.current), []);
  const schedule = useCallback((next) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { last.current = Date.now(); latest.current?.(next); }, Math.max(0, wait - (Date.now() - last.current)));
  }, [wait]);
  const flush = useCallback((next) => { clearTimeout(timer.current); timer.current = null; last.current = Date.now(); latest.current?.(next); }, []);
  return { schedule, flush };
}

/**
 * A slider with two thumbs for a range (a price from and to). It is the Base UI Slider with a range value: the thumbs are keyboard
 * operable, a press on the track moves the nearer thumb, and the thumbs cannot cross. While dragging the local value moves at once and
 * `onValueChange` is throttled; the final value is always sent when the drag ends.
 */
export function MultiRangeSlider({
  value, defaultValue, onValueChange, min = 0, max = 100, step = 1, lockStartPosition = false, showMinMaxLabels = false, minLabel, maxLabel, label, formatValue, showValue = false,
  debounceMs = 150, disabled = false, hideRange = false, thumbLabels = ['Minimum', 'Maximum'], className, ...rest
}) {
  const id = useId();
  const [local, setLocal] = useState(value ?? defaultValue ?? [min, max]);
  const dragging = useRef(false);
  const { schedule, flush } = useThrottledChange(onValueChange, debounceMs);
  // follow an outside change (an input next to the slider), but never in the middle of a drag
  useEffect(() => { if (value && !dragging.current) setLocal((cur) => (cur[0] === value[0] && cur[1] === value[1] ? cur : value)); }, [value && value[0], value && value[1]]);

  const fmt = formatValue ?? String;
  const current = lockStartPosition ? local[1] : local;
  const change = (next) => {
    dragging.current = true;
    const pair = lockStartPosition ? [local[0], next] : next;
    setLocal(pair);
    schedule(pair);
  };
  const commit = (next) => {
    dragging.current = false;
    const pair = lockStartPosition ? [local[0], next] : next;
    setLocal(pair);
    flush(pair);
  };
  return h('div', { 'data-slot': 'multi-range-slider', className: cx('og-range', disabled && 'og-range--disabled', hideRange && 'og-range--hide', lockStartPosition && 'og-range--locked', className), ...rest },
    (label || showValue) && h('div', { className: 'og-range__head' }, label && h('span', { id, className: 'og-range__label' }, label), showValue && h('output', { className: 'og-range__value', 'aria-live': 'off' }, `${fmt(local[0])} - ${fmt(local[1])}`)),
    h(Slider.Root, {
      value: current, min, max, step, disabled, thumbAlignment: 'edge', minStepsBetweenThumbs: lockStartPosition ? 0 : 1, 'aria-labelledby': label ? id : undefined,
      onValueChange: change, onValueCommitted: commit, className: 'og-range__root',
    },
    h(Slider.Control, { className: 'og-range__control' },
      h(Slider.Track, { className: 'og-range__track' }, h(Slider.Indicator, { className: 'og-range__indicator' })),
      (lockStartPosition ? [1] : [0, 1]).map((i) => h(Slider.Thumb, { key: i, index: lockStartPosition ? 0 : i, 'aria-label': thumbLabels[i], getAriaValueText: (_text, v) => fmt(v), className: 'og-range__thumb' })))),
    showMinMaxLabels && h('div', { className: 'og-range__labels' }, h('span', null, minLabel ?? fmt(min)), h('span', null, maxLabel ?? fmt(max))));
}
describe(MultiRangeSlider, 'A slider with two thumbs for a range, such as a price from and to: the Base UI Slider with a range value. The thumbs cannot cross, a press on the track moves the nearer one, and while dragging `onValueChange` is throttled and the final value is always sent.', {
  value: ['[number, number]', null, 'Range as [start, end] (controlled)'],
  defaultValue: ['[number, number]', '[min, max]', 'Initial range (uncontrolled)'],
  onValueChange: ['(value: [number, number]) => void', null, 'Called with the range while dragging (throttled) and when the drag ends'],
  min: ['number', '0', 'Minimum'], max: ['number', '100', 'Maximum'], step: ['number', '1', 'Step'],
  lockStartPosition: ['boolean', 'false', 'Hide the first thumb and let only the end move; the start stays where it is'],
  showMinMaxLabels: ['boolean', 'false', 'Show the minimum and the maximum under the track'],
  minLabel: ['string', null, 'Formatted minimum label (defaults to the formatted `min`)'],
  maxLabel: ['string', null, 'Formatted maximum label (defaults to the formatted `max`)'],
  label: ['ReactNode', null, 'Label above the track'],
  showValue: ['boolean', 'false', 'Show the current range next to the label'],
  formatValue: ['(value: number) => string', null, 'Formats a number for the labels and the screen reader'],
  debounceMs: ['number', '150', 'How often `onValueChange` may fire while dragging, ms'],
  disabled: ['boolean', 'false', 'Disabled state'],
  hideRange: ['boolean', 'false', 'Hide the filled part of the track (avoids a flash before the values settle)'],
  thumbLabels: ['[string, string]', "['Minimum', 'Maximum']", 'Accessible names of the thumbs'],
  className: ['string', null, 'Extra class of the root'],
});
