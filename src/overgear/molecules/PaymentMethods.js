import { h, cx } from '../../react.js';
import { describe } from '../../doc.js';

// Neutral wordmark placeholders: the brand artwork is not reproduced here.
export const PAYMENT_METHODS = [
  { id: 'mastercard', label: 'Mastercard', mark: 'circles' },
  { id: 'visa', label: 'Visa' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'apple-pay', label: 'Apple Pay' },
  { id: 'google-pay', label: 'Google Pay' },
  { id: 'jcb', label: 'JCB' },
  { id: 'stripe', label: 'Stripe' },
  { id: 'sepa', label: 'SEPA' },
];

function Logo({ method }) {
  return h('li', { 'data-slot': 'payment-method', 'data-method': method.id, className: 'og-payments__item' },
    h('span', { role: 'img', 'aria-label': method.label, className: 'og-payments__logo' },
      method.mark === 'circles' && h('span', { 'aria-hidden': 'true', className: 'og-payments__circles' }, h('i'), h('i')),
      method.mark !== 'circles' && h('span', { 'aria-hidden': 'true', className: 'og-payments__word' }, method.label)));
}

export function PaymentMethods({ methods = PAYMENT_METHODS, label = 'Payment methods', className, ...rest }) {
  return h('ul', { 'data-slot': 'payment-methods', 'aria-label': label, className: cx('og-payments', className), ...rest },
    methods.map((m) => h(Logo, { key: m.id, method: m })));
}
describe(PaymentMethods, 'A wrapping grid of accepted payment method logos. The logos here are neutral wordmark placeholders, not brand artwork.', {
  methods: ["Array<{ id: string; label: string; mark?: 'circles' }>", 'eight common methods', 'Logos to show; `label` is the wordmark and the accessible name'],
  label: ['string', "'Payment methods'", 'Accessible name of the list'],
});
