import { h } from '../react.js';
import { List, ListItem, ROW_ARGS, ROW_ARGTYPES, rowProps, TITLES } from './_listkit.js';
import { meta, example, W } from './_helpers.js';

export default meta({
  title: 'Components/List', component: List,
  args: { title: 'Mailbox', divider: false, size: 'md', spacing: 'sm', rows: 4, ...ROW_ARGS, leading: 'icon' },
  argTypes: {
    title: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    spacing: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    divider: { control: 'boolean' },
    rows: { control: { type: 'range', min: 1, max: 6, step: 1 }, docs: false, description: 'How many rows the list has (a story setting)' },
    ...ROW_ARGTYPES,
  },
});
const rows = (a, size = a.size) => Array.from({ length: a.rows }, (_, i) => h(ListItem, { key: i, onClick: () => {}, ...rowProps(a, size, i) }, TITLES[i]));
export const Playground = {
  parameters: { docs: { source: { originalSource: `<List title="Mailbox" size="md">
  <ListItem icon={<HomeIcon />} onClick={open}>Inbox</ListItem>
  <ListItem icon={<BellIcon />} onClick={open}>Drafts</ListItem>
</List>` } } },
  render: (a) => W(360, h(List, { title: a.title, size: a.size, spacing: a.spacing, divider: a.divider }, rows(a))),
};
export const Sections = example({
  name: 'Sections', render: () => W(360, h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-16)' } },
    h(List, { title: 'Mailbox', divider: true }, rows({ rows: 2, ...ROW_ARGS, leading: 'icon' }, 'md')),
    h(List, { title: 'People' }, rows({ rows: 2, ...ROW_ARGS, leading: 'avatar', subtitle: true }, 'md')))),
  source: `<List title="Mailbox" divider>…</List>\n<List title="People">…</List>  // all but the last with divider`,
});
export const Sizes = example({
  name: 'Sizes', render: () => W(360, h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-16)' } },
    ['md', 'sm'].map((s) => h(List, { key: s, title: s, size: s }, rows({ rows: 2, ...ROW_ARGS, leading: 'icon', details: 'text' }, s))))),
  source: `<List size="sm">…</List>  // sm 40px | md 48px`,
});
export const Spacing = example({
  name: 'Spacing', render: () => W(360, h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-16)' } },
    ['sm', 'md', 'lg'].map((sp) => h(List, { key: sp, title: `spacing ${sp}`, spacing: sp }, rows({ rows: 3, ...ROW_ARGS, leading: 'icon' }, 'md'))))),
  source: `<List spacing="lg">…</List>  // sm compact | md +8px | lg +16px`,
});
export const Settings = example({
  name: 'Switches', render: () => W(360, h(List, { title: 'Notifications' }, rows({ rows: 3, ...ROW_ARGS, control: 'switch', subtitle: true }, 'md'))),
  source: `<ListItem subtitle="Caption" control={<Switch size="md" aria-label="Inbox" />}>Inbox</ListItem>`,
});
export const __namedExportsOrder = ['Playground', 'Sections', 'Sizes', 'Spacing', 'Settings'];
