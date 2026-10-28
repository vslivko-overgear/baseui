import { h, cx } from '../../react.js';
import { describe } from '../../doc.js';

function FooterMenuListRoot({ title, children, className, ...rest }) {
  return h('div', { 'data-slot': 'footer-menu', className: cx('og-footer-menu', className), ...rest }, title, h('ul', { className: 'og-footer-menu__list' }, children));
}
describe(FooterMenuListRoot, 'A footer column: a title above a list of links and buttons. Compose it with `FooterMenuList.Title`, `.Element` and `.Button`.', {
  title: ['ReactNode', null, 'Usually a `FooterMenuList.Title`'],
  children: ['ReactNode', null, '`FooterMenuList.Element` / `FooterMenuList.Button` items'],
});

function FooterMenuTitle({ children, className, ...rest }) {
  return h('div', { 'data-slot': 'footer-menu-title', className: cx('og-footer-menu__title', className), ...rest }, children);
}
describe(FooterMenuTitle, 'The small uppercase heading of a footer column.', { children: ['ReactNode', null, 'Title text'] });

function FooterMenuElement({ link, children, isExternal = false, className, ...rest }) {
  return h('li', { className: 'og-footer-menu__item' },
    h('a', { 'data-slot': 'footer-menu-link', href: link, className: cx('og-footer-menu__link', className), ...(isExternal && { target: '_blank', rel: 'noopener noreferrer' }), ...rest }, children));
}
describe(FooterMenuElement, 'A link in a footer column.', {
  link: ['string', null, 'Destination URL'],
  children: ['ReactNode', null, 'Link text'],
  isExternal: ['boolean', 'false', 'Open in a new tab'],
});

function FooterMenuButton({ children, className, ...rest }) {
  return h('li', { className: 'og-footer-menu__item' },
    h('button', { type: 'button', 'data-slot': 'footer-menu-button', 'aria-haspopup': 'dialog', className: cx('og-footer-menu__link', className), ...rest }, children));
}
describe(FooterMenuButton, 'An item that looks like a footer link but opens a dialog (for example cookie settings).', {
  children: ['ReactNode', null, 'Button text'],
  onClick: ['(event) => void', null, 'Called on click'],
});

export const FooterMenuList = { List: FooterMenuListRoot, Title: FooterMenuTitle, Element: FooterMenuElement, Button: FooterMenuButton };
export { FooterMenuListRoot, FooterMenuTitle, FooterMenuElement, FooterMenuButton };
