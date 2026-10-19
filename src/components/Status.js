import { h, cx } from '../react.js';
import { Icon } from '../icons.js';
import { Button } from './Button.js';
import { describe } from '../doc.js';

const PRESETS = {
  empty: { icon: 'inbox', title: 'Nothing here yet', description: 'When something is added, it will show up here.' },
  'no-results': { icon: 'search', title: 'Nothing found', description: 'Try changing the query or resetting the filters.' },
  error: { icon: 'error', title: 'Something went wrong', description: 'Try again in a moment.' },
  success: { icon: 'success', title: 'All done', description: 'Everything went through.' },
  offline: { icon: 'offline', title: 'You are offline', description: 'Check the connection and try again.' },
  'no-access': { icon: 'lock', title: 'No access', description: 'Ask the owner to give you access.' },
};

export function Status({ status = 'empty', icon, title, description, action, actionLabel, actionVariant = 'primary', onAction, className, ...rest }) {
  const p = PRESETS[status];
  const act = action || (actionLabel && h(Button, { label: actionLabel, variant: actionVariant, onClick: onAction }));
  return h('div', { className: cx('bui-status', className), ...rest },
    h('div', { className: 'bui-status__icon', 'aria-hidden': 'true' }, icon || h(Icon, { name: p.icon, size: 28 })),
    h('div', { className: 'bui-status__title' }, title || p.title),
    h('p', { className: 'bui-status__text' }, description || p.description),
    act && h('div', { className: 'bui-status__action' }, act));
}

describe(Status, 'Tells the user the state of a view: nothing to show, no results, an error, success, no connection or no access.', {
  status: ["'empty' | 'no-results' | 'error' | 'success' | 'offline' | 'no-access'", "'empty'", 'Which state to show; it sets the icon, title and description'],
  icon: ['ReactNode', null, 'Replaces the icon of the status'],
  title: ['ReactNode', null, 'Replaces the title of the status'],
  description: ['ReactNode', null, 'Replaces the text under the title'],
  action: ['ReactNode', null, 'A custom action in place of the button below'],
  actionLabel: ['string', null, 'Label of the action button; without it there is no button'],
  actionVariant: ["'primary' | 'secondary'", "'primary'", 'Button style'],
  onAction: ['() => void', null, 'Called when the button is pressed'],
});
