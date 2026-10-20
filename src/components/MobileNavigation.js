import { h, cx, React, useRef, useState, useEffect, useControllable } from '../react.js';
import { Icon } from '../icons.js';
import { IconButton } from './Button.js';
import { Badge } from './Badge.js';
import { describe } from '../doc.js';
import { useRootAttr, glassClass, useAppear } from '../theme-flags.js';

/** The bar at the top of a mobile screen: back, title, up to two actions. */
export function Navbar({ title, subtitle, showBack = true, onBack, backLabel = 'Back', actions = [], floating, glass, className, ...rest }) {
  const themeFloating = useRootAttr('floating') === 'on';
  return h('header', { className: cx('bui-navbar', (floating ?? themeFloating) && 'bui-navbar--floating', glassClass(glass), className), ...rest },
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
  floating: ['boolean', 'theme', 'A floating bar: separate rounded pieces with a shadow over a gradient that fades the content (blurred when glass is on), inset from the screen edges; by default it follows the Floating setting of the theme'],
  glass: ['boolean', 'theme', 'Translucent, blurred bar; true or false overrides the Glass setting of the theme'],
  actions: ['Array<{ icon: ReactNode; label: string; onClick?: () => void; disabled?: boolean }>', '[]', 'Icon buttons on the right; only the first two are shown. `label` is the accessible name'],
});

/** The tab bar at the bottom of a mobile screen: 2 to 6 top-level destinations. */
export function BottomBar({ items = [], value, defaultValue, onValueChange, showLabels = true, floating, glass, motion, label = 'Main navigation', className, ...rest }) {
  const [current, setCurrent] = useControllable(value, defaultValue ?? items[0]?.value, onValueChange);
  const themeFloating = useRootAttr('floating') === 'on';
  const isFloating = floating ?? themeFloating;
  const ref = useRef(null);
  const [pill, setPill] = useState(null);
  const [ready, setReady] = useState(false);
  const pillRef = useRef(null);
  const barRef = useRef(null);
  // The highlight is one element that slides to the active item; it is measured again when the bar changes size.
  React.useLayoutEffect(() => {
    const nav = ref.current;
    const measure = () => {
      const item = nav.querySelector('[aria-current="page"]');
      if (!item) return setPill(null);
      const box = (isFloating ? item : item.querySelector('.bui-bottombar__icon')).getBoundingClientRect();
      const base = barRef.current.getBoundingClientRect();
      setPill({ x: box.left - base.left, y: box.top - base.top, w: box.width, h: box.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [current, items.length, showLabels, isFloating]);
  useEffect(() => { const id = requestAnimationFrame(() => setReady(true)); return () => cancelAnimationFrame(id); }, []);
  useAppear(pillRef, ref, pill && `${pill.x}/${pill.y}`);
  return h('nav', { ref, 'data-motion': motion, 'aria-label': label, className: cx('bui-bottombar', ready && 'bui-bottombar--ready', !showLabels && 'bui-bottombar--compact', isFloating && 'bui-bottombar--floating', glassClass(glass), className), ...rest },
    h('div', { ref: barRef, className: 'bui-bottombar__bar' },
    pill && h('span', { ref: pillRef, className: 'bui-bottombar__pill', 'aria-hidden': 'true', style: { width: pill.w, height: pill.h, transform: `translate(${pill.x}px, ${pill.y}px)` } }),
    items.slice(0, 6).map((it) => {
      const active = it.value === current;
      const badge = it.badge === true ? h(Badge, { type: 'dot', variant: 'red', size: 'lg', label: 'New', className: 'bui-bottombar__badge' }) : it.badge != null && h(Badge, { type: 'counter', variant: 'red', size: 'sm', label: it.badge, className: 'bui-bottombar__badge' });
      return h('button', {
        key: it.value, type: 'button', className: cx('bui-bottombar__item', active && 'bui-bottombar__item--active'), 'aria-current': active ? 'page' : undefined,
        'aria-label': showLabels ? undefined : it.label, disabled: it.disabled, onClick: () => setCurrent(it.value),
      },
      h('span', { className: 'bui-bottombar__icon', 'aria-hidden': 'true' }, active && it.activeIcon ? it.activeIcon : it.icon, badge || null),
      showLabels && h('span', { className: 'bui-bottombar__label' }, it.label));
    })));
}
describe(BottomBar, 'The bar at the bottom of a mobile screen for switching between 2 to 6 top-level sections. The active one is highlighted; it can also float above the content, like the tab bar in iOS.', {
  items: ['Array<{ value: string; label: string; icon: ReactNode; activeIcon?: ReactNode; badge?: number | string | true; disabled?: boolean }>', null, 'The destinations (2 to 6); only the first six are shown. `activeIcon` (for example a filled icon) replaces `icon` when selected; `badge: true` shows a dot and a number shows a counter'],
  value: ['string', null, 'Active destination (controlled)'],
  defaultValue: ['string', null, 'Initially active destination; the first by default'],
  onValueChange: ['(value: string) => void', null, 'Called when a destination is chosen'],
  showLabels: ['boolean', 'true', 'Show the labels under the icons; without them each label stays as the accessible name'],
  floating: ['boolean', 'theme', 'A floating bar: separate rounded pieces with a shadow over a gradient that fades the content (blurred when glass is on), inset from the screen edges; by default it follows the Floating setting of the theme'],
  glass: ['boolean', 'theme', 'Translucent, blurred bar; true or false overrides the Glass setting of the theme'],
  motion: ["'off' | 'basic' | 'enhanced'", 'theme', 'Animations of this bar: off, basic, or enhanced (the highlight slides); by default the Animations setting of the theme'],
  label: ['string', "'Main navigation'", 'Accessible name of the navigation'],
});
