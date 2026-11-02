import { useState } from '../react.js';
import { List, ListItem, ROW_ARGS, ROW_ARGTYPES, rowProps, AVATAR_BY_ROW } from './_listkit.jsx';
import { meta, example, W } from './_helpers.jsx';
import { Heart } from './_ui.jsx';

export default meta({
  title: 'Components/List Item',
  component: ListItem,
  args: {
    children: 'Inbox',
    size: 'md',
    ...ROW_ARGS,
    leading: 'icon',
    interactive: true,
    nested: false,
    defaultExpanded: false,
    active: false,
    disabled: false,
    subitem: false,
  },
  argTypes: {
    children: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    ...ROW_ARGTYPES,
    interactive: {
      control: 'boolean',
      docs: false,
      description: 'Gives the row an `onClick`: a button with hover; without it the row is only text (a story setting)',
    },
    nested: { control: 'boolean', docs: false, description: 'Gives the row `items`, so it expands (a story setting)', if: { arg: 'subitem', eq: false } },
    defaultExpanded: { control: 'boolean', if: { arg: 'nested', eq: true } },
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
    subitem: { control: 'boolean' },
  },
});
const sub = (size) => [
  <ListItem key={1} subitem size={size} onClick={() => {}}>
    Starred
  </ListItem>,
  <ListItem key={2} subitem size={size} onClick={() => {}}>
    Important
  </ListItem>,
];
export const Playground = {
  parameters: {
    docs: {
      source: {
        originalSource: `<ListItem
  icon={<HeartIcon />}
  subtitle="Caption"  // or overline="Caption" above the title
  details="12 min"
  control={<Switch size="md" aria-label="Inbox" />}
  onClick={open}
>
  Inbox
</ListItem>`,
      },
    },
  },
  render: ({ interactive, nested, children, defaultExpanded, ...a }) =>
    W(
      360,
      <List size={a.size}>
        <ListItem
          key={`${a.size}${nested}${defaultExpanded}`}
          defaultExpanded={defaultExpanded}
          size={a.size}
          active={a.active}
          disabled={a.disabled}
          subitem={a.subitem}
          {...rowProps(a, a.size)}
          {...(interactive || nested ? { onClick: () => {} } : {})}
          {...(nested && { items: sub(a.size) })}
        >
          {children}
        </ListItem>
      </List>,
    ),
};
export const States = example({
  name: 'States',
  render: () =>
    W(
      360,
      <List>
        <ListItem onClick={() => {}}>Enabled</ListItem>
        <ListItem active onClick={() => {}}>
          Active
        </ListItem>
        <ListItem disabled onClick={() => {}}>
          Disabled
        </ListItem>
        <ListItem>Presentational: no onClick, no hover</ListItem>
      </List>,
    ),
  source: `<ListItem onClick={open}>Enabled</ListItem>\n<ListItem active onClick={open}>Active</ListItem>\n<ListItem disabled onClick={open}>Disabled</ListItem>`,
});
export const Leading = example({
  name: 'Leading',
  render: () =>
    W(
      360,
      <List>
        <ListItem onClick={() => {}}>No icon</ListItem>
        <ListItem icon={<Heart size={24} />} onClick={() => {}}>
          Icon
        </ListItem>
        <ListItem {...rowProps({ ...ROW_ARGS, leading: 'avatar' }, 'md')} onClick={() => {}}>
          Avatar
        </ListItem>
        <ListItem disabled {...rowProps({ ...ROW_ARGS, leading: 'icon' }, 'md')} onClick={() => {}}>
          The icon dims with the row
        </ListItem>
      </List>,
    ),
  source: `<ListItem icon={<HeartIcon />}>Icon</ListItem>\n<ListItem avatar={<Avatar name="Anna Petrova" size="md" />}>Avatar</ListItem>`,
});
export const Captions = example({
  name: 'Captions',
  render: () =>
    W(
      360,
      <List>
        <ListItem {...rowProps({ ...ROW_ARGS, leading: 'icon', caption: 'below' }, 'md')} onClick={() => {}}>
          Subtitle below the title
        </ListItem>
        <ListItem {...rowProps({ ...ROW_ARGS, leading: 'icon', caption: 'above' }, 'md', 1)} onClick={() => {}}>
          Overline above the title
        </ListItem>
      </List>,
    ),
  source: `<ListItem subtitle="Caption">Subtitle</ListItem>\n<ListItem overline="Caption">Overline</ListItem>  // use one of the two`,
});
export const Trailing = example({
  name: 'Trailing',
  render: () =>
    W(
      360,
      <List>
        <ListItem details="12 min" onClick={() => {}}>
          Details
        </ListItem>
        <ListItem {...rowProps({ ...ROW_ARGS, details: 'badge' }, 'md')} onClick={() => {}}>
          Badge
        </ListItem>
        <ListItem {...rowProps({ ...ROW_ARGS, control: 'switch' }, 'md')}>Switch</ListItem>
        <ListItem {...rowProps({ ...ROW_ARGS, control: 'checkbox' }, 'md')}>Checkbox</ListItem>
        <ListItem disabled {...rowProps({ ...ROW_ARGS, control: 'switch' }, 'md')}>
          Disabled: the control is inert
        </ListItem>
      </List>,
    ),
  source: `<ListItem details={<Badge type="counter" variant="red" label={3} />}>Badge</ListItem>\n<ListItem control={<Switch size="md" aria-label="Notifications" />}>Switch</ListItem>`,
});
function Folders() {
  const [open, setOpen] = useState(true);
  return W(
    360,
    <List size="md">
      <ListItem expanded={open} onExpandedChange={setOpen} onClick={() => {}} items={sub('md')}>
        Mailbox
      </ListItem>
      <ListItem onClick={() => {}}>Settings</ListItem>
    </List>,
  );
}
export const Expandable = example({
  name: 'Expandable',
  render: () => <Folders />,
  source: `<ListItem expanded={open} onExpandedChange={setOpen} items={[<ListItem subitem>Starred</ListItem>]}>Mailbox</ListItem>`,
});
export const __namedExportsOrder = ['Playground', 'States', 'Leading', 'Captions', 'Trailing', 'Expandable'];
