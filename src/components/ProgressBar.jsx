import { cx } from '../react.js';
import { describe } from '../doc.js';

export const PROGRESS_COLORS = ['brand', 'accent', 'success', 'warning', 'error', 'blue', 'blue-light', 'green', 'green-light', 'orange', 'pink', 'red'];
export const MAX_SECTIONS = 8;

export function ProgressBar({ value, size = 'md', color = 'brand', sections = 1, label, showValue = false, className, ...rest }) {
  const determinate = typeof value === 'number';
  const pct = determinate ? Math.min(100, Math.max(0, value)) : undefined;
  const count = Math.min(MAX_SECTIONS, Math.max(1, Math.round(Number(sections)) || 1));
  const split = determinate && count > 1;
  // section i covers [i, i + 1) of count: its fill is the part of the value inside that slice
  const fillOf = (i) => Math.min(100, Math.max(0, (pct * count) - i * 100));
  return (
    <div data-slot="progress" data-size={size} data-color={color} className={cx('bui-progress', `bui-progress--${size}`, className)} {...rest}>
      {(label || (showValue && determinate)) && (
        <div data-slot="progress-head" className="bui-progress__head">
          <span>{label}</span>
          {showValue && determinate && <span data-slot="progress-value" className="bui-progress__value">{`${Math.round(pct)}%`}</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={typeof label === 'string' ? label : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        data-slot="progress-track"
        className={cx('bui-progress__track', !determinate && 'bui-progress__track--indeterminate', split && 'bui-progress__track--sections')}
      >
        {split ? (
          Array.from({ length: count }, (_, i) => (
            <span key={i} data-slot="progress-section" className="bui-progress__section">
              <span data-slot="progress-fill" className="bui-progress__fill" style={{ width: `${fillOf(i)}%` }} />
            </span>
          ))
        ) : (
          <div data-slot="progress-fill" className="bui-progress__fill" style={determinate ? { width: `${pct}%` } : undefined} />
        )}
      </div>
    </div>
  );
}

describe(ProgressBar, 'A linear progress indicator', {
  value: ['number', null, 'Progress from 0 to 100; omit for indeterminate'],
  size: ["'sm' | 'md'", "'md'", 'Bar thickness'],
  color: [
    "'brand' | 'accent' | 'success' | 'warning' | 'error' | 'blue' | 'blue-light' | 'green' | 'green-light' | 'orange' | 'pink' | 'red'",
    "'brand'",
    'Color of the fill, a color of the design system: the brand and accent backgrounds, the status colors or an accent color',
  ],
  sections: ['1 | 2 | 3 | 4 | 5 | 6 | 7 | 8', '1', 'Splits the bar into equal sections (1 to 8) with a gap; the value fills them one after another. Indeterminate bars are not split'],
  label: ['ReactNode', null, 'Label above the bar'],
  showValue: ['boolean', 'false', 'Show the value as a percentage'],
});
