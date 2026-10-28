import { h, cx } from '../../react.js';
import { describe } from '../../doc.js';
import { CountdownTimer } from './CountdownTimer.js';

export function NextRaidBadge({ timerTargetDate, remainingMs, datePretty, isTimer, labelText, compact = false, className, ...rest }) {
  return h('div', { 'data-slot': 'next-raid', 'data-compact': compact || undefined, className: cx('og-next-raid', compact && 'og-next-raid--compact', className), ...rest },
    h('span', { className: 'og-next-raid__label' }, labelText),
    h('span', { className: 'og-next-raid__value' }, isTimer ? h(CountdownTimer, { targetDate: timerTargetDate, remainingMs, hideIcon: true }) : datePretty));
}
describe(NextRaidBadge, 'A dark badge saying when the next raid starts: either a live countdown or a ready-made date.', {
  isTimer: ['boolean', null, 'Show the live countdown; otherwise show `datePretty`'],
  timerTargetDate: ['Date | string | number', null, 'Countdown target (used when `isTimer`)'],
  remainingMs: ['number', null, 'A fixed time left, in ms, instead of ticking toward `timerTargetDate`'],
  datePretty: ['string', null, 'Formatted date shown when `isTimer` is false, e.g. "18 Mar 13:00"'],
  labelText: ['string', null, 'Leading label, e.g. "Next raid in:"'],
  compact: ['boolean', 'false', 'Smaller variant for compact cards'],
});
