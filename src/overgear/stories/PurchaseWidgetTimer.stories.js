import { h } from '../../react.js';
import { PurchaseWidgetTimer } from '../molecules/PurchaseWidgetTimer.js';
import { meta, playground, example, Stack } from '../../stories/_helpers.js';

const DAY = 86400000;
const HOUR = 3600000;
const box = (c) => h('div', { style: { width: 420, maxWidth: '100%' } }, c);
export default meta({
  title: 'Overgear/Molecules/PurchaseWidgetTimer', component: PurchaseWidgetTimer,
  args: { daysLeft: 2, title: 'Offer expires in' },
  argTypes: {
    // Story setting: turned into an expiry date, so the panel really ticks.
    daysLeft: { control: { type: 'number', min: 0, max: 30, step: 1 }, docs: false },
    title: { control: 'text' }, offerExpireTime: { control: false }, remainingMs: { control: false }, labels: { control: 'object' },
  },
});
export const Playground = {
  ...playground({ source: `<PurchaseWidgetTimer offerExpireTime={new Date('2030-01-01T12:00:00')} />` }),
  render: ({ daysLeft, ...args }) => box(h(PurchaseWidgetTimer, { key: daysLeft, ...args, offerExpireTime: new Date(Date.now() + daysLeft * DAY + 3 * HOUR + 7 * 60000 + 59000) })),
};
export const Live = example({
  name: 'Live', render: () => box(h(PurchaseWidgetTimer, { offerExpireTime: new Date(Date.now() + 1 * DAY + 4 * HOUR + 30 * 60000) })),
  source: `<PurchaseWidgetTimer offerExpireTime={expiresAt} />`,
});
export const Static = example({
  name: 'Static Value', description: 'remainingMs fixes the value: nothing ticks.',
  render: () => box(h(PurchaseWidgetTimer, { remainingMs: 3 * DAY + 12 * HOUR + 5 * 60000 + 9000 })),
  source: `<PurchaseWidgetTimer remainingMs={3 * 86400000} />`,
});
export const Translated = example({
  name: 'Custom Labels', render: () => box(h(PurchaseWidgetTimer, { remainingMs: 5 * HOUR + 42 * 60000, title: 'Sale ends in', labels: { days: 'd', hours: 'h', minutes: 'min', seconds: 's' } })),
  source: `<PurchaseWidgetTimer title="Sale ends in" labels={{ days: 'd', hours: 'h', minutes: 'min', seconds: 's' }} ... />`,
});
export const Expired = example({
  name: 'Expired', description: 'After the end every unit reads 00.',
  render: () => box(h(PurchaseWidgetTimer, { offerExpireTime: new Date(Date.now() - 1000) })),
  source: `<PurchaseWidgetTimer offerExpireTime={pastDate} />`,
});
export const __namedExportsOrder = ['Playground', 'Live', 'Static', 'Translated', 'Expired'];
