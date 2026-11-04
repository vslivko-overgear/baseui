// Small shared pieces of the Overgear example, built from the baseui components.
import { Children, useState } from '../../src/react.js';
import { ClickableCard } from '../../src/components/Card.jsx';
import { ProductListing } from '../../src/components/ProductListing.jsx';
import { Breadcrumbs } from '../../src/components/Breadcrumbs.jsx';
import { Badge } from '../../src/components/Badge.jsx';
import { Hint } from '../../src/components/Hint.jsx';
import { Button, IconButton } from '../../src/components/Button.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { Token } from '../../src/components/Token.jsx';
import { Dropdown } from '../../src/components/Dropdown.jsx';
import { useStore } from './store.jsx';
import { useToast } from '../../src/components/Toast.jsx';
import { go, href, useMedia, openMiniCart } from './util.js';
import { money, gameOf, GAME_TILES, EMOJI, sold } from './data.js';

const CARD_TONE = { blue: 'blue', 'blue-light': 'blue', green: 'green', orange: 'orange', pink: 'pink', red: 'red' };
export const BADGE_VARIANT = { 'Hot Offer': 'error', Sale: 'success', 'Save More': 'info', Bundle: 'info', Seasonal: 'warning' };

/** The head of a page: breadcrumbs, then the title with its line under it as one group. `media` stands at the start of the head (an avatar; with `mediaTop` it is level with the top of the title, not centered), `action` at its end, on the right edge of the block (an edit button). */
export function PageHead({ crumbs, title, meta, action, media, mediaTop = false, titleTestId, titleGap, children }) {
  return (
    <div className={`og-stack ${crumbs ? 'og-stack--crumbs' : 'og-stack--close'}`}>
      {crumbs && <Breadcrumbs items={crumbs} />}
      <div className={media || action ? `og-head-row${mediaTop ? ' og-head-row--top' : ''}` : undefined}>
        {media}
        <div className="og-stack og-stack--hair" style={titleGap === undefined ? undefined : { gap: titleGap }}>
          <h1 className="og-title" data-test-id={titleTestId}>{title}</h1>
          {meta && <p className="og-meta">{meta}</p>}
          {children}
        </div>
        {action && <div className="og-head-row__action">{action}</div>}
      </div>
    </div>
  );
}

/** `density`: how far the blocks of the page are apart. `dense` (16px) for a list page (orders), none for most pages (a section, 40px), `airy` (56px) for a page of a few big blocks (the wallet). `fill`: the page is one block that takes the whole screen, centered (a login prompt, an empty cart). */
export function Page({ children, fill, roomy, density, bar, crumbs: withCrumbs }) {
  // the title of a page belongs to the first block under it: they are one group, 16px apart; the other blocks are a section apart
  const kids = Children.toArray(children);
  const head = kids[0]?.type === PageHead;
  const crumbs = withCrumbs || (head && kids[0].props.crumbs);
  return (
    <div className={`og-page${fill ? ' og-page--fill' : ''}${roomy ? ' og-page--roomy' : ''}${density ? ` og-page--${density}` : ''}${bar ? ' og-page--bar' : ''}${crumbs ? ' og-page--crumbs' : ''}`}>
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
export function GameChip({ slug, width, grow, tag }) {
  const game = gameOf(slug);
  return (
    <ClickableCard label={game.name} variant="default" padding={0} onClick={() => go(`/games/${slug}`)} style={grow ? { flex: `${grow} 1 0`, minWidth: 0 } : { width, flex: 'none' }}>
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

export function WishButton({ id, compact, variant = 'ghost', text = false }) {
  const store = useStore();
  const on = store.wishlist.includes(id);
  // the heart plays a short move when it is tapped: a pop when it fills, a quiet shrink when it empties
  const [move, setMove] = useState('');
  const icon = <span className={`og-heart${move ? ` is-${move}` : ''}`} onAnimationEnd={() => setMove('')}><Icon name="Heart" size={text ? 20 : 24} filled={on} /></span>;
  // with `text`: a line heart and the words, in a row of information (the offer page)
  if (text) return <button type="button" className="og-wishlink" aria-pressed={on} onClick={(e) => { e.stopPropagation(); setMove(on ? 'off' : 'on'); store.toggleWish(id); }}>{icon}<span>{on ? 'In favorites' : 'Add to favorites'}</span></button>;
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
    points: o.bullets.slice(0, 3),
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
export function OfferListing({ offers, showGame = false, compact = false, points = !compact, className, ...rest }) {
  const store = useStore();
  // `compact`: five cards in a row and no selling points (the home page); the others have four, each with its three points unless `points` is off
  const items = offers.map((o, i) => { const props = offerProps(o, store, o.listKey ?? `${o.id}~${i}`, showGame); return points ? props : { ...props, points: undefined }; });
  return <ProductListing more="infinite" items={items} className={compact ? `og-listing--five ${className ?? ''}` : className} {...rest} />;
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
/** The logos under the button of an offer, as on the real page (stripe, cards, wallets, PayPal, crypto). */
export const PAY_OFFER = [['stripe', 'Stripe'], ['mastercard', 'Mastercard'], ['visa', 'Visa'], ['american-express', 'American Express'], ['apple-pay', 'Apple Pay'], ['google-pay', 'Google Pay'], ['paypal', 'PayPal'], ['crypto', 'Crypto']];
export function PaymentLogos({ items = PAY_ALL, label = 'Payment methods' }) {
  return (
    <ul className="og-pay" aria-label={label}>
      {items.map(([file, name]) => <li key={file}><img src={`./assets/payments/${file}.svg`} alt={name} loading="lazy" /></li>)}
    </ul>
  );
}


// the cashback tag and its mark are components of the sublibrary (overgear/components): every page draws the same one
export { CashbackMark, CashbackTag, CASHBACK_HINT, CASHBACK, cashbackOf } from '../components/cashback.jsx';

/** What follows "Add to cart": the mini-cart opens, on a desktop and on a phone. */
export function useAddedToCart() {
  return openMiniCart;
}
