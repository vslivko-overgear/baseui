import { h, cx } from '../react.js';
import { describe } from '../doc.js';

export function ProgressBar({ value, size = 'md', label, showValue = false, className, ...rest }) {
  const determinate = typeof value === 'number';
  const pct = determinate ? Math.min(100, Math.max(0, value)) : undefined;
  return h('div', { 'data-slot': 'progress', 'data-size': size, className: cx('bui-progress', `bui-progress--${size}`, className), ...rest },
    (label || (showValue && determinate)) && h('div', { 'data-slot': 'progress-head', className: 'bui-progress__head' },
      h('span', null, label), showValue && determinate && h('span', { 'data-slot': 'progress-value', className: 'bui-progress__value' }, `${Math.round(pct)}%`)),
    h('div', {
      role: 'progressbar', 'aria-label': typeof label === 'string' ? label : undefined,
      'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': pct,
      'data-slot': 'progress-track', className: cx('bui-progress__track', !determinate && 'bui-progress__track--indeterminate'),
    }, h('div', { 'data-slot': 'progress-fill', className: 'bui-progress__fill', style: determinate ? { width: `${pct}%` } : undefined })));
}

describe(ProgressBar, 'A linear progress indicator.', {
  value: ['number', null, 'Progress from 0 to 100; omit for indeterminate'],
  size: ["'sm' | 'md'", "'md'", 'Bar thickness'],
  label: ['ReactNode', null, 'Label above the bar'],
  showValue: ['boolean', 'false', 'Show the value as a percentage'],
});
