import { h, useState } from '../react.js';
import { List, ListItem, ROW_ARGS, ROW_ARGTYPES, rowProps, AVATAR_BY_ROW } from './_listkit.js';
import { meta, example, W } from './_helpers.js';
import { Heart } from './_ui.js';

export default meta({
  title: 'Components/List Item', component: ListItem,
  args: { children: 'Inbox', size: 'md', ...ROW_ARGS, leading: 'icon', interactive: true, nested: false, defaultExpanded: false, active: false, disabled: false, subitem: false },
  argTypes: {
    children: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    ...ROW_ARGTYPES,
    interactive: { control: 'boolean', docs: false, description: 'Gives the row an `onClick`: a button with hover; without it the row is only text (a story setting)' },
    nested: { control: 'boolean', docs: false, description: 'Gives the row `items`, so it expands (a story setting)', if: { arg: 'subitem', eq: false } },
    defaultExpanded: { control: 'boolean', if: { arg: 'nested', eq: true } },
    active: { control: 'boolean' }, disabled: { control: 'boolean' },
    subitem: { control: 'boolean' },
  },
});
const sub = (size) => [h(ListItem, { key: 1, subitem: true, size, onClick: () => {} }, 'Starred'), h(ListItem, { key: 2, subitem: true, size, onClick: () => {} }, 'Important')];
export const Playground = {
  parameters: { docs: { source: { originalSource: `<ListItem
  icon={<HeartIcon />}
  subtitle="Caption"
  details="12 min"
  control={<Switch size="md" aria-label="Inbox" />}
  onClick={open}
>
  Inbox
</ListItem>` } } },
  render: ({ interactive, nested, children, defaultExpanded, ...a }) => W(360, h(List, { size: a.size }, h(ListItem, {
    key: `${a.size}${nested}${defaultExpanded}`, defaultExpanded, size: a.size, active: a.active, disabled: a.disabled, subitem: a.subitem, ...rowProps(a, a.size),
    ...(interactive || nested ? { onClick: () => {} } : {}), ...(nested && { items: sub(a.size) }),
  }, children))),
};
export const States = example({
  name: 'States', render: () => W(360, h(List, null,
    h(ListItem, { onClick: () => {} }, 'Enabled'), h(ListItem, { active: true, onClick: () => {} }, 'Active'),
    h(ListItem, { disabled: true, onClick: () => {} }, 'Disabled'), h(ListItem, null, 'Presentational: no onClick, no hover'))),
  source: `<ListItem onClick={open}>Enabled</ListItem>\n<ListItem active onClick={open}>Active</ListItem>\n<ListItem disabled onClick={open}>Disabled</ListItem>`,
});
export const Leading = example({
  name: 'Leading', render: () => W(360, h(List, null,
    h(ListItem, { onClick: () => {} }, 'No icon'), h(ListItem, { icon: h(Heart, { size: 24 }), onClick: () => {} }, 'Icon'),
    h(ListItem, { ...rowProps({ ...ROW_ARGS, leading: 'avatar' }, 'md'), onClick: () => {} }, 'Avatar'),
    h(ListItem, { disabled: true, ...rowProps({ ...ROW_ARGS, leading: 'icon' }, 'md'), onClick: () => {} }, 'The icon dims with the row'))),
  source: `<ListItem icon={<HeartIcon />}>Icon</ListItem>\n<ListItem avatar={<Avatar name="Anna Petrova" size="md" />}>Avatar</ListItem>`,
});
export const Trailing = example({
  name: 'Trailing', render: () => W(360, h(List, null,
    h(ListItem, { details: '12 min', onClick: () => {} }, 'Details'),
    h(ListItem, { ...rowProps({ ...ROW_ARGS, details: 'badge' }, 'md'), onClick: () => {} }, 'Badge'),
    h(ListItem, rowProps({ ...ROW_ARGS, control: 'switch' }, 'md'), 'Switch'),
    h(ListItem, rowProps({ ...ROW_ARGS, control: 'checkbox' }, 'md'), 'Checkbox'),
    h(ListItem, { disabled: true, ...rowProps({ ...ROW_ARGS, control: 'switch' }, 'md') }, 'Disabled: the control is inert'))),
  source: `<ListItem details={<Badge type="counter" variant="red" label={3} />}>Badge</ListItem>\n<ListItem control={<Switch size="md" aria-label="Notifications" />}>Switch</ListItem>`,
});
function Folders() {
  const [open, setOpen] = useState(true);
  return W(360, h(List, { size: 'md' }, h(ListItem, { expanded: open, onExpandedChange: setOpen, onClick: () => {}, items: sub('md') }, 'Mailbox'), h(ListItem, { onClick: () => {} }, 'Settings')));
}
export const Expandable = example({ name: 'Expandable', render: () => h(Folders), source: `<ListItem expanded={open} onExpandedChange={setOpen} items={[<ListItem subitem>Starred</ListItem>]}>Mailbox</ListItem>` });
export const __namedExportsOrder = ['Playground', 'States', 'Leading', 'Trailing', 'Expandable'];
