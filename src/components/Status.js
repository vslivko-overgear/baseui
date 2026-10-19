import { h, cx } from '../react.js';
import { Icon } from '../icons.js';
import { Button } from './Button.js';
import { describe } from '../doc.js';

const PRESETS = {
  neutral: { icon: 'inbox', title: 'Nothing here yet', description: 'When something is added, it will show up here.' },
  accent: { icon: 'info', title: 'Good to know', description: 'Some information about this view.' },
  success: { icon: 'success', title: 'All done', description: 'Everything went through.' },
  warning: { icon: 'warning', title: 'Heads up', description: 'Check this before you continue.' },
  error: { icon: 'error', title: 'Something went wrong', description: 'Try again in a moment.' },
};

export function Status({ status = 'neutral', icon, title, description, action, actionLabel, actionVariant = 'primary', onAction, className, ...rest }) {
  const p = PRESETS[status];
  const act = action || (actionLabel && h(Button, { label: actionLabel, variant: actionVariant, onClick: onAction }));
  return h('div', { className: cx('bui-status', className), ...rest },
    h('div', { className: cx('bui-status__icon', `bui-status__icon--${status}`), 'aria-hidden': 'true' }, icon || h(Icon, { name: p.icon, size: 28 })),
    h('div', { className: 'bui-status__title' }, title || p.title),
    h('p', { className: 'bui-status__text' }, description || p.description),
    act && h('div', { className: 'bui-status__action' }, act));
}

describe(Status, 'Tells the user the state of a view: nothing to show, information, success, a warning or an error.', {
  status: ["'neutral' | 'accent' | 'success' | 'warning' | 'error'", "'neutral'", 'The state; it sets the color of the circle, the icon, the title and the description'],
  icon: ['ReactNode', null, 'Replaces the icon (the circle keeps the color of the status)'],
  title: ['ReactNode', null, 'Replaces the title of the status'],
  description: ['ReactNode', null, 'Replaces the text under the title'],
  action: ['ReactNode', null, 'A custom action in place of the button below'],
  actionLabel: ['string', null, 'Label of the action button; without it there is no button'],
  actionVariant: ["'primary' | 'secondary'", "'primary'", 'Button style'],
  onAction: ['() => void', null, 'Called when the button is pressed'],
});
