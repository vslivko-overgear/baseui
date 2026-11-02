// Small shared pieces of the Overgear example, built from the baseui components.
import { Children, useState } from '../../src/react.js';
import { ClickableCard } from '../../src/components/Card.jsx';
import { ProductListing } from '../../src/components/ProductListing.jsx';
import { Breadcrumbs } from '../../src/components/Breadcrumbs.jsx';
import { Badge } from '../../src/components/Badge.jsx';
import { Hint } from '../../src/components/Hint.jsx';
import { IconButton } from '../../src/components/Button.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { Token } from '../../src/components/Token.jsx';
import { Dropdown } from '../../src/components/Dropdown.jsx';
import { useStore } from './store.jsx';
import { useToast } from '../../src/components/Toast.jsx';
import { go, href, useMedia, openMiniCart } from './util.js';
import { money, gameOf, GAME_TILES, EMOJI, sold } from './data.js';

const CARD_TONE = { blue: 'blue', 'blue-light': 'blue', green: 'green', orange: 'orange', pink: 'pink', red: 'red' };
const BADGE_VARIANT = { 'Hot Offer': 'error', Sale: 'success', 'Save More': 'info', Bundle: 'info', Seasonal: 'warning' };

/** The head of a page: breadcrumbs, then the title with its line under it as one group. */
export function PageHead({ crumbs, title, meta, media, children }) {
  return (
    <div className={`og-stack ${crumbs ? 'og-stack--crumbs' : 'og-stack--close'}`}>
      {crumbs && <Breadcrumbs items={crumbs} />}
      <div className={media ? 'og-head-row' : undefined}>
        {media}
        <div className="og-stack og-stack--hair">
          <h1 className="og-title">{title}</h1>
          {meta && <p className="og-meta">{meta}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}

/** `fill`: the page is one block that takes the whole screen, centered (a login prompt, an empty cart). */
export function Page({ children, fill, roomy, bar, crumbs: withCrumbs }) {
  // the title of a page belongs to the first block under it: they are one group, 16px apart; the other blocks are a section apart
  const kids = Children.toArray(children);
  const head = kids[0]?.type === PageHead;
  const crumbs = withCrumbs || (head && kids[0].props.crumbs);
  return (
    <div className={`og-page${fill ? ' og-page--fill' : ''}${roomy ? ' og-page--roomy' : ''}${bar ? ' og-page--bar' : ''}${crumbs ? ' og-page--crumbs' : ''}`}>
      {head ? <div className="og-stack">{kids[0]}{kids[1]}</div> : kids[0]}
      {kids.slice(head ? 2 : 1)}
    </div>
  );
}

export function Section({ title, action, close, wide, children }) {
  return (
    <section className={`og-section${close ? ' og-section--close' : ''}${wide ? ' og-section--wide' : ''}`}>
      {(title || action) && (
        <div className="og-section__head">
          {title && <h2 className="og-h2">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

/** A tile of the games block: a light card with the name of the game and its picture on the right, fading into the card. */
export function GameChip({ slug, width, tag }) {
  const game = gameOf(slug);
  return (
    <ClickableCard label={game.name} variant="default" padding={0} onClick={() => go(`/games/${slug}`)} style={{ width, flex: 'none' }}>
      <span className="og-gchip">
        <span className="og-gchip__name">{game.name}</span>
        {tag && <span className="og-gchip__tag"><Badge variant="primary" size="sm" label={tag} icon={tag === 'Popular' ? <img src={EMOJI('Fire')} alt="" width="12" height="12" draggable="false" /> : undefined} /></span>}
        {game.cover && <img className="og-gchip__art" src={game.cover} alt="" loading="lazy" draggable="false" />}
      </span>
    </ClickableCard>
  );
}

/** A game tile: a cover with the name of the game over it. The cover is drawn from the tone of the game; `game.cover` (an image url) replaces it. */
export function GameTile({ game }) {
  return (
    <ClickableCard label={game.name} variant="transparent" padding={0} onClick={() => go(`/catalog/${game.slug}`)}>
      <span className="og-cover" data-tone={game.tone} style={game.cover ? { backgroundImage: `url(${game.cover})` } : undefined}>
        <span className="og-cover__title">{game.name}</span>
      </span>
    </ClickableCard>
  );
}

/** The score: one star the size of the text, the number (regular, primary) and the count of ratings (secondary, in brackets); `size="md"` is the bigger text for a page header. */
export const Stars = ({ value, reviews, size = 'sm' }) => (
  <span className="og-rate" data-size={size}>
    <Icon name="Star01" size={size === 'md' ? 16 : 14} filled aria-hidden="true" className="og-rate__star" />
    <span className="og-rate__text">
      <span className="og-rate__value">{value.toFixed(1)}</span>
      {reviews ? <span className="og-rate__count">{`(${reviews})`}</span> : null}
    </span>
  </span>
);

export function WishButton({ id, compact, variant = 'ghost' }) {
  const store = useStore();
  const on = store.wishlist.includes(id);
  // the heart plays a short move when it is tapped: a pop when it fills, a quiet shrink when it empties
  const [move, setMove] = useState('');
  const icon = <span className={`og-heart${move ? ` is-${move}` : ''}`} onAnimationEnd={() => setMove('')}><Icon name="Heart" size={24} filled={on} /></span>;
  return <IconButton variant={variant} size={compact ? 'xsm' : 'md'} tooltip={false} label={on ? 'Remove from favorites' : 'Add to favorites'} icon={icon} onClick={(e) => { e.stopPropagation(); setMove(on ? 'off' : 'on'); store.toggleWish(id); }} />;
}

/** The props of a ProductCard for an offer (the card of the design system), with the heart of the favorites. */
export function offerProps(o, store, key = o.id, showGame = false) {
  const game = gameOf(o.game);
  return {
    id: key,
    title: o.title,
    price: money(o.price),
    eyebrow: showGame ? game.name : undefined,
    image: o.image,
    imageAlt: `${game.name}: ${o.title}`,
    badge: o.badge,
    badgeVariant: BADGE_VARIANT[o.badge] || 'secondary',
    rating: o.rating,
    meta: `${sold(o.sold)} sold`,
    onClick: () => go(`/offer/${o.id}`),
    favorite: { active: store.wishlist.includes(o.id), onToggle: () => store.toggleWish(o.id) },
  };
}

/** The offers as a listing of the design system: whole rows, "Show more" after the first two (the setting of the example). */
export function OfferListing({ offers, showGame = false, ...rest }) {
  const store = useStore();
  return <ProductListing more="infinite" items={offers.map((o, i) => offerProps(o, store, o.listKey ?? `${o.id}~${i}`, showGame))} {...rest} />;
}

export const Link = ({ to, children, ...rest }) => <a href={href(to)} {...rest}>{children}</a>;


/** The way a listing is sorted: a chip with the current method and a chevron at its right end; it opens the list of methods (no "Sort by" label). */
export function SortChip({ value, onValueChange, options, label = 'Sorting' }) {
  const current = options.find((o) => o.value === value) || options[0];
  return (
    <Dropdown
      size="sm"
      label={label}
      value={value}
      onValueChange={onValueChange}
      options={options}
      trigger={<Token size="sm" action="press" endIcon={<Icon name="ChevronDown" size={20} />}>{current.label}</Token>}
    />
  );
}

// the payment logos of the site (saved as SVG in assets/payments) and the security badges
const PAY_ALL = [['mastercard', 'Mastercard'], ['visa', 'Visa'], ['paypal', 'PayPal'], ['apple-pay', 'Apple Pay'], ['google-pay', 'Google Pay'], ['jcb', 'JCB'], ['stripe', 'Stripe'], ['sepa', 'SEPA'], ['securecode', 'Mastercard SecureCode'], ['verified-by-visa', 'Verified by Visa'], ['pci-dss', 'PCI DSS']];
export const PAY_MAIN = PAY_ALL.slice(0, 8);
export const PAY_BADGES = PAY_ALL.slice(8);
export function PaymentLogos({ items = PAY_ALL, label = 'Payment methods' }) {
  return (
    <ul className="og-pay" aria-label={label}>
      {items.map(([file, name]) => <li key={file}><img src={`./assets/payments/${file}.svg`} alt={name} loading="lazy" /></li>)}
    </ul>
  );
}


// the cashback mark from the Overgear UI icons (CashbackBadgeIcon): a gold hexagon with a shield
export function CashbackMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <g clipPath="url(#og-cashback-clip)">
        <path fill="url(#og-cashback-gradient)" d="M6.96.242a2.36 2.36 0 0 1 2.08 0l4.494 2.202A2.43 2.43 0 0 1 14.83 4.1l1.11 4.95a2.47 2.47 0 0 1-.463 2.063l-3.11 3.97a2.38 2.38 0 0 1-1.873.918H5.506a2.38 2.38 0 0 1-1.873-.918l-3.11-3.97A2.47 2.47 0 0 1 .06 9.05l1.11-4.95a2.43 2.43 0 0 1 1.296-1.655z" />
        <path fill="#191A29" d="M12.584 4.578c-1.988-.7-3.228-.841-4.585-.841s-2.593.137-4.588.844a.27.27 0 0 0-.182.257c0 5.193 3.52 8.395 4.595 9.25a.28.28 0 0 0 .343.004c.686-.542 3.009-2.563 4.06-5.818a.28.28 0 0 0-.04-.239s-.004-.007-.008-.01a.3.3 0 0 0-.11-.087 10.179 10.179 0 0 0-4.023-.827h-.05a.274.274 0 0 0-.274.271v1.386c0 .148.124.27.274.27h.047a8 8 0 0 1 1.667.174 10.1 10.1 0 0 1-1.714 2.397 10 10 0 0 1-2.707-5.577c.92-.249 1.81-.371 2.71-.371.901 0 1.904.148 2.903.425l.033.011q.766.218 1.353.47a.3.3 0 0 0 .245-.011.28.28 0 0 0 .138-.199q.104-.754.102-1.52a.27.27 0 0 0-.182-.256z" />
      </g>
      <defs>
        <linearGradient id="og-cashback-gradient" x1="2.37" x2="12.153" y1="13.434" y2="2.021" gradientUnits="userSpaceOnUse"><stop stopColor="#B9843D" /><stop offset="0.563" stopColor="#F5D56B" /><stop offset="1" stopColor="#FEFBAD" /></linearGradient>
        <clipPath id="og-cashback-clip"><path fill="#fff" d="M0 0h16v16H0z" /></clipPath>
      </defs>
    </svg>
  );
}
/** The words that explain the cashback: the hint of the line of the summary and of every tag of it. */
export const CASHBACK_HINT = 'Cashback is credited to your balance in OG Coins after the order is completed';

/** A tag of the cashback (light yellow, the mark of OG Coins): it explains itself, a tooltip with a mouse and a dialog on a phone. Every tag of the cashback is this one. */
export function CashbackTag({ label, size = 'md' }) {
  return <Hint label={`About the cashback, ${label}`} content={CASHBACK_HINT}><Badge variant="warning-light" size={size} label={label} icon={<CashbackMark />} /></Hint>;
}

/** The cashback of an order, in percent of its price (paid in OG Coins). */
export const CASHBACK = 1;
export const cashbackOf = (amount) => (amount * CASHBACK / 100).toFixed(2);

/** What follows "Add to cart": the mini-cart opens, on a desktop and on a phone. */
export function useAddedToCart() {
  return openMiniCart;
}
