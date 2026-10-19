import { h, cx, Fragment } from '../react.js';
import { BaseList, BaseListItem } from '../base.js';
import { describe } from '../doc.js';

// The sizes of the design system: sm is 40px, md is 48px (the compiled list calls them xsm and sm).
const SIZE = { sm: 'xsm', md: 'sm' };

export function List({ size = 'md', spacing = 'sm', className, ...rest }) {
  return h(BaseList, { size: SIZE[size], className: cx(`bui-list--spacing-${spacing}`, className), ...rest });
}
describe(List, 'A vertical list of rows with an optional title and divider.', {
  size: ["'sm' | 'md'", "'md'", 'Row height of every `ListItem` inside: `sm` (40px, 14px text) or `md` (48px); a row can set its own'],
  spacing: ["'sm' | 'md' | 'lg'", "'sm'", 'The space between the rows: sm is compact, md adds 4px to each row, lg adds 8px'],
  title: ['ReactNode', null, 'Group title above the list, aligned with the text of the rows; it gives the list its accessible name'],
  divider: ['boolean', 'false', 'A divider below the group, as wide as the text of the rows: it separates the group from the next one'],
  children: ['ReactNode', null, '`ListItem` rows'],
});

export function ListItem({ size, overline, children, ...rest }) {
  // The small text above the title lives in the title block, so it moves and wraps with it.
  const title = overline ? h(Fragment, null, h('span', { className: 'bui-list__overline' }, overline), children) : children;
  return h(BaseListItem, { size: size && SIZE[size], ...rest }, title);
}
describe(ListItem, 'A list row: an icon or an avatar, a title with a caption, details and a control. A row with `onClick` or `items` is a button; otherwise it is plain text.', {
  size: ["'sm' | 'md'", null, 'Row height: `sm` (40px) or `md` (48px); by default the `size` of the `List`'],
  children: ['ReactNode', null, 'Main text of the row'],
  subtitle: ['ReactNode', null, 'Small muted text under the title (one size smaller than the title); use it or `overline`'],
  overline: ['ReactNode', null, 'The same small muted text above the title; use it instead of `subtitle`'],
  details: ['ReactNode', null, 'Text or a `Badge` on the right of the title'],
  icon: ['ReactNode', null, 'Leading icon, 24px (20px in `sm` rows); it follows `currentColor` and dims with the row'],
  avatar: ['ReactNode', null, 'Leading `Avatar`: size `sm` in `sm` rows and `md` in `md` rows; it dims with its own `disabled`'],
  control: ['ReactNode', null, 'Slot on the right: a `Switch` (size md) or a `Checkbox`, or your own control. It sits outside the row button, so it is never a button inside a button'],
  items: ['ReactNode', null, 'Nested `ListItem` rows: they make the row expandable (a button with a chevron)'],
  expanded: ['boolean', null, 'Whether the row is expanded (controlled)'],
  defaultExpanded: ['boolean', 'false', 'Whether the row is initially expanded'],
  onExpandedChange: ['(expanded: boolean) => void', null, 'Called with the new expansion state'],
  subitem: ['boolean', 'false', 'A second-level row: shifted to the right by the indent width'],
  active: ['boolean', 'false', 'The current item: a filled background and `aria-current` on an interactive row'],
  disabled: ['boolean', 'false', 'An inactive row: muted texts, no clicks, the control is inert'],
  onClick: ['(event) => void', null, 'Click handler: makes the row a button; with `items` it is called before expanding'],
});
