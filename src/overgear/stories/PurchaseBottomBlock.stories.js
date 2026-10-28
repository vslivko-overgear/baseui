import { h } from '../../react.js';
import { PurchaseBottomBlock, CashbackBadge, computeDeliveryTimeProps } from '../organisms/PurchaseBottomBlock.js';
import { meta, playground, example, Row } from '../../stories/_helpers.js';

const delivery = computeDeliveryTimeProps({ startTimeHours: 4, etaHours: 24, startLabel: 'Start', completionLabel: 'Order completion' });
const base = { amount: 49.9, currency: 'USD', buttonText: 'Buy now', guaranteeText: '100% Money-Back Guarantee', ...delivery };
const box = (c, w = 360) => h('div', { style: { width: w, maxWidth: '100%' } }, c);

export default meta({
  title: 'Overgear/Organisms/PurchaseBottomBlock', component: PurchaseBottomBlock,
  args: { amount: 49.9, currency: 'USD', originalAmount: 0, discountRate: 0, showDiscount: true, cashback: false, buttonText: 'Buy now', buttonLoading: false, buttonDisabled: false, guaranteeText: '100% Money-Back Guarantee' },
  argTypes: {
    amount: { control: 'number' }, currency: { control: 'inline-radio', options: ['USD', 'EUR', 'RUB'] }, originalAmount: { control: 'number' }, discountRate: { control: 'number' },
    showDiscount: { control: 'boolean' }, buttonText: { control: 'text' }, buttonLoading: { control: 'boolean' }, buttonDisabled: { control: 'boolean' }, guaranteeText: { control: 'text' },
    // A story setting for `cashbackBadge`.
    cashback: { control: 'boolean', docs: false },
    cashbackBadge: { control: false }, onButtonClick: { control: false }, startTimeFormatted: { control: false }, completionTimeFormatted: { control: false },
  },
});
export const Playground = {
  ...playground({ source: `<PurchaseBottomBlock amount={49.9} currency="USD" buttonText="Buy now" guaranteeText="100% Money-Back Guarantee" />` }),
  render: ({ cashback, ...args }) => box(h(PurchaseBottomBlock, { ...base, ...args, cashbackBadge: cashback ? h(CashbackBadge, { label: 'Cashback', percentage: 1 }) : undefined })),
};
export const Default = example({
  name: 'Default', render: () => box(h(PurchaseBottomBlock, base)),
  source: `<PurchaseBottomBlock amount={49.9} currency="USD" {...computeDeliveryTimeProps({ startTimeHours: 4, etaHours: 24, startLabel: 'Start', completionLabel: 'Order completion' })} buttonText="Buy now" guaranteeText="100% Money-Back Guarantee" />`,
});
export const Discount = example({
  name: 'Discount', description: 'The old price is struck through; showDiscount adds the rate.',
  render: () => box(h(PurchaseBottomBlock, { ...base, amount: 39.9, originalAmount: 49.9, discountRate: 20, showDiscount: true })),
  source: `<PurchaseBottomBlock amount={39.9} originalAmount={49.9} discountRate={20} showDiscount ... />`,
});
export const Cashback = example({
  name: 'Cashback', render: () => box(h(PurchaseBottomBlock, { ...base, amount: 3990, currency: 'RUB', cashbackBadge: h(CashbackBadge, { label: 'Cashback', percentage: 3 }) })),
  source: `<PurchaseBottomBlock cashbackBadge={<CashbackBadge label="Cashback" percentage={3} />} ... />`,
});
export const LoadingStart = example({
  name: 'Loading Start Time', description: 'While the start time loads, a skeleton row takes its place; completion shows as soon as it is known.',
  render: () => box(h(PurchaseBottomBlock, { ...base, startTimeFormatted: undefined, startLabel: undefined, hasStartTime: true })),
  source: `<PurchaseBottomBlock hasStartTime completionTimeFormatted="1 day" completionLabel="Order completion" ... />`,
});
export const ButtonStates = example({
  name: 'Button States', render: () => h(Row, { align: 'flex-start', gap: 'var(--baseui-spacing-24)' },
    box(h(PurchaseBottomBlock, { ...base, buttonLoading: true, ...{ startTimeFormatted: undefined, completionTimeFormatted: undefined, hasStartTime: false } }), 280),
    box(h(PurchaseBottomBlock, { ...base, buttonDisabled: true, startTimeFormatted: undefined, completionTimeFormatted: undefined, hasStartTime: false }), 280)),
  source: `<PurchaseBottomBlock buttonLoading ... /> <PurchaseBottomBlock buttonDisabled ... />`,
});
export const Mobile = example({
  name: 'Mobile', render: () => box(h(PurchaseBottomBlock, { ...base, amount: 39.9, originalAmount: 49.9, discountRate: 20, cashbackBadge: h(CashbackBadge, { label: 'Cashback', percentage: 1 }) }), 320),
  source: `<div style={{ width: 320 }}><PurchaseBottomBlock ... /></div>`,
});
export const __namedExportsOrder = ['Playground', 'Default', 'Discount', 'Cashback', 'LoadingStart', 'ButtonStates', 'Mobile'];
