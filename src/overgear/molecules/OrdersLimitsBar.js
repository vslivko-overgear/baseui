import { h, cx } from '../../react.js';
import { describe } from '../../doc.js';
import { SegmentedControl } from '../../components/SegmentedControl.js';
import { Tooltip } from '../../components/Tooltip.js';

const TONES = ['selfPlay', 'pilot', 'c1'];

function Hint({ text }) {
  return h(Tooltip, { content: text, placement: 'bottom' },
    h('button', { type: 'button', 'data-slot': 'limit-hint', 'aria-label': text, title: text, className: 'og-limits__hint' },
      h('svg', { viewBox: '0 0 12 12', width: 12, height: 12, fill: 'none', 'aria-hidden': 'true' },
        h('path', { d: 'M4.4 4.5a1.6 1.6 0 1 1 2.35 1.55c-.5.35-.85.65-.85 1.35', stroke: 'currentColor', strokeWidth: 1.1, strokeLinecap: 'round' }),
        h('circle', { cx: 5.9, cy: 9, r: 0.8, fill: 'currentColor' }))));
}

export function OrdersViewToggle({ options, value, onChange, ariaLabel, className, ...rest }) {
  return h(SegmentedControl, { size: 'sm', items: options, value, onValueChange: onChange, label: ariaLabel, className: cx('og-orders-toggle', className), ...rest });
}
describe(OrdersViewToggle, 'A segmented Orders / Offers switch. It is separate so it can sit anywhere, for example in the page header on mobile.', {
  options: ['Array<{ value: string; label: string }>', null, 'Segments'],
  value: ['string', null, 'Selected value (controlled)'],
  onChange: ['(value: string) => void', null, 'Called with the chosen value'],
  ariaLabel: ['string', null, 'Accessible name of the group'],
});

export function OrdersLimits({ label, chips, layout = 'inline', className, ...rest }) {
  if (!chips || chips.length === 0) return null;
  return h('div', { 'data-slot': 'orders-limits', 'data-layout': layout, className: cx('og-limits', `og-limits--${layout}`, className), ...rest },
    label && h('span', { className: 'og-limits__label' }, label),
    h('div', { className: 'og-limits__chips' }, chips.map((chip) => h('span', { key: chip.key, 'data-slot': 'limit-chip', 'data-tone': TONES.includes(chip.tone) ? chip.tone : 'c1', className: 'og-limits__chip' },
      h('span', { className: 'og-limits__chip-label' }, chip.label),
      h('span', { className: 'og-limits__chip-value' }, chip.value),
      chip.tooltip && h(Hint, { text: chip.tooltip })))));
}
describe(OrdersLimits, 'A label and a row of limit chips (role, value and a "?" hint). It renders nothing without chips.', {
  label: ['string', null, 'Leading label, e.g. "Active Order Limits:"'],
  chips: ["Array<{ key: string; label: string; value: string; tooltip?: string; tone: 'selfPlay' | 'pilot' | 'c1' }>", null, 'Limit chips'],
  layout: ["'inline' | 'stacked'", "'inline'", 'inline keeps the label and chips on one row; stacked puts the label above the chips (mobile)'],
});

export function OrdersLimitsBar({ segments, activeSegment, onSegmentChange, segmentAriaLabel, limitsLabel, chips, className, ...rest }) {
  const hasSegments = !!(segments && segments.length);
  const hasChips = !!(chips && chips.length);
  if (!hasSegments && !hasChips) return null;
  return h('div', { 'data-slot': 'orders-limits-bar', className: cx('og-limits-bar', className), ...rest },
    hasSegments && h(OrdersViewToggle, { options: segments, value: activeSegment, onChange: onSegmentChange, ariaLabel: segmentAriaLabel }),
    hasChips && h(OrdersLimits, { label: limitsLabel, chips, layout: 'inline' }));
}
describe(OrdersLimitsBar, 'A bar that combines the Orders / Offers switch and the active order limits on one surface. It renders nothing when it has neither.', {
  segments: ['Array<{ value: string; label: string }>', null, 'Switch options; omit to hide the switch'],
  activeSegment: ['string', null, 'Selected segment'],
  onSegmentChange: ['(value: string) => void', null, 'Called with the chosen segment'],
  segmentAriaLabel: ['string', null, 'Accessible name of the switch'],
  limitsLabel: ['string', null, 'Label of the limits block'],
  chips: ["Array<{ key: string; label: string; value: string; tooltip?: string; tone: 'selfPlay' | 'pilot' | 'c1' }>", null, 'Limit chips; omit to hide the limits'],
});
