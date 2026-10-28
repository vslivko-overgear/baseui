import { h, cx } from '../../react.js';
import { describe } from '../../doc.js';
import { useCountdown, formatTimeUnit } from './CountdownTimer.js';

const S = 1000, M = 60 * S, H = 60 * M, D = 24 * H;
/** Splits milliseconds into days, hours, minutes and seconds. */
export const msToDuration = (ms) => ({ days: Math.floor(ms / D), hours: Math.floor((ms % D) / H), minutes: Math.floor((ms % H) / M), seconds: Math.floor((ms % M) / S) });

/** Time left until `expireTime` as { days, hours, minutes, seconds }, or null once it has passed. Pass `staticMs` for a fixed value. */
export function useLineItemOfferTimer(expireTime, staticMs) {
  const left = useCountdown(expireTime, staticMs);
  return left <= 0 ? null : msToDuration(left);
}

export function PurchaseWidgetTimer({ offerExpireTime, remainingMs, title = 'Offer expires in', labels, className, ...rest }) {
  const value = useLineItemOfferTimer(offerExpireTime, remainingMs);
  const names = { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds', ...labels };
  return h('div', { 'data-slot': 'purchase-timer', role: 'timer', className: cx('og-purchase-timer', className), ...rest },
    h('div', { className: 'og-purchase-timer__title' }, title),
    h('div', { className: 'og-purchase-timer__units' }, ['days', 'hours', 'minutes', 'seconds'].map((k) => h('div', { key: k, 'data-slot': 'purchase-timer-unit', className: 'og-purchase-timer__unit' },
      h('span', { className: 'og-purchase-timer__num' }, formatTimeUnit(value ? value[k] : 0)),
      h('span', { className: 'og-purchase-timer__name' }, names[k])))));
}
describe(PurchaseWidgetTimer, 'A countdown panel for a limited-time offer: days, hours, minutes and seconds on a warm gradient.', {
  offerExpireTime: ['Date | string | number', null, 'Moment the offer ends'],
  remainingMs: ['number', null, 'A fixed time left, in ms: the panel does not tick'],
  title: ['string', "'Offer expires in'", 'Heading text'],
  labels: ['{ days?: string; hours?: string; minutes?: string; seconds?: string }', null, 'Unit captions (for translation)'],
});
