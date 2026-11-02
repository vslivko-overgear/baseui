import { cx } from '../react.js';
import { BuiltinIcon } from '../builtin-icons.jsx';
import { describe } from '../doc.js';

export function Banner({ status = 'info', title, children, onClose, closeLabel = 'Close', className, ...rest }) {
  return (
    <div
      role={status === 'error' || status === 'warning' ? 'alert' : 'status'}
      data-slot="banner"
      data-status={status}
      className={cx('bui-banner', `bui-banner--${status}`, className)}
      {...rest}
    >
      <BuiltinIcon name={status} size={24} data-slot="banner-icon" className="bui-banner__icon" />
      <div data-slot="banner-body" className="bui-banner__body">
        {title && (
          <div data-slot="banner-title" className="bui-banner__title">
            {title}
          </div>
        )}
        {children && (
          <div data-slot="banner-text" className="bui-banner__text">
            {children}
          </div>
        )}
      </div>
      {onClose && (
        <button type="button" data-slot="banner-close" className="bui-banner__close" aria-label={closeLabel} onClick={onClose}>
          <BuiltinIcon name="close" size={20} />
        </button>
      )}
    </div>
  );
}

describe(Banner, 'An inline message with a status', {
  status: ["'info' | 'success' | 'warning' | 'error'", "'info'", 'Message type'],
  title: ['ReactNode', null, 'Heading'],
  children: ['ReactNode', null, 'Message text'],
  onClose: ['() => void', null, 'When set, a close button is shown'],
  closeLabel: ['string', "'Close'", 'Accessible name of the close button'],
});
