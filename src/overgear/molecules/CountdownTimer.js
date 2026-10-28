import { h, cx, useState, useEffect, useRef } from '../../react.js';
import { describe } from '../../doc.js';

const pad = (n) => String(n).padStart(2, '0');
/** 7 -> "07" */
export const formatTimeUnit = pad;

const toMs = (target) => (target instanceof Date ? target.getTime() : new Date(target).getTime());

/**
 * Milliseconds left until `target`, updated every second. With `staticMs` the value is fixed and nothing ticks
 * (for screenshots, stories and tests).
 */
export function useCountdown(target, staticMs) {
  const fixed = staticMs != null;
  const calc = () => (fixed ? staticMs : Math.max(0, toMs(target) - Date.now()));
  const [left, setLeft] = useState(calc);
  const key = fixed ? `s${staticMs}` : String(toMs(target));
  useEffect(() => {
    setLeft(calc());
    if (fixed) return undefined;
    const id = setInterval(() => setLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [key]);
  return fixed ? staticMs : left;
}

export function ClockIcon({ size = 14, ...rest }) {
  return h('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', focusable: 'false', ...rest },
    h('circle', { cx: 12, cy: 12, r: 9 }), h('path', { d: 'M12 7v5l3 2' }));
}

/** Splits a number of milliseconds into HH:MM:SS parts (hours are not capped at 24). */
export const msToClock = (ms) => {
  const total = Math.floor(Math.max(0, ms) / 1000);
  return { hours: Math.floor(total / 3600), minutes: Math.floor((total % 3600) / 60), seconds: total % 60 };
};

export function CountdownTimer({ targetDate, remainingMs, hideIcon = false, className, ...rest }) {
  const left = useCountdown(targetDate, remainingMs);
  if (left <= 0) return h('span', { 'data-slot': 'countdown', className: cx('og-countdown', className), ...rest });
  const { hours, minutes, seconds } = msToClock(left);
  const text = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return h('span', { 'data-slot': 'countdown', role: 'timer', className: cx('og-countdown', className), ...rest },
    !hideIcon && h('span', { 'data-slot': 'countdown-icon', className: 'og-countdown__icon' }, h(ClockIcon)),
    h('span', { 'data-slot': 'countdown-time', className: 'og-countdown__time' }, text));
}
describe(CountdownTimer, 'An inline countdown that shows HH:MM:SS with an optional clock icon. It renders nothing visible once the time has passed.', {
  targetDate: ['Date | string | number', null, 'Moment the countdown ends'],
  remainingMs: ['number', null, 'A fixed time left, in ms: the timer does not tick (useful for static previews)'],
  hideIcon: ['boolean', 'false', 'Hide the clock icon and show only the time'],
});
