import { useState } from '../../src/react.js';
import { Button } from '../../src/components/Button.jsx';
import { Card } from '../../src/components/Card.jsx';
import { TokenGroup } from '../../src/components/TokenGroup.jsx';
import { Token } from '../../src/components/Token.jsx';
import { DatePicker } from '../../src/components/Calendar.jsx';
import { CheckboxGroup } from '../../src/components/CheckboxGroup.jsx';
import { Selector } from '../../src/components/Selector.jsx';
import { Status } from '../../src/components/Status.jsx';
import { Avatar } from '../../src/components/Avatar.jsx';
import { List, ListItem } from '../../src/components/List.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { Hint } from '../../src/components/Hint.jsx';
import { Bleed } from '../../src/components/Layout.jsx';
import { go, useMedia } from './util.js';
import { OFFERS, REVIEWS, SERVICES, money, offerOf, gameOf, sold } from './data.js';
import { PayBar } from './order.jsx';
import { useAddedToCart, Page, PageHead, Section, OfferListing, BADGE_VARIANT, Stars, WishButton, CashbackTag, CASHBACK, PaymentLogos, PAY_OFFER } from './ui.jsx';
import { useStore } from './store.jsx';
import { Faq } from './games.jsx';

const REGIONS = [{ value: 'eu', label: 'EU' }, { value: 'us', label: 'US' }];
const LOOT = [{ value: 'group', label: 'Group loot' }, { value: 'personal', label: 'Personal loot' }, { value: 'master', label: 'Master loot' }];
// the way it is played: the price of a way is a share of the price of the offer
const MODES = [{ value: 'self', label: 'Self-play', k: 1 }, { value: 'piloted', label: 'Piloted', k: 1 }, { value: 'remote', label: 'Remote', k: 1.05, note: '+5%' }];
const DAYS = [{ value: 'today', label: 'Today' }, { value: 'tomorrow', label: 'Tomorrow' }];
const TIMES = ['22:30', '22:45', '23:00', '23:30', '23:45'].map((v) => ({ value: v, label: v }));
const EXTRAS = [{ value: 'grotto', label: 'Add Tidebound Grotto at 30% OFF', price: 10.95, was: 15.64 }, { value: 'kithix', label: "Add Kith'ix", price: 11.17 }];
const TRUST = [
  ['UserCheck01', 'ID-verified pros', 'Every player passes our selection and checks'],
  ['Lock01', 'Secure payment', 'Cards and wallets are processed by certified providers'],
  ['LifeBuoy01', '24/7 support', 'A human answers in the order chat at any hour'],
];
/** "Why Players Choose Overgear": the four promises (an icon of its own each, in assets/why) of the real pages (the same on every product). */
const WHY = [
  ['in-house-boosters', 'In-House Boosters', 'Verified pros under full control. Top skill — no random freelancers'],
  ['time-first', 'Time-First Priority', 'Fast start. Streamlined process. Every minute counts — yours first'],
  ['fair-price', 'Fair Price Promise', 'Premium results. Fair cost. No cheap tricks, no shortcuts'],
  ['zero-ban', 'Zero-Ban Protocol', 'Manual boosting only. Smart VPN routes. No bots or cheats'],
];
/** "How does it work?": the steps of the real pages (the same on every product). */
const STEPS = [
  'A private Discord channel is created — join to meet your booster and agree on a start time',
  'Share your account details — the booster plays your character while you rest',
  'The job is done — the booster confirms in Discord, and every drop stays with you',
];
/** The icons of the selling points under the title (the first three points of the offer). */
/** What opens when a point is hovered (a tooltip) or tapped (the standard dialog of a phone): a line more about it. */
const USP_MORE = [
  (b) => `${b}. A verified pro player does it by hand on your character: no scripts, no bots, and a VPN on every login`,
  (b) => `${b}. The clock starts when the booster begins, and you follow the progress in the order chat until the job is done`,
  (b) => `${b}. Your loot, gold and progress stay with you, and the money is released only when you confirm the result`,
];
const USP_ICONS = ['Zap', 'Star01', 'ShieldTick'];
// how much of the raid is played: a share of the price
const BOSSES = [{ value: 'all', label: '8/8 bosses', k: 1 }, { value: 'last', label: '2/2 last bosses', k: 0.58 }];

/** An offer: what it gives, the options that change the price, the purchase panel, details and reviews. */
export function Offer({ id }) {
  const store = useStore();
  const addedToCart = useAddedToCart();
  const offer = offerOf(id);
  const [region, setRegion] = useState('eu');
  const [loot, setLoot] = useState('group');
  const [mode, setMode] = useState('self');
  const [bosses, setBosses] = useState('all');
  const [day, setDay] = useState('today');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('22:30');
  const [extras, setExtras] = useState([]);
  const mobile = useMedia('(max-width: 767px)');
  const [reviewsShown, setReviewsShown] = useState(4);
  if (!offer) return <Page><Status status="neutral" title="Offer not found" actionLabel="All games" onAction={() => go('/catalog')} /></Page>;
  const game = gameOf(offer.game);
  const bossK = BOSSES.find((d) => d.value === bosses).k;
  const extra = extras.reduce((n, e) => n + EXTRAS.find((x) => x.value === e).price, 0);
  const unit = +(offer.price * bossK * MODES.find((m) => m.value === mode).k + extra).toFixed(2);
  const service = SERVICES.find((s) => s.id === offer.service) || { id: offer.service, label: 'Services' };
  const add = () => {
    store.add({ key: `${offer.id}-${mode}-${bosses}-${extras.join()}`, id: offer.id, image: offer.image, eta: offer.eta, title: offer.title, sub: `${MODES.find((m) => m.value === mode).label}, ${BOSSES.find((d) => d.value === bosses).label}${extras.length ? `, ${extras.length} extras` : ''}`, price: unit, qty: 1 });
    addedToCart();
  };
  // all the other offers, closest first (the listing shows whole rows and goes on as it is scrolled): the same service first, then the other offers of the game, then the most sold ones of the other games
  const others = OFFERS.filter((o) => o.id !== offer.id);
  const rank = (o) => (o.service === offer.service ? 0 : o.game === offer.game ? 1 : 2);
  const related = [...others].sort((a, b) => rank(a) - rank(b) || (rank(a) === 2 ? b.sold - a.sold : 0));
  const [first, ...rest] = offer.bullets;
  // the selling points: separate tags on a surface, each as wide as its text (on a phone the row scrolls sideways)
  const usp = (
    <ul className="og-usp" data-test-id="offer-usp">
      {offer.badge && <li><span className={`og-usp__tag og-usp__tag--${BADGE_VARIANT[offer.badge] || 'secondary'}`} data-test-id="offer-badge">{offer.badge}</span></li>}
      {offer.bullets.slice(0, 3).map((b, i) => (
        <li key={b}>
          <Hint label={`More about: ${b}`} content={USP_MORE[i](b)}>
            <span className="og-usp__tag"><Icon name={USP_ICONS[i]} size={20} filled /><span>{b}</span></span>
          </Hint>
        </li>
      ))}
    </ul>
  );
  // the price and the buttons, the facts and the payment methods, and the reasons to trust: a column at the right on a desktop; on a phone under the form of the order
  const aside = (
  <div className="og-stack og-sticky">
    <Card variant="surface" padding={5} style={{ paddingInline: 'var(--bui-spacing-6)' }}>
      <div className="og-stack">
        {(
          <div className="og-stack">
            <div className="og-pricerow">
              <p className="og-price og-price--lg">{money(unit)}</p>
              <CashbackTag size="lg" label={`Cashback ${CASHBACK}%`} />
            </div>
          </div>
        )}
        <ul className="og-facts" data-test-id="offer-facts">
          <li><Icon name="Clock" size={20} /><span><b>15 minutes</b> average start time</span></li>
          <li><Icon name="Clock" size={20} /><span><b>3 hours 15 minutes</b> order completion</span></li>
        </ul>
        <div className="og-stack">
          <Button variant={mobile ? 'secondary' : 'primary'} size="lg" width="100%" label="Add to cart" icon={<Icon name="ShoppingCart01" size={24} />} onClick={add} />
          <div className="og-offer-pay"><PaymentLogos items={PAY_OFFER} /></div>
          <p className="og-guarantee" data-test-id="offer-guarantee"><Icon name="ShieldTick" size={20} />100% moneyback guarantee</p>
        </div>
      </div>
    </Card>
    <Card variant="surface" padding={5} style={{ paddingInline: 'var(--bui-spacing-6)' }}>
      <div className="og-stack og-stack--lg">
        <ul className="og-trust">
          {TRUST.map(([icon, t, d]) => (
            <li key={t}><Icon name={icon} size={24} /><div className="og-stack og-stack--pair"><p className="og-trust__title">{t}</p><p className="og-meta">{d}</p></div></li>
          ))}
        </ul>
      </div>
    </Card>
  </div>
  );
  // on a desktop the head stands in the left column, so the right one starts level with the breadcrumbs; on a phone it is the first block of the page
  const head = (
    <PageHead crumbs={[{ label: 'Home', href: '#/' }, { label: game.name, href: `#/games/${game.slug}` }, { label: service.label, href: `#/games/wow?s=${service.id}` }, { label: offer.title }]} title={offer.title} mediaTop media={<div className="og-art og-art--square" role="img" aria-label={offer.title}>{offer.image ? <img className="og-art__img" src={offer.image} alt="" /> : <Icon name="Image01" size={32} />}</div>}>
        <div className="og-row og-offer-meta">
          <Stars value={offer.rating} reviews={offer.reviews} size="md" />
          <span className="og-dot" aria-hidden="true">·</span>
          <span className="og-rate__text og-rate__text--md"><span className="og-rate__count">{`${sold(offer.sold)} sold`}</span></span>
          <span className="og-dot" aria-hidden="true">·</span>
          <WishButton id={offer.id} text />
        </div>
    </PageHead>
  );
  return (
    <Page crumbs>
      {mobile && head}
        <div className="og-split og-split--right">
          <div className="og-stack og-stack--xl">
            <div className="og-stack">
            {!mobile && head}
            {mobile ? <Bleed scroll>{usp}</Bleed> : usp}
            <Card variant="surface" padding={5}>
              <div className="og-stack og-stack--lg og-offerform">
                <TokenGroup title="Region" options={REGIONS} value={[region]} onValueChange={(v) => v[0] && setRegion(v[0])} />
                <Selector label="Loot options" labelPlacement="outside" placeholder="Choose" options={LOOT} value={loot} onValueChange={setLoot} />
                <TokenGroup title="Number of bosses" options={BOSSES.map((d) => ({ value: d.value, label: <>{d.label} <span className="og-pill__price">{money(offer.price * d.k)}</span></> }))} value={[bosses]} onValueChange={(v) => v[0] && setBosses(v[0])} />
                <TokenGroup title="Boost method" options={MODES.map((m) => ({ value: m.value, label: <>{m.label}{m.note && <> <span className="og-pill__price">{m.note}</span></>}</> }))} value={[mode]} onValueChange={(v) => v[0] && setMode(v[0])} />
                <CheckboxGroup title="Additional options" value={extras} onValueChange={setExtras} options={EXTRAS.map((e) => ({ value: e.value, label: <span className="og-extra"><span>{e.label}</span>{e.was ? <span className="og-extra__price"><s>{money(e.was)}</s> <b>{money(e.price)}</b></span> : <span className="og-extra__price">{`+${money(e.price)}`}</span>}</span> }))} />
                <div className="og-stack og-stack--tight" data-test-id="offer-slot">
                  <TokenGroup title="Select raid slot" caption="8 spots left in this run">
                    {DAYS.map((d) => <Token key={d.value} pressed={!date && day === d.value} onPressedChange={() => { setDay(d.value); setDate(null); }}>{d.label}</Token>)}
                    <DatePicker appearance="token" label="Choose date" value={date} onValueChange={setDate} />
                  </TokenGroup>
                  <TokenGroup options={TIMES} value={[time]} onValueChange={(v) => v[0] && setTime(v[0])} />
                </div>
                <div className="og-slothelp"><p className="og-text">Can't find a time that works for you? Send us a message and we'll find one that does</p><Button variant="primary" size="sm" label="Chat" /></div>
              </div>
            </Card>
            {mobile && aside}
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
                <ul className="og-trust og-trust--cols">
                  {WHY.map(([img, t, d]) => (
                    <li key={t}><img src={`./assets/why/${img}.svg`} alt="" width="32" height="32" /><div className="og-stack og-stack--pair"><p className="og-trust__title">{t}</p><p className="og-meta">{d}</p></div></li>
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
                  <p className="og-text">If you can't find what you need, let's customize! Click to create your perfect offer now</p>
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
          {!mobile && aside}
        </div>
      {related.length > 0 && (
        <Section title="You may also like">
          <div data-test-id="offer-more">
            <OfferListing offers={related} rows={2} more="infinite" />
          </div>
        </Section>
      )}
      {mobile && <PayBar amount={unit} action="Add to cart" onClick={add} />}
    </Page>
  );
}
