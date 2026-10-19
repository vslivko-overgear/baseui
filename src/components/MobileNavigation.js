import { h, cx, useControllable } from '../react.js';
import { Icon } from '../icons.js';
import { IconButton } from './Button.js';
import { Badge } from './Badge.js';
import { describe } from '../doc.js';

/** The bar at the top of a mobile screen: back, title, up to two actions. */
export function Navbar({ title, subtitle, showBack = true, onBack, backLabel = 'Back', actions = [], className, ...rest }) {
  return h('header', { className: cx('bui-navbar', className), ...rest },
    h('div', { className: 'bui-navbar__side' }, showBack && h(IconButton, { variant: 'ghost', size: 'md', label: backLabel, tooltip: false, icon: h(Icon, { name: 'chevronLeft', size: 24 }), onClick: onBack })),
    h('div', { className: 'bui-navbar__heading' },
      h('h1', { className: 'bui-navbar__title' }, title),
      subtitle && h('div', { className: 'bui-navbar__subtitle' }, subtitle)),
    h('div', { className: cx('bui-navbar__side', 'bui-navbar__side--end') },
      actions.slice(0, 2).map((a) => h(IconButton, { key: a.label, variant: 'ghost', size: 'md', label: a.label, tooltip: false, icon: a.icon, onClick: a.onClick, isDisabled: a.disabled }))));
}
describe(Navbar, 'The bar at the top of a mobile screen: a back button on the left, the title in the middle and up to two icon actions on the right.', {
  title: ['string', null, 'Screen title, centered; a long one is truncated'],
  subtitle: ['string', null, 'A second line under the title'],
  showBack: ['boolean', 'true', 'Show the back button'],
  onBack: ['() => void', null, 'Called when the back button is pressed'],
  backLabel: ['string', "'Back'", 'Accessible name of the back button'],
  actions: ['Array<{ icon: ReactNode; label: string; onClick?: () => void; disabled?: boolean }>', '[]', 'Icon buttons on the right; only the first two are shown. `label` is the accessible name'],
});

/** The tab bar at the bottom of a mobile screen: 3 to 5 top-level destinations. */
export function BottomBar({ items = [], value, defaultValue, onValueChange, showLabels = true, label = 'Main navigation', className, ...rest }) {
  const [current, setCurrent] = useControllable(value, defaultValue ?? items[0]?.value, onValueChange);
  return h('nav', { 'aria-label': label, className: cx('bui-bottombar', !showLabels && 'bui-bottombar--compact', className), ...rest },
    items.slice(0, 5).map((it) => {
      const active = it.value === current;
      const badge = it.badge === true ? h('span', { className: 'bui-bottombar__dot' }) : it.badge != null && h(Badge, { variant: 'red', size: 'sm', label: it.badge, className: 'bui-bottombar__badge' });
      return h('button', {
        key: it.value, type: 'button', className: cx('bui-bottombar__item', active && 'bui-bottombar__item--active'), 'aria-current': active ? 'page' : undefined,
        'aria-label': showLabels ? undefined : it.label, disabled: it.disabled, onClick: () => setCurrent(it.value),
      },
      h('span', { className: 'bui-bottombar__icon', 'aria-hidden': 'true' }, active && it.activeIcon ? it.activeIcon : it.icon, badge || null),
      showLabels && h('span', { className: 'bui-bottombar__label' }, it.label));
    }));
}
describe(BottomBar, 'The bar at the bottom of a mobile screen for switching between 3 to 5 top-level sections. The active one is highlighted.', {
  items: ['Array<{ value: string; label: string; icon: ReactNode; activeIcon?: ReactNode; badge?: number | string | true; disabled?: boolean }>', null, 'The destinations; only the first five are shown. `activeIcon` (for example a filled icon) replaces `icon` when selected; `badge: true` shows a dot'],
  value: ['string', null, 'Active destination (controlled)'],
  defaultValue: ['string', null, 'Initially active destination; the first by default'],
  onValueChange: ['(value: string) => void', null, 'Called when a destination is chosen'],
  showLabels: ['boolean', 'true', 'Show the labels under the icons; without them each label stays as the accessible name'],
  label: ['string', "'Main navigation'", 'Accessible name of the navigation'],
});
