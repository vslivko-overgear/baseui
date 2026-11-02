import { CollapsibleGroup } from '../components/Collapsible.jsx';
import { meta, playground, example, W } from './_helpers.jsx';

const items = [
  { value: 'a', title: 'How do I request a refund?', content: 'Open the order and choose “Return”. Money is back within 3 days' },
  { value: 'b', title: 'How do I change my password?', content: 'Settings → Security → Change password' },
  { value: 'c', title: 'Unavailable section', content: '—', disabled: true },
];
export default meta({
  title: 'Components/Collapsible Group',
  component: CollapsibleGroup,
  args: { multiple: false, items, defaultValue: ['a'] },
  argTypes: { multiple: { control: 'boolean' } },
});
export const Playground = { ...playground({ source: '{}' }), render: (args) => W(480, <CollapsibleGroup key={String(args.multiple)} {...args} />) };
export const Multiple = example({
  name: 'Multiple',
  render: () => W(480, <CollapsibleGroup multiple defaultValue={['a', 'b']} items={items} />),
  source: `<CollapsibleGroup multiple defaultValue={['a', 'b']} items={items} />`,
});
export const __namedExportsOrder = ['Playground', 'Multiple'];
