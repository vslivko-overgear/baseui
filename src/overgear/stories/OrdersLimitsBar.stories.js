import { h, useState } from '../../react.js';
import { OrdersLimitsBar, OrdersLimits, OrdersViewToggle } from '../molecules/OrdersLimitsBar.js';
import { meta, playground, example, Stack } from '../../stories/_helpers.js';

const SEGMENTS = [{ value: 'orders', label: 'Orders' }, { value: 'offers', label: 'Offers' }];
const CHIPS = [
  { key: 'self', label: 'Self-Play', value: '3/999', tone: 'selfPlay', tooltip: 'Orders you may take with your own account at the same time.' },
  { key: 'pilot', label: 'Pilot', value: 'Yes', tone: 'pilot', tooltip: 'Pilot orders are available at your current rank.' },
  { key: 'c1', label: 'C1', value: '2/5', tone: 'c1', tooltip: 'Concurrent orders of category C1.' },
];
const Bar = (props) => { const [v, setV] = useState('orders'); return h(OrdersLimitsBar, { segmentAriaLabel: 'Orders view', limitsLabel: 'Active Order Limits:', ...props, activeSegment: v, onSegmentChange: setV }); };

export default meta({
  title: 'Overgear/Molecules/OrdersLimitsBar', component: OrdersLimitsBar,
  args: { segments: SEGMENTS, chips: CHIPS, limitsLabel: 'Active Order Limits:', segmentAriaLabel: 'Orders view' },
  argTypes: { segments: { control: 'object' }, chips: { control: 'object' }, limitsLabel: { control: 'text' }, segmentAriaLabel: { control: 'text' }, activeSegment: { control: false }, onSegmentChange: { control: false } },
});
export const Playground = { ...playground({ source: `<OrdersLimitsBar segments={segments} activeSegment="orders" onSegmentChange={setView} limitsLabel="Active Order Limits:" chips={chips} />` }), render: (args) => h(Bar, args) };
export const Combined = example({
  name: 'Combined Bar', render: () => h(Bar, { segments: SEGMENTS, chips: CHIPS }),
  source: `<OrdersLimitsBar segments={segments} chips={chips} limitsLabel="Active Order Limits:" />`,
});
export const LimitsOnly = example({
  name: 'Limits Only', render: () => h(Bar, { chips: CHIPS }),
  source: `<OrdersLimitsBar chips={chips} limitsLabel="Active Order Limits:" />`,
});
export const ToggleOnly = example({
  name: 'Toggle Only', render: () => h(Bar, { segments: SEGMENTS }),
  source: `<OrdersLimitsBar segments={segments} activeSegment="orders" />`,
});
export const Parts = example({
  name: 'Toggle And Limits', description: 'OrdersViewToggle and OrdersLimits can be placed separately; the stacked limits suit mobile.',
  render: () => h(Stack, { width: 360 },
    h(OrdersViewToggle, { options: SEGMENTS, ariaLabel: 'Orders view' }),
    h(OrdersLimits, { label: 'Active Order Limits:', chips: CHIPS, layout: 'stacked' }),
    h(OrdersLimits, { label: 'Inline:', chips: CHIPS.slice(0, 2), layout: 'inline' })),
  source: `<OrdersViewToggle options={segments} />
<OrdersLimits label="Active Order Limits:" chips={chips} layout="stacked" />`,
});
export const Empty = example({
  name: 'Empty', description: 'With neither segments nor chips the bar renders nothing.',
  render: () => h('div', { style: { font: 'var(--baseui-Typography-Text-14-Regular)', color: 'var(--baseui-Text-and-Icon-Secondary)' } }, '(nothing below)', h(OrdersLimitsBar, {})),
  source: `<OrdersLimitsBar />`,
});
export const __namedExportsOrder = ['Playground', 'Combined', 'LimitsOnly', 'ToggleOnly', 'Parts', 'Empty'];
