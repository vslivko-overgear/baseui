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
import { useAddedToCart, Page, PageHead, Section, OfferListing, Stars, WishButton, CashbackTag, CASHBACK } from './ui.jsx';
import { useStore } from './store.jsx';
import { Faq } from './games.jsx';

const MODES = [{ value: 'piloted', label: 'Piloted' }, { value: 'self', label: 'Self-play' }, { value: 'remote', label: 'Remote control' }];
const EXTRAS = [{ value: 'express', label: 'Express start, +$12', price: 12 }, { value: 'stream', label: 'Live stream, +$8', price: 8 }, { value: 'loot', label: 'Priority loot, +$20', price: 20 }];
const TRUST = [
  ['ShieldTick', '100% moneyback guarantee', 'The money is held until you confirm the result'],
  ['UserCheck01', 'ID-verified pros', 'Every player passes our selection and checks'],
  ['Lock01', 'Secure payment', 'Cards and wallets are processed by certified providers'],
  ['LifeBuoy01', '24/7 support', 'A human answers in the order chat at any hour'],
];
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
  const related = OFFERS.filter((o) => o.service === offer.service && o.id !== offer.id).slice(0, 3);
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
          <Card variant="surface" padding={5}>
            <div className="og-stack og-stack--lg">
                <SegmentedControl label="Difficulty" fullWidth size="sm" value={difficulty} onValueChange={setDifficulty} items={DIFFICULTY.map((d) => ({ value: d.value, label: d.label }))} />
                <RadioGroup title="How it is played" value={mode} onValueChange={setMode} options={MODES} />
                <CheckboxGroup title="Extras" value={extras} onValueChange={setExtras} options={EXTRAS.map((e) => ({ value: e.value, label: e.label }))} />
                <NumberInput label="Quantity" min={1} max={10} value={qty} onValueChange={(v) => setQty(v ?? 1)} />
                <TextInput label="Note for the booster" multiline minRows={2} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
          </Card>
          <div className="og-stack og-stack--xl og-offer-info">
            <Section title="About this offer">
              <ul className="og-bullets">{offer.bullets.map((b) => <li key={b}><Icon name="Check" size={16} />{b}</li>)}</ul>
              <p className="og-text">A verified booster completes the content on your character. You can follow the progress in the order chat, and the money is released only when you confirm the result</p>
            </Section>
            <Section title="Requirements">
              <ul className="og-bullets"><li><Icon name="Check" size={16} />An active game subscription</li><li><Icon name="Check" size={16} />A character at the required level</li><li><Icon name="Check" size={16} />Two-factor authentication is fine: we use a safe handover</li></ul>
            </Section>
            <Section title={<>Reviews <span className="og-count">{REVIEWS.length}</span></>}>
              <List aria-label="Reviews" className="og-reviews">{REVIEWS.slice(0, 4).map(([n, t]) => <ListItem key={n} avatar={<Avatar alt={n} />} subtitle={t}>{n}</ListItem>)}</List>
            </Section>
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
              <div className="og-stack">
                <Button variant="primary" size="lg" width="100%" label="Add to cart" icon={<Icon name="ShoppingCart01" size={24} />} onClick={add} />
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
      {related.length > 0 && <Section title="Similar offers"><OfferListing offers={related} /></Section>}
      <Section title="Questions"><Faq /></Section>
    </Page>
  );
}
