import { h } from '../react.js';
import { Tabs, TabList, Tab, TabPanel } from '../components/Tabs.js';
import { meta, playground, example } from './_helpers.js';
import { Filled } from './_ui.js';
const { Menu01, Grid01, Bell01, Settings02 } = Filled;

const items = [
  { value: 'overview', label: 'Overview', icon: h(Grid01), counter: 12 },
  { value: 'activity', label: 'Activity', icon: h(Bell01), badge: 'New' },
  { value: 'settings', label: 'Settings', icon: h(Settings02) },
  { value: 'billing', label: 'Billing', icon: h(Menu01), disabled: true, badge: 9 },
];
export default meta({
  title: 'Components/Tabs', component: Tabs,
  args: { defaultValue: 'overview', size: 'md', fullWidth: false, showIcon: true, showCounter: true, showBadge: true },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] }, fullWidth: { control: 'boolean' },
    showIcon: { control: 'boolean' }, showCounter: { control: 'boolean' }, showBadge: { control: 'boolean' },
    defaultValue: { control: false },
  },
});
const list = (listProps) => h(Tabs, { defaultValue: 'overview' },
  h(TabList, { label: 'Project sections', ...listProps }, items.map(({ label, ...t }) => h(Tab, { key: t.value, ...t }, label))),
  h(TabPanel, { value: 'overview' }, 'General project information.'), h(TabPanel, { value: 'activity' }, 'Recent activity.'), h(TabPanel, { value: 'settings' }, 'Project settings.'));
export const Playground = {
  ...playground({ source: `<Tabs defaultValue="overview">
  <TabList label="Project sections">
    <Tab value="overview" icon={<Grid01 />} counter={12}>Overview</Tab>
    <Tab value="activity" badge="New">Activity</Tab>
  </TabList>
  <TabPanel value="overview">…</TabPanel>
  <TabPanel value="activity">…</TabPanel>
</Tabs>` }),
  render: ({ defaultValue, ...args }) => h('div', { style: { width: 560, maxWidth: '100%' } }, list(args)),
};
export const FullWidth = example({
  name: 'Full Width', render: () => h('div', { style: { width: 720, maxWidth: '100%' } }, list({ fullWidth: true })),
  source: `<TabList fullWidth>…</TabList>`,
});
export const Sizes = example({
  name: 'Sizes', render: () => h('div', { style: { display: 'flex', flexDirection: 'column', gap: 24, width: 640, maxWidth: '100%' } }, ['xl', 'lg', 'md', 'sm'].map((size) => list({ size }))),
  source: `<TabList size="xl">…</TabList>  // xl | lg | md | sm`,
});
export const Slide = example({
  name: 'Slide', render: () => h('div', { style: { width: 300, maxWidth: '100%' } }, list({})),
  source: `// A row wider than its container scrolls; slide buttons appear at the edges`,
});
export const SingleTab = example({ name: 'Tab', render: () => h(Tabs, { defaultValue: 'a' }, h(TabList, { label: 'Demo' }, h(Tab, { value: 'a' }, 'First'), h(Tab, { value: 'b' }, 'Second')), h(TabPanel, { value: 'a' }, 'First panel'), h(TabPanel, { value: 'b' }, 'Second panel')), source: `<Tab value="a">First</Tab>
<TabPanel value="a">First panel</TabPanel>` });
export const __namedExportsOrder = ['Playground', 'FullWidth', 'Sizes', 'Slide', 'SingleTab'];
