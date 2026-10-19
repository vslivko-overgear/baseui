import { h, cx } from '../react.js';
import { describe } from '../doc.js';

const SIZES = { xsm: 16, sm: 24, md: 40, lg: 56 };
// A color token name (`Text-and-Icon-Accent`) or any CSS color.
const colorOf = (c) => (/^[A-Z][\w-]*$/.test(c) ? `var(--baseui-${c})` : c);

export function Spinner({ size = 'md', color, label = 'Loading', className, style, ...rest }) {
  const px = typeof size === 'number' ? size : SIZES[size];
  return h('span', {
    role: 'status', 'aria-label': label, className: cx('bui-spinner', className),
    style: { width: px, height: px, color: color && colorOf(color), ...style }, ...rest,
  }, h('svg', { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' },
    h('circle', { className: 'bui-spinner__track', cx: 12, cy: 12, r: 9, strokeWidth: 3 }),
    h('circle', { className: 'bui-spinner__arc', cx: 12, cy: 12, r: 9, strokeWidth: 3, strokeLinecap: 'round' })));
}

describe(Spinner, 'A loading indicator.', {
  size: ["'xsm' | 'sm' | 'md' | 'lg' | number", "'md'", 'Size: 16 / 24 / 40 / 56 px, or a number in px'],
  color: ['string', null, 'A color token name or any CSS color; the text color by default'],
  label: ['string', "'Loading'", 'Accessible name'],
});
