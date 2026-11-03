import { useState } from '../../src/react.js';
import { Button } from '../../src/components/Button.jsx';
import { Card } from '../../src/components/Card.jsx';
import { Badge } from '../../src/components/Badge.jsx';
import { SegmentedControl } from '../../src/components/SegmentedControl.jsx';
import { RadioGroup } from '../../src/components/RadioGroup.jsx';
import { CheckboxGroup } from '../../src/components/CheckboxGroup.jsx';
import { Selector } from '../../src/components/Selector.jsx';
import { TextInput } from '../../src/components/TextInput.jsx';
import { NumberInput } from '../../src/components/NumberInput.jsx';
import { Status } from '../../src/components/Status.jsx';
import { Avatar } from '../../src/components/Avatar.jsx';
import { List, ListItem } from '../../src/components/List.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { Bleed } from '../../src/components/Layout.jsx';
import { go } from './util.js';
import { OFFERS, REVIEWS, SERVICES, money, offerOf, gameOf, sold } from './data.js';
import { useAddedToCart, Page, PageHead, Section, OfferListing, Stars, WishButton, CashbackTag, CASHBACK, PaymentLogos, PAY_OFFER } from './ui.jsx';
import { useStore } from './store.jsx';
import { Faq } from './games.jsx';

const MODES = [{ value: 'piloted', label: 'Piloted' }, { value: 'self', label: 'Self-play' }, { value: 'remote', label: 'Remote control' }];
const EXTRAS = [{ value: 'express', label: 'Express start, +$12', price: 12 }, { value: 'stream', label: 'Live stream, +$8', price: 8 }, { value: 'loot', label: 'Priority loot, +$20', price: 20 }];
const TRUST = [
  ['UserCheck01', 'ID-verified pros', 'Every player passes our selection and checks'],
  ['Lock01', 'Secure payment', 'Cards and wallets are processed by certified providers'],
  ['LifeBuoy01', '24/7 support', 'A human answers in the order chat at any hour'],
];
/** "Why Players Choose Overgear": the four promises of the real pages (the same on every product). */
const WHY = [
  ['UserCheck01', 'In-House Boosters', 'Verified pros under full control. Top skill — no random freelancers'],
  ['Clock', 'Time-First Priority', 'Fast start. Streamlined process. Every minute counts — yours first'],
  ['Tag01', 'Fair Price Promise', 'Premium results. Fair cost. No cheap tricks, no shortcuts'],
  ['ShieldTick', 'Zero-Ban Protocol', 'Manual boosting only. Smart VPN routes. No bots or cheats'],
];
/** "How does it work?": the steps of the real pages (the same on every product). */
const STEPS = [
  'A private Discord channel is created — join to meet your booster and agree on a start time',
  'Share your account details — the booster plays your character while you rest',
  'The job is done — the booster confirms in Discord, and every drop stays with you',
];
/** The icons of the selling points under the title (the first three points of the offer). */
const USP_ICONS = ['Zap', 'Star01', 'ShieldTick'];
const DIFFICULTY = [{ value: 'normal', label: 'Normal', k: 0.6 }, { value: 'heroic', label: 'Heroic', k: 1 }, { value: 'mythic', label: 'Mythic', k: 2.2 }];

/** An offer: what it gives, the options that change the price, the purchase panel, details and reviews. */
export function Offer({ id }) {
  const store = useStore();
  const addedToCart = useAddedToCart();
  const offer = offerOf(id);
  const [mode, setMode] = useState('piloted');
  const [difficulty, setDifficulty] = useState('heroic');
  const [extras, setExtras] = useState([]);
  const [qty, setQty] = useState(1);
  const [reviewsShown, setReviewsShown] = useState(4);
  const [note, setNote] = useState('');
  if (!offer) return <Page><Status status="neutral" title="Offer not found" actionLabel="All games" onAction={() => go('/catalog')} /></Page>;
  const game = gameOf(offer.game);
  const k = DIFFICULTY.find((d) => d.value === difficulty).k;
  const extra = extras.reduce((n, e) => n + EXTRAS.find((x) => x.value === e).price, 0);
  const unit = +(offer.price * k + extra + (mode === 'self' ? -offer.price * 0.1 : 0)).toFixed(2);
  const service = SERVICES.find((s) => s.id === offer.service) || { id: offer.service, label: 'Services' };
  const add = () => {
    store.add({ key: `${offer.id}-${mode}-${difficulty}-${extras.join()}`, id: offer.id, image: offer.image, eta: offer.eta, title: offer.title, sub: `${MODES.find((m) => m.value === mode).label}, ${difficulty}${extras.length ? `, ${extras.length} extras` : ''}`, price: unit, qty });
    addedToCart();
  };
  // ten, so that the first row is full at any width (the listing shows whole rows): the same service first, then the other offers of the game, then the most sold ones of the other games
  const others = OFFERS.filter((o) => o.id !== offer.id);
  const rank = (o) => (o.service === offer.service ? 0 : o.game === offer.game ? 1 : 2);
  const related = [...others].sort((a, b) => rank(a) - rank(b) || (rank(a) === 2 ? b.sold - a.sold : 0)).slice(0, 10);
  const [first, ...rest] = offer.bullets;
  return (
    <Page>
      <PageHead crumbs={[{ label: 'Home', href: '#/' }, { label: game.name, href: `#/games/${game.slug}` }, { label: service.label, href: `#/games/wow?s=${service.id}` }, { label: offer.title }]} title={offer.title} media={<div className="og-art og-art--square" role="img" aria-label={offer.title}>{offer.image ? <img className="og-art__img" src={offer.image} alt="" /> : <Icon name="Image01" size={32} />}</div>}>
        <div className="og-row">
          {offer.badge && <Badge variant="info" label={offer.badge} />}
          <Stars value={offer.rating} reviews={offer.reviews} size="md" />
          <span className="og-rate__text og-rate__text--md"><span className="og-rate__count">{`${sold(offer.sold)} sold`}</span></span>
          <WishButton id={offer.id} text />
        </div>
      </PageHead>
        <div className="og-split og-split--right">
          <div className="og-stack og-stack--xl">
            <div className="og-stack">
            <Card variant="surface" padding={4} data-test-id="offer-usp">
              <ul className="og-usp">
                {offer.bullets.slice(0, 3).map((b, i) => <li key={b}><Icon name={USP_ICONS[i]} size={20} /><span>{b}</span></li>)}
              </ul>
            </Card>
            <Card variant="surface" padding={5}>
              <div className="og-stack og-stack--lg">
                  <SegmentedControl label="Difficulty" fullWidth size="sm" value={difficulty} onValueChange={setDifficulty} items={DIFFICULTY.map((d) => ({ value: d.value, label: d.label }))} />
                  <RadioGroup title="How it is played" value={mode} onValueChange={setMode} options={MODES} />
                  <CheckboxGroup title="Extras" value={extras} onValueChange={setExtras} options={EXTRAS.map((e) => ({ value: e.value, label: e.label }))} />
                  <NumberInput label="Quantity" min={1} max={10} value={qty} onValueChange={(v) => setQty(v ?? 1)} />
                  <TextInput label="Note for the booster" multiline minRows={2} value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
            </Card>
            </div>
            <div className="og-stack og-stack--xl og-offer-info">
            <Section title="Your wins">
              <ul className="og-wins" data-test-id="offer-wins">
                <li><Icon name="Check" size={20} /><span><strong className="og-accent">{first}</strong></span></li>
                {rest.map((b) => <li key={b}><Icon name="Check" size={20} /><span><strong>{b}</strong></span></li>)}
                <li><Icon name="Check" size={20} /><span><strong>Every drop is yours</strong> — all items and gold found on the run stay with you</span></li>
              </ul>
            </Section>
            <Section title="How does it work?">
              <ol className="og-bullets og-bullets--num og-rank__how">{STEPS.map((t) => <li key={t}><span>{t}</span></li>)}</ol>
            </Section>
            <Card variant="surface" padding={5}>
              <div className="og-stack og-stack--lg" data-test-id="offer-why">
                <h2 className="og-h2">Why Players Choose Overgear</h2>
                <ul className="og-trust">
                  {WHY.map(([icon, t, d]) => (
                    <li key={t}><Icon name={icon} size={24} /><div className="og-stack og-stack--hair"><p className="og-trust__title">{t}</p><p className="og-meta">{d}</p></div></li>
                  ))}
                </ul>
              </div>
            </Card>
            <Section title="What players say about Overgear">
              <ul className="og-reviewlist" data-test-id="offer-reviews">
                {REVIEWS.slice(0, reviewsShown).map(([n, t]) => (
                  <li key={n} className="og-review">
                    <Avatar alt={n} shape="rounded" />
                    <div className="og-review__body">
                      <strong className="og-review__name">{n}</strong>
                      <span className="og-stars" aria-label="5 stars">{[0, 1, 2, 3, 4].map((i) => <Icon key={i} name="Star01" size={16} filled />)}</span>
                      <p className="og-text">{t}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {reviewsShown < REVIEWS.length && <Button variant="secondary" size="lg" width="100%" label="Show more reviews" onClick={() => setReviewsShown((n) => n + 4)} data-test-id="offer-reviews-more" />}
            </Section>
            <Card variant="surface" padding={5}>
              <div className="og-custom" data-test-id="offer-custom">
                <div className="og-stack og-stack--hair">
                  <h2 className="og-h3">Create Your Custom Offer!</h2>
                  <p className="og-meta">If you can't find what you need, let's customize! Click to create your perfect offer now</p>
                </div>
                <div className="og-stack og-stack--close og-custom__act">
                  <Button variant="primary" size="lg" label="Request custom offer" onClick={() => go('/info/contact')} />
                  <span className="og-meta og-custom__reply"><Icon name="Clock" size={16} /><b>2 minutes</b> is our usual reply time</span>
                </div>
              </div>
            </Card>
            <Section title={`About ${offer.title}`}>
              <p className="og-text">{`Buy ${offer.title} and a verified pro player completes it on your character by hand. You follow the progress in the order chat, and the money is released only when you confirm the result`}</p>
              <p className="og-text">Every order is played manually: no scripts, no bots, a VPN on every login. Anything that drops along the way stays on your character</p>
            </Section>
            <Section title="What the service includes">
              <ol className="og-bullets og-bullets--num og-rank__how">
                {offer.bullets.map((b) => <li key={b}><span>{b}</span></li>)}
                <li><span>An active game subscription and a character at the required level</span></li>
                <li><span>A pro player on your order within 15 minutes, with a VPN on every login</span></li>
              </ol>
            </Section>
            <Section title="Questions"><Faq /></Section>
                </div>
          </div>
          <div className="og-stack og-sticky">
            <Card variant="surface" padding={5}>
              <div className="og-stack">
                <div className="og-stack">
                  <div className="og-pricerow">
                    <p className="og-price og-price--lg">{money(unit * qty)}</p>
                    <CashbackTag size="lg" label={`Cashback ${CASHBACK}%`} />
                  </div>
                  {qty > 1 && <p className="og-meta">{`${money(unit)} each`}</p>}
                </div>
                <ul className="og-facts" data-test-id="offer-facts">
                  <li><Icon name="Clock" size={20} /><span><b>15 minutes</b> average start time</span></li>
                  <li><Icon name="Clock" size={20} /><span><b>3 hours 15 minutes</b> order completion</span></li>
                </ul>
                <div className="og-stack">
                  <Button variant="primary" size="lg" width="100%" label="Add to cart" icon={<Icon name="ShoppingCart01" size={24} />} onClick={add} />
                  <div className="og-offer-pay"><PaymentLogos items={PAY_OFFER} /></div>
                  <p className="og-guarantee" data-test-id="offer-guarantee"><Icon name="ShieldTick" size={20} />100% moneyback guarantee</p>
                </div>
              </div>
            </Card>
            <Card variant="surface" padding={5}>
              <div className="og-stack og-stack--lg">
                <ul className="og-trust">
                  {TRUST.map(([icon, t, d]) => (
                    <li key={t}><Icon name={icon} size={24} /><div className="og-stack og-stack--hair"><p className="og-trust__title">{t}</p><p className="og-meta">{d}</p></div></li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </div>
      {related.length > 0 && (
        <Section title="You may also like">
          <div data-test-id="offer-more">
            <OfferListing offers={related} rows={1} more="button" moreLabel="Discover more" />
          </div>
        </Section>
      )}
    </Page>
  );
}
