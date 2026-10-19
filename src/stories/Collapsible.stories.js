import { h } from '../react.js';
import { Collapsible } from '../components/Collapsible.js';
import { meta, playground, W } from './_helpers.js';

export default meta({
  title: 'Components/Collapsible', component: Collapsible, args: { title: 'Shipping details', children: 'Orders ship within 2 business days. Tracking is sent by email.', defaultOpen: false, disabled: false },
  argTypes: { defaultOpen: { control: 'boolean' }, title: { control: 'text' }, children: { control: 'text' }, disabled: { control: 'boolean' } },
});
export const Playground = { ...playground({ source: '{}' }), render: (args) => W(480, h(Collapsible, { key: String(args.defaultOpen), ...args })) };
export const __namedExportsOrder = ['Playground'];
