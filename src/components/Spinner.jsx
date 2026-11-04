import { cx } from '../react.js';
import { describe } from '../doc.js';

const SIZES = { xsm: 16, sm: 24, md: 40, lg: 56 };
const COLORS = {
  primary: 'var(--bui-text-and-icon-primary)',
  secondary: 'var(--bui-text-and-icon-secondary)',
  accent: 'var(--bui-text-and-icon-accent)',
  success: 'var(--bui-extensions-text-and-icon-success)',
  warning: 'var(--bui-extensions-text-and-icon-warning)',
  error: 'var(--bui-extensions-text-and-icon-critical)',
  'on-color': 'var(--bui-extensions-text-and-icon-on-color)',
  inherit: 'currentColor',
};

export function Spinner({ size = 'md', customSize, color = 'primary', className, style, ...rest }) {
  const px = size === 'custom' ? (customSize ?? SIZES.md) : typeof size === 'number' ? size : SIZES[size];
  return (
    <span
      role="status"
      aria-label="Loading"
      data-slot="spinner"
      data-size={typeof size === 'number' ? 'custom' : size}
      className={cx('bui-spinner', className)}
      style={{ width: px, height: px, color: COLORS[color], ...style }}
      {...rest}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle data-slot="spinner-track" className="bui-spinner__track" cx={12} cy={12} r={9} strokeWidth={3} />
        <circle data-slot="spinner-arc" className="bui-spinner__arc" cx={12} cy={12} r={9} strokeWidth={3} strokeLinecap="round" />
      </svg>
    </span>
  );
}

describe(Spinner, 'A loading indicator', {
  size: ["'xsm' | 'sm' | 'md' | 'lg' | 'custom' | number", "'md'", 'Size: 16 / 24 / 40 / 56 px; custom takes the size from `customSize`; a number is px'],
  customSize: ['number | string', null, 'Any size: a number in px or a CSS length (`1.5rem`); used only with `size="custom"`'],
  color: [
    "'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'on-color' | 'inherit'",
    "'primary'",
    'Color preset; on-color is for use on filled backgrounds, inherit takes the color of the surrounding text',
  ],
});
