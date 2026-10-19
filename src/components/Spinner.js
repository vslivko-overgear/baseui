import { h, cx } from '../react.js';
import { describe } from '../doc.js';

const SIZES = { xsm: 16, sm: 24, md: 40, lg: 56 };
const COLORS = {
  primary: 'var(--baseui-Text-and-Icon-Primary)', secondary: 'var(--baseui-Text-and-Icon-Secondary)', accent: 'var(--baseui-Text-and-Icon-Accent)',
  success: 'var(--baseui-Extensions-Text-and-Icon-Success)', warning: 'var(--baseui-Extensions-Text-and-Icon-Warning)', error: 'var(--baseui-Extensions-Text-and-Icon-Error)',
  'on-color': 'var(--baseui-Text-and-Icon-OnColor)',
};

export function Spinner({ size = 'md', color = 'primary', className, style, ...rest }) {
  const px = typeof size === 'number' ? size : SIZES[size];
  return h('span', {
    role: 'status', 'aria-label': 'Loading', className: cx('bui-spinner', className),
    style: { width: px, height: px, color: COLORS[color], ...style }, ...rest,
  }, h('svg', { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' },
    h('circle', { className: 'bui-spinner__track', cx: 12, cy: 12, r: 9, strokeWidth: 3 }),
    h('circle', { className: 'bui-spinner__arc', cx: 12, cy: 12, r: 9, strokeWidth: 3, strokeLinecap: 'round' })));
}

describe(Spinner, 'A loading indicator.', {
  size: ["'xsm' | 'sm' | 'md' | 'lg' | number", "'md'", 'Size: 16 / 24 / 40 / 56 px, or a number in px'],
  color: ["'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'on-color'", "'primary'", 'Color preset; on-color is for use on filled backgrounds'],
});
