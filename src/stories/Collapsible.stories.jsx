import { Collapsible } from '../components/Collapsible.jsx';
import { meta, playground, W } from './_helpers.jsx';

export default meta({
  title: 'Components/Collapsible',
  component: Collapsible,
  args: { title: 'Shipping details', children: 'Orders ship within 2 business days. Tracking is sent by email', defaultOpen: false, disabled: false },
  argTypes: { defaultOpen: { control: 'boolean' }, title: { control: 'text' }, children: { control: 'text' }, disabled: { control: 'boolean' } },
});
export const Playground = { ...playground({ source: '{}' }), render: (args) => W(480, <Collapsible key={String(args.defaultOpen)} {...args} />) };
export const __namedExportsOrder = ['Playground'];
