import { h, cx } from '../../react.js';
import { describe } from '../../doc.js';
import { Badge } from '../../components/Badge.js';
import { ClockIcon, useCountdown, msToClock, formatTimeUnit } from './CountdownTimer.js';

const MS_PER_DAY = 86400000;
const svg = (...c) => h('svg', { viewBox: '0 0 24 24', width: '100%', height: '100%', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', focusable: 'false' }, ...c);
export const HourglassIcon = () => svg(h('path', { d: 'M6 3h12M6 21h12M7 3v3.5c0 1.6.8 3 2 4l3 1.5-3 1.5c-1.2 1-2 2.4-2 4V21M17 3v3.5c0 1.6-.8 3-2 4l-3 1.5 3 1.5c1.2 1 2 2.4 2 4V21' }));
export const SoldOutIcon = () => svg(h('circle', { cx: 12, cy: 12, r: 9 }), h('path', { d: 'm5.6 5.6 12.8 12.8' }));

export const NonBackendBadgesTypes = { OutOfStock: 'OutOfStock', TimerOffer: 'TimerOffer' };

/** Frontend-only badge presets. Backend badges arrive as `badgeObject` and have no preset. */
export const getFrontendBadgePresets = (type) => {
  switch (type) {
    case 'OutOfStock': return { icon: h(SoldOutIcon), text: 'Sold Out', variant: 'primary' };
    case 'TimerOffer': return { icon: h(HourglassIcon), text: '', variant: 'orange' };
    default: return null;
  }
};

export function ProductBadge({ type, options, isNewBadgeType = false, compact = false, badgeObject, className, ...rest }) {
  const small = compact && isNewBadgeType;
  const common = { 'data-slot': 'product-badge', 'data-new': isNewBadgeType || undefined, 'data-compact': small || undefined };
  const cls = cx('og-product-badge', isNewBadgeType && 'og-product-badge--new', className);
  const size = small ? 'md' : 'lg';
  if (badgeObject) {
    const text = options?.text || badgeObject.text;
    if (!text) return null;
    const icon = options?.icon === null ? null : badgeObject.icon;
    const shown = icon && !small;
    const iconNode = !shown ? undefined : h('span', {
      className: cx('og-product-badge__icon', badgeObject.roundIcon && 'og-product-badge__icon--round'),
      style: badgeObject.roundIcon ? { background: badgeObject.accent, color: badgeObject.bg } : undefined,
      ...(typeof icon === 'string' ? { dangerouslySetInnerHTML: { __html: icon } } : { children: icon }),
    });
    return h(Badge, { ...common, ...rest, className: cx(cls, 'og-product-badge--custom'), size, icon: iconNode, label: text, style: { background: badgeObject.bg, color: badgeObject.accent } });
  }
  const preset = getFrontendBadgePresets(type);
  if (!preset) return null;
  const text = options?.text || preset.text;
  if (!text) return null;
  const icon = options?.icon !== undefined ? options.icon : preset.icon;
  return h(Badge, { ...common, ...rest, className: cls, size, variant: options?.variant || preset.variant, icon: icon && !small ? icon : undefined, label: text });
}
describe(ProductBadge, 'A badge on a product card: a frontend preset by `type` ("OutOfStock", "TimerOffer") or an admin-managed `badgeObject` with its own colors.', {
  type: ["'OutOfStock' | 'TimerOffer' | string", null, 'Frontend preset; an unknown type renders nothing'],
  options: ['{ text?: ReactNode; icon?: ReactNode | null; variant?: BadgeVariant }', null, 'Overrides of the preset; `icon: null` hides the icon'],
  isNewBadgeType: ['boolean', 'false', 'The newer look with rounder corners'],
  compact: ['boolean', 'false', 'With `isNewBadgeType` on small screens: smaller and without the icon'],
  badgeObject: ['{ text: string; bg: string; accent: string; roundIcon?: boolean; icon?: ReactNode | string }', null, 'Admin badge; `bg` and `accent` are any CSS colors, `icon` is a node or raw SVG markup that you have already sanitized. Takes precedence over `type`'],
});

export function BadgeWithTimer({ timer, remainingMs, daysLeftLabel = 'days left', className, ...rest }) {
  const left = useCountdown(timer, remainingMs);
  if (left <= 0) return null;
  const days = Math.floor(left / MS_PER_DAY);
  const { hours, minutes, seconds } = msToClock(left);
  const label = days >= 1 ? `${days} ${daysLeftLabel}` : `${formatTimeUnit(hours)}:${formatTimeUnit(minutes)}:${formatTimeUnit(seconds)}`;
  return h(Badge, { 'data-slot': 'badge-with-timer', variant: 'orange', size: 'lg', className: cx('og-product-badge', 'og-product-badge--timer', className), icon: days >= 1 ? h(HourglassIcon) : h(ClockIcon, { size: '100%' }), label, ...rest });
}
describe(BadgeWithTimer, 'An orange badge for an expiring offer: "N days left" with an hourglass for a day or more, or a HH:MM:SS countdown with a clock below that.', {
  timer: ['Date | string | number', null, 'Moment the offer ends; the badge disappears after it'],
  remainingMs: ['number', null, 'A fixed time left, in ms: the badge does not tick'],
  daysLeftLabel: ['string', "'days left'", 'Text after the number of days'],
});
