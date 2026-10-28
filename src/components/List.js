import { h, cx, Fragment, createContext, useContext, useState, useId, Children } from '../react.js';
import { Button } from '@base-ui/react/button';
import { Icon } from '../icons.js';
import { describe } from '../doc.js';

const SizeContext = createContext('md');
const hasContent = (node) => Children.toArray(node).length > 0;

/** A list: a container for ListItem rows with a group title and a divider below it. The title sits outside the `<ul>` and names it. */
export function List({ size = 'md', spacing = 'sm', title, divider = false, children, className, ref, ...rest }) {
  const titleId = useId();
  const titled = title != null;
  return h('div', { 'data-slot': 'list-group', className: cx('bui-list-group__group', `bui-list--spacing-${spacing}`, className) },
    titled && h('div', { id: titleId, className: 'bui-list-group__title' }, title),
    h(SizeContext.Provider, { value: size },
      h('ul', { ref, 'data-slot': 'list', className: 'bui-list-group__list', 'aria-labelledby': titled ? titleId : undefined, ...rest }, children)),
    divider && h('div', { className: 'bui-list-group__divider', 'aria-hidden': 'true' }));
}
describe(List, 'A vertical list of rows with an optional title and divider.', {
  size: ["'sm' | 'md'", "'md'", 'Row height of every `ListItem` inside: `sm` (40px, 14px text) or `md` (48px); a row can set its own'],
  spacing: ["'sm' | 'md' | 'lg'", "'sm'", 'The space between the rows: sm is compact, md adds 4px to each row, lg adds 8px'],
  title: ['ReactNode', null, 'Group title above the list, aligned with the text of the rows; it gives the list its accessible name'],
  divider: ['boolean', 'false', 'A divider below the group, as wide as the text of the rows: it separates the group from the next one'],
  children: ['ReactNode', null, '`ListItem` rows'],
  className: ['string', null, 'Extra class on the group wrapper (merged)'],
  ref: ['Ref<HTMLUListElement>', null, 'Ref to the `<ul>`'],
});

/**
 * A list row: an icon or an avatar, a title with a caption, details and a control. The control sits outside the row button, so interactive content is
 * never nested in interactive content. Without `onClick` and without `items` the row is plain text; otherwise it is a button.
 */
export function ListItem({
  size, overline, subtitle, details, icon, avatar, control, items, expanded, defaultExpanded = false, onExpandedChange, subitem = false, active = false, disabled = false, onClick, children, className, ref, ...rest
}) {
  const sz = size ?? useContext(SizeContext);
  const [innerExpanded, setInnerExpanded] = useState(defaultExpanded);
  const nestedId = useId();
  const expandable = hasContent(items);
  const hasControl = hasContent(control);
  const controlled = expanded !== undefined;
  const open = controlled ? expanded : innerExpanded;
  const interactive = !!onClick || expandable;
  const press = (e) => { onClick?.(e); if (expandable) { if (!controlled) setInnerExpanded(!open); onExpandedChange?.(!open); } };
  const rowClass = cx('bui-list__row', subitem && 'bui-list__subitem', hasControl && 'bui-list__with-control');
  const content = h(Fragment, null,
    avatar != null && h('span', { className: 'bui-list__avatar' }, avatar),
    icon != null && h('span', { className: 'bui-list__icon' }, icon),
    h('span', { className: 'bui-list__text' },
      // the small text above the title lives in the title block, so it moves and wraps with it
      h('span', { 'data-slot': 'list-item-title', className: 'bui-list__title' }, overline ? h(Fragment, null, h('span', { 'data-slot': 'list-overline', className: 'bui-list__overline' }, overline), children) : children),
      subtitle != null && h('span', { 'data-slot': 'list-item-subtitle', className: 'bui-list__subtitle' }, subtitle)),
    details != null && h('span', { className: 'bui-list__details' }, details),
    expandable && h('span', { className: 'bui-list__chevron', 'aria-hidden': 'true' }, h(Icon, { name: 'chevronDown', size: 24 })));
  return h('li', { ref, 'data-slot': 'list-item', className: cx('bui-list__item', open && 'bui-list__expanded', className), ...rest },
    h('div', { 'data-slot': 'list-item-header', 'data-size': sz, 'data-state': disabled ? 'disabled' : undefined, className: cx('bui-list__header', `bui-list__${sz}`, interactive && 'bui-list__interactive', active && 'bui-list__active', disabled && 'bui-list__disabled', hasControl && 'bui-list__has-control') },
      interactive
        ? h(Button, { className: rowClass, disabled, 'aria-current': active || undefined, 'aria-expanded': expandable ? open : undefined, 'aria-controls': expandable ? nestedId : undefined, onClick: press }, content)
        : h('div', { className: rowClass }, content),
      hasControl && h('span', { className: 'bui-list__control', inert: disabled }, control)),
    expandable && h('div', { className: 'bui-list__nested-wrap' }, h('ul', { id: nestedId, className: 'bui-list__nested', inert: !open }, items)));
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
  className: ['string', null, 'Extra class on the root `<li>` (merged)'],
  ref: ['Ref<HTMLLIElement>', null, 'Ref to the root `<li>`'],
});
