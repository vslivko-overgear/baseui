import { cx } from '../react.js';
import { describe } from '../doc.js';

export function Divider({ orientation = 'horizontal', label, className, ...rest }) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      data-slot="divider"
      className={cx('bui-divider', `bui-divider--${orientation}`, label && 'bui-divider--labeled', className)}
      {...rest}
    >
      {label && orientation === 'horizontal' ? (
        <span data-slot="divider-label" className="bui-divider__label">
          {label}
        </span>
      ) : null}
    </div>
  );
}

describe(Divider, 'A line that separates content', {
  orientation: ["'horizontal' | 'vertical'", "'horizontal'", 'Line direction'],
  label: ['ReactNode', null, 'Centered label (horizontal only)'],
  className: ['string', null, 'Extra class name'],
});
