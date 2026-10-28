import { h, cx } from '../../react.js';
import { describe } from '../../doc.js';
import { Card } from '../../components/Card.js';
import { Avatar } from '../../components/Avatar.js';

function Star() {
  return h('svg', { viewBox: '0 0 24 24', width: 14, height: 14, fill: 'currentColor', 'aria-hidden': 'true', className: 'og-offer__star' },
    h('path', { d: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z' }));
}

function ReviewStats({ rating, reviewsCount, className }) {
  if (!rating && !reviewsCount) return null;
  return h('span', { className: cx('og-offer__reviews', className) }, h(Star), rating && h('span', { className: 'og-offer__rating' }, rating), reviewsCount && h('span', { className: 'og-offer__count' }, reviewsCount));
}

export function OfferCard({ price, amountPerPrice, attributes, user, featured = false, hoverable = false, compact = false, specialSort, wishlistSlot, buyButtonSlot, bonusSlot, reserveBonusSlot = false, onClick, className, ...rest }) {
  return h('div', { 'data-slot': 'offer-card', 'data-featured': featured || undefined, 'data-layout': compact ? 'stacked' : 'auto', className: cx('og-offer', className), ...rest },
    h(Card, { padding: 16, className: cx('og-offer__body', featured && 'og-offer__body--featured', hoverable && 'og-offer__body--hoverable'), onClick },
      h('div', { className: 'og-offer__price' }, h('span', { className: 'og-offer__amount' }, price), h('span', { className: 'og-offer__per' }, amountPerPrice)),
      h('div', { className: 'og-offer__attrs' }, attributes.map((a) => h('div', { key: a.title, 'data-slot': 'offer-attribute', className: cx('og-offer__attr', a.filled && 'og-offer__attr--filled'), style: a.minWidth ? { flex: `0 0 ${a.minWidth}` } : undefined },
        a.icon && h('span', { className: 'og-offer__attr-icon', 'aria-hidden': 'true' }, a.icon),
        h('span', { className: 'og-offer__attr-text' }, h('span', { className: 'og-offer__attr-title' }, a.title), a.description && h('span', { className: 'og-offer__attr-desc' }, a.description))))),
      (bonusSlot || reserveBonusSlot) && h('div', { className: cx('og-offer__bonus', !bonusSlot && 'og-offer__bonus--empty') }, bonusSlot),
      h('div', { 'data-slot': 'offer-seller', className: 'og-offer__seller' },
        h('div', { className: 'og-offer__nick-row' },
          user.isOnline && h('span', { className: 'og-offer__online', role: 'img', 'aria-label': 'Online' }),
          h('span', { className: 'og-offer__nick' }, user.nick),
          h(Avatar, { name: user.nick, src: user.avatarUrl, size: 'xsm', shape: 'rounded', tooltip: false })),
        h(ReviewStats, { rating: user.rating, reviewsCount: user.reviewsCount })),
      wishlistSlot && h('div', { className: 'og-offer__wish' }, wishlistSlot),
      buyButtonSlot && h('div', { className: 'og-offer__buy' }, buyButtonSlot),
      typeof specialSort === 'number' && specialSort > 0 && h('span', { className: 'og-offer__sort', title: 'Special sort' }, specialSort)));
}
describe(OfferCard, 'A marketplace offer row: price, attribute cards, an optional bonus callout and the seller. It is a single row when the container is wide enough and a stack otherwise.', {
  price: ['string', null, 'Main price, already formatted'],
  amountPerPrice: ['string', null, 'What the price buys, e.g. "1000 gold"'],
  attributes: ['Array<{ title: string; description?: string; icon?: ReactNode; filled?: boolean; minWidth?: string }>', null, 'Attribute cards (the icon shows only in the wide layout)'],
  user: ['{ nick: string; avatarUrl?: string; isOnline: boolean; rating: string; reviewsCount: string }', null, 'Seller'],
  featured: ['boolean', 'false', 'Highlights the card with a selected border'],
  hoverable: ['boolean', 'false', 'Highlight on hover (mouse devices only)'],
  compact: ['boolean', 'false', 'Always use the stacked layout, whatever the width'],
  specialSort: ['number | null', null, 'Admin sort index badge'],
  wishlistSlot: ['ReactNode', null, 'Favorite toggle; in the top corner when stacked'],
  buyButtonSlot: ['ReactNode', null, 'Call to action, e.g. a Buy button'],
  bonusSlot: ['ReactNode', null, 'Promo callout between the attributes and the seller'],
  reserveBonusSlot: ['boolean', 'false', 'Keep the bonus column width even without a bonus, so the seller column lines up across a list'],
  onClick: ['(event) => void', null, 'Called when the card is clicked'],
});
