import { h, cx } from '../react.js';
import { describe } from '../doc.js';

export function Badge({ variant = 'secondary', size = 'md', disabled = false, label, icon, className, ...rest }) {
  return h('span', { className: cx('bui-badge', `bui-badge--${variant}`, size !== 'md' && `bui-badge--${size}`, disabled && 'bui-badge--disabled', className), title: typeof label === 'string' || typeof label === 'number' ? String(label) : undefined, ...rest },
    icon && h('span', { className: 'bui-badge__icon', 'aria-hidden': 'true' }, icon),
    h('span', { className: 'bui-badge__label' }, label));
}
describe(Badge, 'A compact label for a status, category or count.', {
  variant: ["'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' | 'blue' | 'blue-light' | 'green' | 'green-light' | 'orange' | 'pink' | 'red'", "'secondary'", 'primary is the inverse of the page, secondary a soft gray; the rest are semantic and accent colors, all solid'],
  size: ["'sm' | 'md' | 'lg'", "'md'", 'Badge height: 18, 22 or 28px'],
  disabled: ['boolean', 'false', 'Muted look that replaces the variant color'],
  label: ['ReactNode', null, 'Badge text'],
  icon: ['ReactNode', null, 'Icon before the label'],
});

export function StatusDot({ variant, label, isPulsing = false, tooltip, icon, className, ...rest }) {
  return h('span', {
    role: 'img', 'aria-label': label, title: tooltip, className: cx('bui-status-dot', `bui-status-dot--${variant}`, isPulsing && 'bui-status-dot--pulsing', className), ...rest,
  }, icon && h('span', { className: 'bui-status-dot__icon', 'aria-hidden': 'true' }, icon));
}
describe(StatusDot, 'A small dot that shows a status.', {
  variant: ["'success' | 'warning' | 'error' | 'accent' | 'neutral'", null, 'Status color'],
  label: ['string', null, 'Accessible description of the status'],
  isPulsing: ['boolean', 'false', 'Pulse to show activity; stops under reduced motion'],
  tooltip: ['string', null, 'Hover text'],
  icon: ['ReactNode', null, 'Centered inside the dot'],
});
