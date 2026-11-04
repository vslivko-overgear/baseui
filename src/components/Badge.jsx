import { cx } from '../react.js';
import { describe } from '../doc.js';

export function Badge({ variant = 'secondary', size = 'md', type = 'label', max = 99, disabled = false, light = false, label, icon, className, ...rest }) {
  if (type === 'dot')
    return (
      <span
        role="img"
        aria-label={label}
        data-slot="badge"
        data-type="dot"
        data-variant={variant}
        data-size={size}
        className={cx(
          'bui-badge',
          'bui-badge--dot',
          `bui-badge--${variant}`,
          size !== 'md' && `bui-badge--${size}`,
          light && 'bui-badge--light',
          disabled && 'bui-badge--disabled',
          className,
        )}
        {...rest}
      />
    );
  if (type === 'counter' && typeof label === 'number' && label > max) label = `${max}+`;
  return (
    <span
      data-slot="badge"
      data-type={type}
      data-variant={variant}
      data-size={size}
      className={cx(
        'bui-badge',
        type === 'counter' && 'bui-badge--counter',
        `bui-badge--${variant}`,
        size !== 'md' && `bui-badge--${size}`,
        light && 'bui-badge--light',
        disabled && 'bui-badge--disabled',
        className,
      )}
      title={typeof label === 'string' || typeof label === 'number' ? String(label) : undefined}
      {...rest}
    >
      {icon && (
        <span data-slot="badge-icon" className="bui-badge__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span data-slot="badge-label" className="bui-badge__label">
        {label}
      </span>
    </span>
  );
}
describe(Badge, 'A compact label for a status, category or count', {
  variant: [
    "'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'critical'",
    "'secondary'",
    'primary is the inverse of the page, secondary a soft gray; accent, success, warning and critical are solid colors (with `light`, a tint)',
  ],
  light: ['boolean', 'false', 'The light version of the color of the variant: a tint of it with the main text color, for places where a bright tag shouts (a list, a table, many tags in a row). Accent, success, warning and critical have it; primary and secondary are not colors and ignore it'],
  size: ["'sm' | 'md' | 'lg'", "'md'", 'Badge height: 18, 22 or 28px; the dot is 6, 8 or 10px'],
  type: ["'label' | 'counter' | 'dot'", "'label'", 'label is a text pill; counter is a round number; dot is a small mark with no text'],
  max: ['number', '99', 'Counter only: numbers above it show as `99+`'],
  disabled: ['boolean', 'false', 'Muted look that replaces the variant color'],
  label: ['ReactNode', null, 'Badge text or number; with the dot it is the accessible name'],
  icon: ['ReactNode', null, 'Icon before the label'],
});
