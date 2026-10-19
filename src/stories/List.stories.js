import { h } from '../react.js';
import { List, ListItem, ROW_ARGS, ROW_ARGTYPES, rowProps, TITLES, fixDocs } from './_listkit.js';
import { meta, example, W } from './_helpers.js';

fixDocs(List, {
  size: { description: 'Row height of every `ListItem` inside: `md` (56px), `sm` (48px) or `xsm` (40px); the sizes of Text Input. A row can set its own' },
  title: { description: 'Group title above the list, aligned with the text of the rows; it gives the list its accessible name' },
  divider: { description: 'A divider below the group, as wide as the text of the rows: it separates the group from the next one' },
  children: { description: '`ListItem` rows' },
});

export default meta({
  title: 'Components/List', component: List,
  args: { title: 'Mailbox', divider: false, size: 'md', rows: 4, ...ROW_ARGS, leading: 'icon' },
  argTypes: {
    title: { control: 'text' },
    size: { control: 'inline-radio', options: ['md', 'sm', 'xsm'] },
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
  render: (a) => W(360, h(List, { title: a.title, size: a.size, divider: a.divider }, rows(a))),
};
export const Sections = example({
  name: 'Sections', render: () => W(360, h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-16)' } },
    h(List, { title: 'Mailbox', divider: true }, rows({ rows: 2, ...ROW_ARGS, leading: 'icon' }, 'md')),
    h(List, { title: 'People' }, rows({ rows: 2, ...ROW_ARGS, leading: 'avatar', subtitle: true }, 'md')))),
  source: `<List title="Mailbox" divider>…</List>\n<List title="People">…</List>  // all but the last with divider`,
});
export const Sizes = example({
  name: 'Sizes', render: () => W(360, h('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--baseui-spacing-16)' } },
    ['md', 'sm', 'xsm'].map((s) => h(List, { key: s, title: s, size: s }, rows({ rows: 2, ...ROW_ARGS, leading: 'icon', details: 'text' }, s))))),
  source: `<List size="xsm">…</List>  // md 56px | sm 48px | xsm 40px`,
});
export const Settings = example({
  name: 'Switches', render: () => W(360, h(List, { title: 'Notifications' }, rows({ rows: 3, ...ROW_ARGS, control: 'switch', subtitle: true }, 'md'))),
  source: `<ListItem subtitle="Caption" control={<Switch size="sm" aria-label="Inbox" />}>Inbox</ListItem>`,
});
export const __namedExportsOrder = ['Playground', 'Sections', 'Sizes', 'Settings'];
