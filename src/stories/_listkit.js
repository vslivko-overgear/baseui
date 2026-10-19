// Shared by the List and List Item pages: the same row content settings, built from the design system itself
// (Avatar, Switch, Checkbox, Badge and the icons), so the lists are shown the way they are used.
import { h } from '../react.js';
import { Switch, Checkbox } from '../base.js';
import { List, ListItem } from '../components/List.js';
import { Avatar } from '../components/Avatar.js';
import { Badge } from '../components/Badge.js';
import { Heart, Bell01, Settings02, User01, Home01 } from './_ui.js';

export { List, ListItem };
export const AVATAR_BY_ROW = { sm: 'sm', md: 'md' };
const NAMES = ['Anna Petrova', 'Mark Lee', 'Sofia Rossi', 'John Smith', 'Eva Novak', 'Li Wei'];
const ICONS = [Home01, Bell01, Heart, User01, Settings02, Home01];

/** The settings of a row that are story settings: they fill the icon, avatar, subtitle or overline, details and control props. */
export const ROW_ARGS = { leading: 'none', caption: 'none', details: 'none', control: 'none' };
export const ROW_ARGTYPES = {
  leading: { control: 'inline-radio', options: ['none', 'icon', 'avatar'], docs: false, description: 'Fills the `icon` or the `avatar` prop (a story setting)' },
  caption: { control: 'inline-radio', options: ['none', 'below', 'above'], docs: false, description: 'Small text below the title (`subtitle`) or above it (`overline`); one of the two (a story setting)' },
  details: { control: 'inline-radio', options: ['none', 'text', 'badge'], docs: false, description: 'Fills the `details` prop with text or a Badge (a story setting)' },
  control: { control: 'inline-radio', options: ['none', 'switch', 'checkbox'], docs: false, description: 'Fills the `control` prop with a Switch or a Checkbox (a story setting)' },
};

/** The props of row number `i` for the given row settings and row size. */
export function rowProps({ leading, caption, details, control }, size = 'md', i = 0) {
  const Icon = ICONS[i % ICONS.length];
  return {
    ...(leading === 'icon' && { icon: h(Icon, { size: size === 'sm' ? 20 : 24 }) }),
    ...(leading === 'avatar' && { avatar: h(Avatar, { name: NAMES[i % NAMES.length], size: AVATAR_BY_ROW[size] || 'md', tooltip: false }) }),
    ...(caption === 'below' && { subtitle: 'Caption' }),
    ...(caption === 'above' && { overline: 'Caption' }),
    ...(details === 'text' && { details: '12 min' }),
    ...(details === 'badge' && { details: h(Badge, { variant: 'red', type: 'counter', size: 'sm', label: i + 2 }) }),
    ...(control === 'switch' && { control: h(Switch, { size: 'md', 'aria-label': `Row ${i + 1}` }) }),
    ...(control === 'checkbox' && { control: h(Checkbox, { 'aria-label': `Row ${i + 1}` }) }),
  };
}
export const TITLES = ['Inbox', 'Drafts', 'Sent', 'Archive', 'Spam', 'Trash'];
