import { h, cx } from '../react.js';
import { Icon } from '../icons.js';
import { describe } from '../doc.js';

export function Banner({ status = 'info', title, children, onClose, closeLabel = 'Close', className, ...rest }) {
  return h('div', {
    role: status === 'error' || status === 'warning' ? 'alert' : 'status',
    'data-slot': 'banner', 'data-status': status, className: cx('bui-banner', `bui-banner--${status}`, className), ...rest,
  },
    h(Icon, { name: status, size: 24, className: 'bui-banner__icon' }),
    h('div', { 'data-slot': 'banner-body', className: 'bui-banner__body' },
      title && h('div', { 'data-slot': 'banner-title', className: 'bui-banner__title' }, title),
      children && h('div', { 'data-slot': 'banner-text', className: 'bui-banner__text' }, children)),
    onClose && h('button', { type: 'button', 'data-slot': 'banner-close', className: 'bui-banner__close', 'aria-label': closeLabel, onClick: onClose },
      h(Icon, { name: 'close', size: 20 })));
}

describe(Banner, 'An inline message with a status.', {
  status: ["'info' | 'success' | 'warning' | 'error'", "'info'", 'Message type'],
  title: ['ReactNode', null, 'Heading'],
  children: ['ReactNode', null, 'Message text'],
  onClose: ['() => void', null, 'When set, a close button is shown'],
  closeLabel: ['string', "'Close'", 'Accessible name of the close button'],
});
