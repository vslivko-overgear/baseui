import { h, cx } from '../../react.js';
import { describe } from '../../doc.js';
import { ProgressBar } from '../../components/ProgressBar.js';

const getProgress = (min, max, v) => (v < min ? 0 : v > max ? 100 : max === min ? 100 : ((v - min) / (max - min)) * 100);

export function StepProgressBar({ value, bars, label, className, ...rest }) {
  return h('div', { role: 'group', 'aria-label': label, 'data-slot': 'step-progress', className: cx('og-steps', className), ...rest },
    bars.map((bar, i) => h(ProgressBar, { key: i, size: 'sm', value: getProgress(bar.min, bar.max, value), 'aria-label': label ? `${label}: step ${i + 1}` : `Step ${i + 1}`, className: 'og-steps__bar', 'data-done': value >= bar.max || undefined })));
}
describe(StepProgressBar, 'A progress bar split into steps: each segment fills on its own as the value moves through its range.', {
  value: ['number', null, 'Current value on the shared scale of all segments'],
  bars: ['Array<{ min: number; max: number }>', null, 'Segments in order; each fills from its `min` to its `max`'],
  label: ['string', null, 'Accessible name of the group'],
});
