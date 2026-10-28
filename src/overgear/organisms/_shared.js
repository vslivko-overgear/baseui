// Helpers shared by the organisms: inline icons (currentColor) and price formatting.
import { h } from '../../react.js';

const svg = (size, ...c) => h('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', focusable: 'false' }, ...c);

export const TrashIcon = ({ size = 20 } = {}) => svg(size, h('path', { d: 'M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 10v6m4-6v6' }));
export const SpinnerIcon = ({ size = 20 } = {}) => h('span', { className: 'og-spin', style: { display: 'inline-flex' } }, svg(size, h('path', { d: 'M12 3a9 9 0 1 0 9 9' })));
export const InfoIcon = ({ size = 16 } = {}) => svg(size, h('circle', { cx: 12, cy: 12, r: 9 }), h('path', { d: 'M12 11v5M12 8h.01' }));
export const UserIcon = ({ size = 16 } = {}) => svg(size, h('circle', { cx: 12, cy: 8, r: 4 }), h('path', { d: 'M4 21c0-4 3.6-6 8-6s8 2 8 6' }));
export const AlarmIcon = ({ size = 16 } = {}) => svg(size, h('circle', { cx: 12, cy: 13, r: 8 }), h('path', { d: 'M12 9v4l2 2M4 4 2 6m18-2 2 2' }));
export const CartIcon = ({ size = 20 } = {}) => svg(size, h('path', { d: 'M3 4h2l2.4 11h10.2L20 7H6.2' }), h('circle', { cx: 9, cy: 19.5, r: 1 }), h('circle', { cx: 17, cy: 19.5, r: 1 }));
export const ShieldIcon = ({ size = 16 } = {}) => svg(size, h('path', { d: 'M12 3 5 6v5c0 4.5 3 8.2 7 10 4-1.8 7-5.5 7-10V6l-7-3Z' }), h('path', { d: 'm9 12 2 2 4-4' }));
export const BonusIcon = ({ size = 16 } = {}) => svg(size, h('circle', { cx: 12, cy: 12, r: 9 }), h('path', { d: 'M12 7v10M9 10l3-3 3 3' }));

/** 1234.5, 'USD' -> "$1,234.50". Deterministic (en-US); pass your own formatter to components for other locales. */
export function formatAmountWithCurrency(amount, currency) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, currencyDisplay: 'narrowSymbol' }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

/** 1500 -> "1 500" */
export const formatQuantity = (n) => new Intl.NumberFormat('en-US').format(n).replace(/,/g, ' ');
