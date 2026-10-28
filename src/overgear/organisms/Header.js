import { h, cx } from '../../react.js';
import { describe } from '../../doc.js';
import { Button, IconButton } from '../../components/Button.js';
import { Badge } from '../../components/Badge.js';
import { Avatar } from '../../components/Avatar.js';
import { TextField } from '../../components/TextField.js';

const svg = (...c) => h('svg', { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', focusable: 'false' }, ...c);
export const HEADER_ICONS = {
  menu: () => svg(h('path', { d: 'M4 6h16M4 12h16M4 18h16' })),
  search: () => svg(h('circle', { cx: 11, cy: 11, r: 7 }), h('path', { d: 'm20 20-3.5-3.5' })),
  cart: () => svg(h('path', { d: 'M3 4h2.5l2 11h10l2-8H7' }), h('circle', { cx: 9, cy: 20, r: 1 }), h('circle', { cx: 17, cy: 20, r: 1 })),
  bell: () => svg(h('path', { d: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0' })),
  user: () => svg(h('circle', { cx: 12, cy: 8, r: 4 }), h('path', { d: 'M4 21c0-4 3.6-6 8-6s8 2 8 6' })),
  globe: () => svg(h('circle', { cx: 12, cy: 12, r: 9 }), h('path', { d: 'M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z' })),
  chevron: () => svg(h('path', { d: 'm6 9 6 6 6-6' })),
};
const Ico = ({ name }) => HEADER_ICONS[name]();

/** A simple wordmark: a rounded square with a letter, plus the name (or only the square). */
export function HeaderLogo({ href = '#', label = 'Overgear', variant = 'full', onClick, className, ...rest }) {
  return h('a', { href, onClick, 'aria-label': label, 'data-slot': 'header-logo', 'data-variant': variant, className: cx('og-header-logo', className), ...rest },
    h('svg', { viewBox: '0 0 32 32', width: 32, height: 32, 'aria-hidden': 'true', focusable: 'false', className: 'og-header-logo__mark' },
      h('rect', { width: 32, height: 32, rx: 9, fill: 'currentColor' }), h('path', { d: 'M16 8a8 8 0 1 0 8 8h-8Z', className: 'og-header-logo__glyph' })),
    variant === 'full' && h('span', { className: 'og-header-logo__name' }, label));
}
describe(HeaderLogo, 'The header wordmark: a simple placeholder mark and the product name.', {
  href: ['string', "'#'", 'Where the logo links'],
  label: ['string', "'Overgear'", 'Name; also the accessible name'],
  variant: ["'full' | 'icon'", "'full'", 'full shows the name, icon only the mark'],
});

/** A ghost icon button with an optional counter badge at its corner. */
export function HeaderIconButton({ icon, label, badge, onClick, className, ...rest }) {
  return h('span', { 'data-slot': 'header-icon-button', className: cx('og-header-icon', className) },
    h(IconButton, { variant: 'ghost', size: 'md', label, icon, onClick, tooltip: false, ...rest }),
    badge != null && badge > 0 && h(Badge, { type: 'counter', variant: 'red', size: 'sm', label: badge, max: 99, className: 'og-header-icon__badge', 'aria-hidden': 'true' }));
}
describe(HeaderIconButton, 'An icon button for the header (cart, notifications, menu) with a counter badge that appears when `badge` is above 0.', {
  icon: ['ReactNode', null, 'Icon element'],
  label: ['string', null, 'Accessible name'],
  badge: ['number', null, 'Counter; shown when above 0, `99+` past 99'],
  onClick: ['() => void', null, 'Click handler'],
});

/** Desktop header shell: left, center and right slots. */
export function Header({ leftSlot, centerSlot, rightSlot, sticky = false, className, ...rest }) {
  return h('header', { 'data-slot': 'header', className: cx('og-header', sticky && 'og-header--sticky', className), ...rest },
    h('div', { className: 'og-header__left' }, leftSlot),
    centerSlot && h('div', { className: 'og-header__center' }, centerSlot),
    h('div', { className: 'og-header__right' }, rightSlot));
}
describe(Header, 'The desktop header layout: a left slot (logo, menu), a flexible center slot (search) and a right slot (user actions). It knows nothing about auth or routing.', {
  leftSlot: ['ReactNode', null, 'Logo and menu trigger'],
  centerSlot: ['ReactNode', null, 'Search field; takes the free space'],
  rightSlot: ['ReactNode', null, 'User actions'],
  sticky: ['boolean', 'false', 'Stick to the top while scrolling'],
});

/** Mobile header shell: a lower bar with tighter gaps. */
export function HeaderMobile({ leftSlot, centerSlot, rightSlot, sticky = false, className, ...rest }) {
  return h('header', { 'data-slot': 'header-mobile', className: cx('og-header', 'og-header--mobile', sticky && 'og-header--sticky', className), ...rest },
    h('div', { className: 'og-header__left' }, leftSlot),
    centerSlot && h('div', { className: 'og-header__center' }, centerSlot),
    h('div', { className: 'og-header__right' }, rightSlot));
}
describe(HeaderMobile, 'The mobile header layout (64px): logo and menu on the left, search in the middle, cart and profile on the right.', {
  leftSlot: ['ReactNode', null, 'Logo and menu trigger'],
  centerSlot: ['ReactNode', null, 'Search field'],
  rightSlot: ['ReactNode', null, 'Cart and profile'],
  sticky: ['boolean', 'false', 'Stick to the top while scrolling'],
});

const NAV = ['Games', 'Gift cards', 'Top-up', 'Deals'];

/**
 * A ready header with static content. It renders the desktop and the mobile bar and shows one of them
 * by the width of its container (a container query), so it also adapts inside a narrow preview frame.
 */
export function ResponsiveHeader({ user = null, cartCount = 0, notificationCount = 0, language = 'EN / USD', searchPlaceholder = 'Search products', links = NAV, sticky = false, className, ...rest }) {
  const avatar = user && h(Avatar, { name: user.name, src: user.avatarSrc, size: 'md', href: '#profile' });
  const search = (size) => h(TextField, { size, label: searchPlaceholder, startIcon: h(Ico, { name: 'search' }), 'aria-label': searchPlaceholder });
  return h('div', { 'data-slot': 'responsive-header', className: cx('og-header-root', className), ...rest },
    h(Header, {
      sticky,
      leftSlot: [h(HeaderLogo, { key: 'logo' }), h('nav', { key: 'nav', 'aria-label': 'Main', className: 'og-header__nav' }, links.map((l) => h('a', { key: l, href: '#' + l.toLowerCase(), className: 'og-header__link' }, l)))],
      centerSlot: search('sm'),
      rightSlot: [
        h(Button, { key: 'lang', variant: 'ghost', size: 'md', icon: h(Ico, { name: 'globe' }), endContent: h(Ico, { name: 'chevron' }), className: 'og-header__lang', 'aria-label': 'Language and currency' }, language),
        user && h(HeaderIconButton, { key: 'bell', icon: h(Ico, { name: 'bell' }), label: 'Notifications', badge: notificationCount }),
        h(HeaderIconButton, { key: 'cart', icon: h(Ico, { name: 'cart' }), label: 'Cart', badge: cartCount }),
        user ? avatar : h(Button, { key: 'login', variant: 'primary', size: 'md' }, 'Log in'),
      ],
      className: 'og-header-root__desktop',
    }),
    h(HeaderMobile, {
      sticky,
      leftSlot: [h(HeaderIconButton, { key: 'menu', icon: h(Ico, { name: 'menu' }), label: 'Menu' }), h(HeaderLogo, { key: 'logo', variant: 'icon' })],
      centerSlot: search('sm'),
      rightSlot: [h(HeaderIconButton, { key: 'cart', icon: h(Ico, { name: 'cart' }), label: 'Cart', badge: cartCount }), user ? avatar : h(HeaderIconButton, { key: 'user', icon: h(Ico, { name: 'user' }), label: 'Log in' })],
      className: 'og-header-root__mobile',
    }));
}
describe(ResponsiveHeader, 'A complete header with static sample content: logo, links, search, language, notifications, cart and profile. It shows the desktop bar in a wide container and the mobile bar in a narrow one.', {
  user: ['{ name: string; avatarSrc?: string } | null', 'null', 'The signed-in user; null shows a Log in button'],
  cartCount: ['number', '0', 'Cart counter'],
  notificationCount: ['number', '0', 'Notification counter (signed-in only)'],
  language: ['string', "'EN / USD'", 'Text of the language and currency button'],
  searchPlaceholder: ['string', "'Search products'", 'Search field label'],
  links: ['string[]', '4 sample links', 'Navigation links (wide containers)'],
  sticky: ['boolean', 'false', 'Stick to the top while scrolling'],
});
