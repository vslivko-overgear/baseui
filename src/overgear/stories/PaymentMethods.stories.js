import { h } from '../../react.js';
import { PaymentMethods, PAYMENT_METHODS } from '../molecules/PaymentMethods.js';
import { meta, playground, example } from '../../stories/_helpers.js';

export default meta({
  title: 'Overgear/Molecules/PaymentMethods', component: PaymentMethods, args: { label: 'Payment methods' },
  argTypes: { label: { control: 'text' }, methods: { control: false } },
});
export const Playground = { ...playground({ source: `<PaymentMethods />` }), render: (args) => h(PaymentMethods, args) };
export const Default = example({
  name: 'Default', description: 'Neutral wordmark placeholders stand in for the brand logos.',
  render: () => h(PaymentMethods), source: `<PaymentMethods />`,
});
export const CustomSet = example({
  name: 'Custom Set', render: () => h(PaymentMethods, { methods: [PAYMENT_METHODS[1], PAYMENT_METHODS[2], { id: 'crypto', label: 'Crypto' }, { id: 'sbp', label: 'SBP' }] }),
  source: `<PaymentMethods methods={[{ id: 'visa', label: 'Visa' }, { id: 'crypto', label: 'Crypto' }]} />`,
});
export const Narrow = example({
  name: 'Narrow Container', render: () => h('div', { style: { width: 300, maxWidth: '100%' } }, h(PaymentMethods)),
  source: `<PaymentMethods />`,
});
export const __namedExportsOrder = ['Playground', 'Default', 'CustomSet', 'Narrow'];
