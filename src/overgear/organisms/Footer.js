import { h, cx } from '../../react.js';
import { describe } from '../../doc.js';
import { FooterMenuList } from '../molecules/FooterMenuList.js';
import { SocialButton } from '../molecules/SocialButton.js';
import { PaymentMethods } from '../molecules/PaymentMethods.js';
import { HeaderLogo } from './Header.js';

/** The footer logo with the social buttons next to it. */
export function FooterLogo({ logo, socials = [], className, ...rest }) {
  return h('div', { 'data-slot': 'footer-logo', className: cx('og-footer__brand', className), ...rest },
    logo ?? h(HeaderLogo, null),
    h('div', { className: 'og-footer__socials' }, socials.map((s) => h(SocialButton, { key: s.platform, platform: s.platform, href: s.href }))));
}
describe(FooterLogo, 'The footer brand row: the logo and a row of social buttons.', {
  logo: ['ReactNode', 'a wordmark', 'Logo element'],
  socials: ["Array<{ platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'x'; href: string }>", '[]', 'Social profiles'],
});

const item = (i) => ('buttonClassName' in i || i.button
  ? h(FooterMenuList.Button, { key: i.label }, i.label)
  : h(FooterMenuList.Element, { key: i.label, link: i.href, isExternal: i.isExternal }, i.label));

/** Link columns of the footer. */
export function FooterMenuSection({ columns = [], className, ...rest }) {
  return h('div', { 'data-slot': 'footer-menu-section', className: cx('og-footer__columns', className), ...rest },
    columns.map((c) => h(FooterMenuList.List, { key: c.title, title: h(FooterMenuList.Title, null, c.title) }, c.items.map(item))));
}
describe(FooterMenuSection, 'A responsive grid of footer link columns: one column in a narrow container, two in a medium one, four in a wide one.', {
  columns: ['Array<{ title: string; items: Array<{ label: string; href?: string; isExternal?: boolean; button?: boolean }> }>', '[]', 'Columns; an item with `button` is a dialog button instead of a link'],
});

/** A titled grid of extra links (for example other games). */
export function FooterGamesGrid({ games = [], title, className, ...rest }) {
  if (!games.length || !title) return null;
  return h('div', { 'data-slot': 'footer-games', className: cx('og-footer__games', className), ...rest },
    h(FooterMenuList.Title, null, title),
    h('ul', { className: 'og-footer__games-grid' }, games.map((g) => h(FooterMenuList.Element, { key: g.label, link: g.href, isExternal: g.isExternal }, g.label))));
}
describe(FooterGamesGrid, 'A titled grid of extra links, such as other games. Renders nothing without links or a title.', {
  games: ['Array<{ label: string; href: string; isExternal?: boolean }>', '[]', 'Links'],
  title: ['string', null, 'Section title'],
});

/** Legal text, the address and security badges. */
export function FooterLegal({ disclaimerText, addressText, securityBadges = [], className, ...rest }) {
  return h('div', { 'data-slot': 'footer-legal', className: cx('og-footer__legal', className), ...rest },
    disclaimerText && h('p', { className: 'og-footer__disclaimer' }, disclaimerText),
    h('div', { className: 'og-footer__legal-row' },
      addressText && h('p', { className: 'og-footer__address' }, addressText),
      h('ul', { className: 'og-footer__badges', 'aria-label': 'Security' }, securityBadges.map((b) => h('li', { key: b.label, className: 'og-footer__badge' }, b.label)))));
}
describe(FooterLegal, 'The legal block: a disclaimer, an address and text badges for security certificates.', {
  disclaimerText: ['string', null, 'Disclaimer paragraph'],
  addressText: ['string', null, 'Company address, muted'],
  securityBadges: ['Array<{ label: string }>', '[]', 'Security badges (text placeholders)'],
});

/** The site footer: payment methods, brand and socials, link columns, extra links and the legal block. */
export function Footer({ logo, socials = [], menuColumns = [], otherGames = [], otherGamesTitle, disclaimerText, addressText, securityBadges = [], showPaymentMethods = true, className, ...rest }) {
  return h('footer', { 'data-slot': 'footer', className: cx('og-footer', className), ...rest },
    showPaymentMethods && h('div', { className: 'og-footer__payments' }, h(PaymentMethods)),
    h('div', { className: 'og-footer__section' }, h(FooterLogo, { logo, socials })),
    h('div', { className: 'og-footer__section' }, h(FooterMenuSection, { columns: menuColumns }), h(FooterGamesGrid, { games: otherGames, title: otherGamesTitle })),
    h('div', { className: 'og-footer__section' }, h(FooterLegal, { disclaimerText, addressText, securityBadges })));
}
describe(Footer, 'The site footer. Its columns follow the width of the footer itself (a container query), not the window.', {
  logo: ['ReactNode', 'a wordmark', 'Logo element'],
  socials: ["Array<{ platform: string; href: string }>", '[]', 'Social profiles'],
  menuColumns: ['Array<{ title: string; items: Array<{ label: string; href?: string; isExternal?: boolean; button?: boolean }> }>', '[]', 'Link columns'],
  otherGames: ['Array<{ label: string; href: string; isExternal?: boolean }>', '[]', 'Extra links grid'],
  otherGamesTitle: ['string', null, 'Title of the extra links grid'],
  disclaimerText: ['string', null, 'Legal disclaimer'],
  addressText: ['string', null, 'Company address'],
  securityBadges: ['Array<{ label: string }>', '[]', 'Security badges'],
  showPaymentMethods: ['boolean', 'true', 'Show the payment methods strip on top'],
});
