import { h } from '../react.js';
import { SegmentedControl } from '../components/SegmentedControl.js';
import { meta, playground, example } from './_helpers.js';
import { Menu01, Grid01, Map01, Table } from './_ui.js';

const items = [
  { value: 'list', label: 'List', icon: h(Menu01), counter: 12 },
  { value: 'grid', label: 'Grid', icon: h(Grid01), counter: 8 },
  { value: 'map', label: 'Map', icon: h(Map01), badge: 'New' },
  { value: 'table', label: 'Table', icon: h(Table), disabled: true },
];
const plain = [{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }, { value: 'year', label: 'Year', disabled: true }];
export default meta({
  title: 'Components/Segmented Control', component: SegmentedControl,
  args: { items, size: 'md', fullWidth: false, showIcon: true, shape: 'rounded', showLabel: true, showCounter: true, showBadge: true, label: 'View' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] }, fullWidth: { control: 'boolean' },
    shape: { control: 'inline-radio', options: ['rounded', 'circle'] }, showIcon: { control: 'boolean' }, showLabel: { control: 'boolean' }, showCounter: { control: 'boolean' }, showBadge: { control: 'boolean' },
    items: { control: false },
  },
});
export const Playground = { ...playground({ source: '{}' }), render: (args) => h(SegmentedControl, args) };
export const Item = example({
  name: 'Segmented Control Item', render: () => h(SegmentedControl, { items: [{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }], label: 'View' }),
  source: `<SegmentedControl items={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]} />`,
});
export const IconsOnly = example({
  name: 'Icons Only', render: () => h(SegmentedControl, { items: items.slice(0, 3).map(({ counter, badge, ...i }) => i), showLabel: false, label: 'View', defaultValue: 'grid' }),
  source: `<SegmentedControl showLabel={false} items={[{ value: 'list', label: 'List', icon: <Menu01 /> }, …]} />`,
});
export const CounterAndBadge = example({
  name: 'Counter and Badge', render: () => h(SegmentedControl, { items: [{ value: 'all', label: 'All', counter: 24 }, { value: 'open', label: 'Open', counter: 8 }, { value: 'review', label: 'Review', badge: 'New' }], label: 'Filter', defaultValue: 'all' }),
  source: `<SegmentedControl items={[{ value: 'all', label: 'All', counter: 24 }, { value: 'review', label: 'Review', badge: 'New' }]} />`,
});
export const FullWidth = example({
  name: 'Full Width', render: () => h(SegmentedControl, { items: plain, fullWidth: true, label: 'Range' }),
  source: `<SegmentedControl fullWidth items={items} />`,
});
export const __namedExportsOrder = ['Playground', 'Item', 'IconsOnly', 'CounterAndBadge', 'FullWidth'];
