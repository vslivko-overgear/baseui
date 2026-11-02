import { Tabs } from '../components/Tabs.jsx';
import { meta, playground, example } from './_helpers.jsx';
import { Filled } from './_ui.jsx';
const { Menu01, Grid01, Bell01, Settings02 } = Filled;

const items = [
  { value: 'overview', label: 'Overview', icon: <Grid01 />, counter: 12, content: 'General project information' },
  { value: 'activity', label: 'Activity', icon: <Bell01 />, badge: 'New', content: 'Recent activity' },
  { value: 'settings', label: 'Settings', icon: <Settings02 />, content: 'Project settings' },
  { value: 'billing', label: 'Billing', icon: <Menu01 />, disabled: true, badge: 9 },
];
export default meta({
  title: 'Components/Tabs',
  component: Tabs,
  args: { motion: 'theme', defaultValue: 'overview', size: 'md', showIcon: true, showCounter: true, showBadge: true },
  argTypes: {
    motion: { control: 'inline-radio', options: ['theme', 'off', 'basic', 'enhanced'], mapping: { theme: undefined } },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    showIcon: { control: 'boolean' },
    showCounter: { control: 'boolean' },
    showBadge: { control: 'boolean' },
    defaultValue: { control: false },
  },
});
const tabs = (props) => <Tabs label="Project sections" items={items} {...props} />;
export const Playground = {
  ...playground({
    source: `<Tabs
  label="Project sections"
  items={[
    { value: 'overview', label: 'Overview', icon: <Grid01 />, counter: 12, content: <Overview /> },
    { value: 'activity', label: 'Activity', badge: 'New', content: <Activity /> },
  ]}
/>`,
  }),
  render: ({ defaultValue, ...args }) => tabs(args),
};
export const Sizes = example({
  name: 'Sizes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 640, maxWidth: '100%' }}>
      {['xl', 'lg', 'md', 'sm'].map((size) => tabs({ size, key: size }))}
    </div>
  ),
  source: `<Tabs size="xl" items={…} />  // xl | lg | md | sm`,
});
export const Slide = example({
  name: 'Slide',
  render: () => <div style={{ width: 300, maxWidth: '100%' }}>{tabs({})}</div>,
  source: `// A row wider than its container scrolls; from 1024px slide buttons and a fade appear at the edges`,
});
export const Slot = example({
  name: 'Panel slot',
  description: 'The content of a tab goes under the row: in the `content` of an item, or in `children`, which is a node or a function of the selected value. Nothing above the row depends on the tab',
  render: () => (
    <Tabs label="Version" items={[{ value: 'a', label: 'First' }, { value: 'b', label: 'Second' }]}>
      {(value) => `The panel of the ${value === 'a' ? 'first' : 'second'} tab`}
    </Tabs>
  ),
  source: `<Tabs items={[{ value: 'a', label: 'First' }, { value: 'b', label: 'Second' }]}>
  {(value) => <Panel version={value} />}
</Tabs>`,
});
export const __namedExportsOrder = ['Playground', 'Sizes', 'Slide', 'Slot'];
