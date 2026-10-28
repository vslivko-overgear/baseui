import { h, cx } from '../../react.js';
import { describe } from '../../doc.js';
import { Skeleton } from '../../components/Skeleton.js';
import { NextRaidBadge } from '../molecules/NextRaidBadge.js';
import { BadgeWithTimer, ProductBadge } from '../molecules/ProductBadge.js';

// The whole card is a link, so a CMS <a> inside it would be nested interactive content: the parser would close the outer <a>.
// Swap <a ...> / </a> for a styled span that keeps the text and the href. A tag scan, not a sanitizer: CMS HTML is sanitized upstream.
const HREF_ATTR = /[\s/]href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i;
const isAnchorTagAt = (html, at) => (html[at] === 'a' || html[at] === 'A') && /[\s/>]/.test(html[at + 1] ?? '');
function tagEnd(html, from) {
  let quote = null;
  let afterEquals = false;
  for (let i = from; i < html.length; i++) {
    const c = html[i];
    if (quote) { if (c === quote) quote = null; } else if ((c === '"' || c === "'") && afterEquals) quote = c; else if (c === '>') return i;
    if (c === '=') afterEquals = true; else if (!/\s/.test(c)) afterEquals = false;
  }
  return html.length;
}
const cmsLinkOpen = (tag) => {
  const m = HREF_ATTR.exec(tag);
  const href = m ? (m[1] ?? m[2] ?? m[3] ?? '') : '';
  return href ? `<span data-cms-link data-cms-href="${href.replace(/"/g, '&quot;')}">` : '<span data-cms-link>';
};

/** Replaces every anchor of a CMS HTML string with a `<span data-cms-link>`, so the markup can live inside a link. */
export function neutralizeAnchors(html) {
  let out = '';
  let pos = 0;
  for (let lt = html.indexOf('<'); lt !== -1; lt = html.indexOf('<', pos)) {
    const closing = html[lt + 1] === '/';
    const at = lt + (closing ? 2 : 1);
    if (isAnchorTagAt(html, at)) {
      const end = tagEnd(html, at);
      out += html.slice(pos, lt) + (closing ? '</span>' : cmsLinkOpen(html.slice(at + 1, end)));
      pos = end + 1;
    } else {
      out += html.slice(pos, lt + 1);
      pos = lt + 1;
    }
  }
  return out + html.slice(pos);
}

// A plain click navigates the card; a middle or modifier click on a CMS link opens that link in a new tab (http and https only).
const cmsLinkUrl = (href) => {
  try {
    const url = new URL(href, window.location.href);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch { return null; }
};
const openCmsLink = (e) => {
  const href = e.target?.closest?.('[data-cms-href]')?.getAttribute('data-cms-href');
  const url = href ? cmsLinkUrl(href) : null;
  if (!url) return false;
  e.preventDefault();
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
};

export function SaveBadge({ text, size = 'm', className, ...rest }) {
  return h('span', { 'data-slot': 'save-badge', className: cx('og-save-badge', size === 's' && 'og-save-badge--s', className), ...rest }, text);
}
describe(SaveBadge, 'The green discount badge ("Save 20%") above the price of a product card.', {
  text: ['string', null, 'Badge text'],
  size: ["'s' | 'm'", "'m'", 'Size'],
});

export function ProductCardPrice({ price, priceText, discountedPrice, badgeText, isLoading = false, compact = false, className, ...rest }) {
  if (isLoading) {
    return h('div', { 'data-slot': 'product-card-price', 'aria-busy': 'true', className: cx('og-pc-price', 'og-pc-price--loading', className), ...rest },
      h('div', { className: 'og-pc-price__row' }, h(Skeleton, { variant: 'text', width: 36, height: 16 }), h(Skeleton, { variant: 'text', width: 76, height: 28 })));
  }
  return h('div', { 'data-slot': 'product-card-price', 'data-compact': compact || undefined, className: cx('og-pc-price', compact && 'og-pc-price--compact', className), ...rest },
    badgeText && h('div', { className: 'og-pc-price__badge' }, h(SaveBadge, { text: badgeText })),
    h('div', { className: 'og-pc-price__row' },
      h('span', { className: 'og-pc-price__label' }, priceText),
      h('span', { className: 'og-pc-price__wrap' },
        h('span', { className: cx('og-pc-price__now', discountedPrice && 'og-pc-price__now--sale') }, discountedPrice || price),
        discountedPrice && h('s', { className: 'og-pc-price__old' }, price))));
}
describe(ProductCardPrice, 'The price row of a product card: a label ("From"), the price, and with a discount the new price in green and the old one struck through. The sizes follow the width of the card; `compact` makes them smaller still.', {
  price: ['string', null, 'Regular price, already formatted'],
  priceText: ['string', null, 'Label before the price, e.g. "From"'],
  discountedPrice: ['string', null, 'Price with the discount; the regular price is then struck through'],
  badgeText: ['string | null', null, 'Text of the green save badge above the price'],
  isLoading: ['boolean', 'false', 'Show a skeleton while the currency is not known yet'],
  compact: ['boolean', 'false', 'Smaller text for compact cards (e.g. on the main page)'],
});

export function ProductCard({
  url, titleHtml, titleText, descriptionHtml, imageSrc, badgeType, badgeObject, presetBadgeText, timerDate, remainingMs, timerDaysLabel, calendarSlotsProps,
  priceProps, wishlistSlot, priceFooterSlot, onClick, className, compact = false, ...rest
}) {
  const hasCalendar = !!calendarSlotsProps;
  const badgeOptions = presetBadgeText ? { text: presetBadgeText } : undefined;
  const hasTimer = !!timerDate || remainingMs != null;
  const badge = (badgeType || badgeObject) && h(ProductBadge, { type: badgeType ?? '', badgeObject, options: badgeOptions });
  return h('a', {
    'data-slot': 'product-card', 'data-compact': compact || undefined, href: url, 'aria-label': titleText || 'View item',
    className: cx('og-pc', compact && 'og-pc--compact', className),
    onClick: (e) => { if ((e.metaKey || e.ctrlKey || e.shiftKey) && openCmsLink(e)) return; onClick && onClick(e); },
    onAuxClick: (e) => { if (e.button === 1) openCmsLink(e); },
    ...rest,
  },
  imageSrc && h('img', { src: imageSrc, alt: titleText || '', loading: 'lazy', className: 'og-pc__image' }),
  h('div', { 'aria-hidden': 'true', className: 'og-pc__overlay' }),
  h('div', { className: 'og-pc__content' },
    (badge || hasTimer) && h('div', { className: 'og-pc__badges' }, badge, !hasCalendar && hasTimer && h(BadgeWithTimer, { timer: timerDate, remainingMs, daysLeftLabel: timerDaysLabel })),
    wishlistSlot && h('div', { className: 'og-pc__wish' }, wishlistSlot),
    h('div', { className: 'og-pc__title', dangerouslySetInnerHTML: { __html: neutralizeAnchors(titleHtml || '') } }),
    hasCalendar && h(NextRaidBadge, { ...calendarSlotsProps, compact }),
    descriptionHtml && h('div', { className: 'og-pc__desc', dangerouslySetInnerHTML: { __html: neutralizeAnchors(descriptionHtml) } }),
    priceProps && h('div', { className: 'og-pc__price' }, h(ProductCardPrice, { ...priceProps, compact })),
    priceFooterSlot && h('div', { className: 'og-pc__footer' }, priceFooterSlot)));
}
describe(ProductCard, 'A tall product tile: a full-bleed picture under a gradient, badges at the top, then title, description and price at the bottom. The whole tile is one link; links inside the CMS text become plain text that opens in a new tab on a modifier click. The text is always light, as it sits on the picture.', {
  url: ['string', null, 'Where the card leads'],
  titleHtml: ['string', null, 'Title as CMS HTML (sanitized upstream)'],
  titleText: ['string', null, 'Plain title: the accessible name and the picture alt'],
  descriptionHtml: ['string', null, 'Description as CMS HTML; a list gets diamond bullets'],
  imageSrc: ['string | null', null, 'Background picture'],
  badgeType: ["'OutOfStock' | 'TimerOffer' | string", null, 'Frontend badge preset (see ProductBadge)'],
  badgeObject: ['ProductBadgeObject | null', null, 'Admin badge with its own colors; takes precedence over `badgeType`'],
  presetBadgeText: ['string', null, 'Localized text of a preset badge'],
  timerDate: ['Date | string | number', null, 'Moment the offer ends: shows an expiring badge (hidden when `calendarSlotsProps` is set)'],
  remainingMs: ['number', null, 'A fixed time left in ms instead of `timerDate`: the badge does not tick'],
  timerDaysLabel: ['string', null, 'Text after the number of days in the timer badge'],
  calendarSlotsProps: ['NextRaidBadgeProps | null', null, 'Shows a next raid badge between the title and the description'],
  priceProps: ['ProductCardPriceProps | null', null, 'Price row; omit to hide it'],
  wishlistSlot: ['ReactNode', null, 'Favorite toggle in the top corner'],
  priceFooterSlot: ['ReactNode', null, 'Right under the price, e.g. an installment message'],
  onClick: ['(event) => void', null, 'Called when the card is clicked'],
  compact: ['boolean', 'false', 'Smaller fonts and a card without its own background (main page)'],
});
