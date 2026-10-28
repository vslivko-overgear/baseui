import { h, cx } from '../../react.js';
import { describe } from '../../doc.js';
import { Button } from '../../components/Button.js';
import { PaymentMethods } from '../molecules/PaymentMethods.js';
import { ClockIcon } from '../molecules/CountdownTimer.js';
import { AlarmIcon, CartIcon, ShieldIcon, BonusIcon, formatAmountWithCurrency } from './_shared.js';

const HOUR_PLURALS = [['day', 24], ['hour', 1]];
/** 28 -> "1 day 4 hours"; 0.5 -> "30 minutes". English only: translate in your own layer and pass the result in. */
export function formatHoursAsDuration(hours) {
  const totalMinutes = Math.round(hours * 60);
  if (totalMinutes < 60) return `${totalMinutes} minute${totalMinutes === 1 ? '' : 's'}`;
  let rest = Math.floor(totalMinutes / 60);
  const parts = [];
  for (const [name, size] of HOUR_PLURALS) {
    const n = Math.floor(rest / size);
    rest -= n * size;
    if (n > 0) parts.push(`${n} ${name}${n === 1 ? '' : 's'}`);
  }
  return parts.join(' ');
}

/**
 * Turns raw hours into the props of the delivery rows: with both known, the completion is start + eta; with only eta, just eta.
 * Pure, no React.
 */
export function computeDeliveryTimeProps({ startTimeHours, etaHours, startLabel, completionLabel, format = formatHoursAsDuration } = {}) {
  const hasStart = typeof startTimeHours === 'number' && startTimeHours > 0;
  const hasEta = typeof etaHours === 'number' && etaHours > 0;
  const startTimeFormatted = hasStart ? format(startTimeHours) : undefined;
  const completionHours = hasStart && hasEta ? startTimeHours + etaHours : hasEta ? etaHours : undefined;
  const completionTimeFormatted = completionHours !== undefined ? format(completionHours) : undefined;
  return {
    startTimeFormatted, startLabel: startTimeFormatted ? startLabel : undefined,
    completionTimeFormatted, completionLabel: completionTimeFormatted ? completionLabel : undefined,
    hasStartTime: hasStart,
  };
}

export function CashbackBadge({ percentage, label, className, ...rest }) {
  return h('span', { 'data-slot': 'cashback-badge', className: cx('og-cashback', className), ...rest },
    h('span', { className: 'og-cashback__text' }, `${label} ${percentage}%`), h('span', { className: 'og-cashback__icon' }, h(BonusIcon)));
}
describe(CashbackBadge, 'A small orange-tinted badge next to the price: "Cashback 1%" with a bonus icon.', {
  percentage: ['number', null, 'Cashback percentage'],
  label: ['string', null, 'Text before the number, e.g. "Cashback" or "Up to"'],
});

const DeliveryRow = ({ icon, time, label }) => h('div', { className: 'og-pbb__row' }, h('span', { className: 'og-pbb__row-icon' }, icon), h('b', { className: 'og-pbb__row-time' }, time), h('span', { className: 'og-pbb__row-label' }, label.toLowerCase()));

export function DeliveryTime({ startTimeFormatted, startLabel, completionTimeFormatted, completionLabel, hasStartTime = false, className, ...rest }) {
  if (!(startTimeFormatted || hasStartTime || completionTimeFormatted)) return null;
  return h('div', { 'data-slot': 'delivery-time', className: cx('og-pbb__delivery', className), ...rest },
    startTimeFormatted && startLabel ? h(DeliveryRow, { icon: h(AlarmIcon), time: startTimeFormatted, label: startLabel })
      : hasStartTime ? h('span', { 'aria-hidden': 'true', className: "og-pbb__skeleton bui-skeleton bui-skeleton--text" }) : null,
    completionTimeFormatted && completionLabel && h(DeliveryRow, { icon: h(ClockIcon, { size: 16 }), time: completionTimeFormatted, label: completionLabel }));
}
describe(DeliveryTime, 'The start and completion rows under the price. Pass strings that are already formatted (see computeDeliveryTimeProps); while `hasStartTime` is set but the start is not known yet, a skeleton takes its place.', {
  startTimeFormatted: ['string', null, 'E.g. "4 hours"'],
  startLabel: ['string', null, 'E.g. "start"'],
  completionTimeFormatted: ['string', null, 'E.g. "1 day 4 hours"'],
  completionLabel: ['string', null, 'E.g. "order completion"'],
  hasStartTime: ['boolean', 'false', 'The start time is still loading: show a skeleton row'],
});

export function PriceBlock({ amount, currency, cashbackBadge, formatPrice = formatAmountWithCurrency, className }) {
  const text = formatPrice(amount, currency);
  return h('div', { 'data-slot': 'price-block', className: cx('og-pbb__price-block', className) },
    h('span', { key: `${currency}-${text}`, className: 'og-pbb__price' }, text), cashbackBadge);
}
describe(PriceBlock, 'The big price, with a cashback badge beside it. The price fades in whenever it changes (not with reduced motion).', {
  amount: ['number', null, 'Amount'],
  currency: ['string', null, 'Currency code'],
  cashbackBadge: ['ReactNode', null, 'A CashbackBadge'],
  formatPrice: ['(amount, currency) => string', 'en-US Intl', 'Price formatter'],
});

export function DiscountPrice({ amount, discountedAmount, currency, rate, showDiscount = false, cashbackBadge, formatPrice = formatAmountWithCurrency, className }) {
  return h('div', { 'data-slot': 'discount-price', className: cx('og-pbb__discount', className) },
    rate ? h('div', { className: 'og-pbb__was' }, h('s', null, formatPrice(amount, currency)), showDiscount && h('span', { className: 'og-pbb__off' }, `${rate}% off`)) : null,
    h(PriceBlock, { amount: discountedAmount, currency, cashbackBadge, formatPrice }));
}
describe(DiscountPrice, 'A price with the old one struck through above it and, optionally, the discount rate.', {
  amount: ['number', null, 'Price before the discount'],
  discountedAmount: ['number', null, 'Price to pay'],
  currency: ['string', null, 'Currency code'],
  rate: ['number', null, 'Discount in percent; nothing is struck through without it'],
  showDiscount: ['boolean', 'false', 'Show "N% off" next to the old price'],
  cashbackBadge: ['ReactNode', null, 'A CashbackBadge'],
  formatPrice: ['(amount, currency) => string', 'en-US Intl', 'Price formatter'],
});

export function PurchaseFooter({ guaranteeText, className, ...rest }) {
  return h('div', { 'data-slot': 'purchase-footer', className: cx('og-pbb__footer', className), ...rest },
    h(PaymentMethods, { className: 'og-pbb__payments', label: 'Payment methods' }),
    h('p', { className: 'og-pbb__guarantee' }, h(ShieldIcon), guaranteeText));
}
describe(PurchaseFooter, 'The bottom of the purchase block: accepted payment methods and the money-back guarantee line.', {
  guaranteeText: ['string', null, 'E.g. "100% Money-Back Guarantee"'],
});

export function PurchaseBottomBlock({
  amount, currency, originalAmount, discountRate, showDiscount = false, cashbackBadge, formatPrice,
  startTimeFormatted, startLabel, completionTimeFormatted, completionLabel, hasStartTime = false,
  buttonText, buttonType = 'button', buttonLoading = false, buttonDisabled = false, onButtonClick, guaranteeText, className, ...rest
}) {
  const hasDiscount = !!(originalAmount && discountRate);
  return h('div', { 'data-slot': 'purchase-bottom-block', className: cx('og-pbb', className), ...rest },
    hasDiscount
      ? h(DiscountPrice, { amount: originalAmount, discountedAmount: amount, currency, rate: discountRate, showDiscount, cashbackBadge, formatPrice })
      : h(PriceBlock, { amount, currency, cashbackBadge, formatPrice }),
    h(DeliveryTime, { startTimeFormatted, startLabel, completionTimeFormatted, completionLabel, hasStartTime }),
    h(Button, { type: buttonType, variant: 'primary', size: 'lg', label: buttonText, icon: h(CartIcon), loading: buttonLoading, disabled: buttonDisabled, onClick: onButtonClick, className: 'og-pbb__buy' }),
    h(PurchaseFooter, { guaranteeText }));
}
describe(PurchaseBottomBlock, 'The purchase panel of a product page: price (with an old price and cashback badge), delivery times, a full-width Buy button, payment methods and the guarantee. All texts arrive formatted and translated; delivery strings can come from computeDeliveryTimeProps.', {
  amount: ['number', null, 'Final price'],
  currency: ['string', null, 'Currency code, e.g. "USD"'],
  originalAmount: ['number', null, 'Price before the discount; with `discountRate` it is struck through'],
  discountRate: ['number', null, 'Discount in percent'],
  showDiscount: ['boolean', 'false', 'Show "N% off" beside the old price'],
  cashbackBadge: ['ReactNode', null, 'A CashbackBadge beside the price'],
  startTimeFormatted: ['string', null, 'Start of the work, formatted'],
  startLabel: ['string', null, 'Label of the start row'],
  completionTimeFormatted: ['string', null, 'Completion time, formatted'],
  completionLabel: ['string', null, 'Label of the completion row'],
  hasStartTime: ['boolean', 'false', 'The start time is loading: a skeleton row is shown'],
  buttonText: ['string', null, 'Button label, e.g. "Buy now"'],
  buttonType: ["'button' | 'submit'", "'button'", 'Button type'],
  buttonLoading: ['boolean', 'false', 'Button in the loading state'],
  buttonDisabled: ['boolean', 'false', 'Disables the button'],
  onButtonClick: ['(event) => void', null, 'Button click'],
  guaranteeText: ['string', null, 'Guarantee line'],
  formatPrice: ['(amount, currency) => string', 'en-US Intl', 'Price formatter'],
});
