// The parts of an order that the checkout, the cart (a page) and the mini-cart (the side panel) have in common. The checkout is the latest base: a change of a line, of the
// summary, of the promo code or of the pay bar is made here, once, and the three follow. overgear/tools/check/order.mjs checks that they do.
import { useState } from '../../src/react.js';
import { Button, IconButton } from '../../src/components/Button.jsx';
import { Card } from '../../src/components/Card.jsx';
import { NumberInput } from '../../src/components/NumberInput.jsx';
import { TextInput } from '../../src/components/TextInput.jsx';
import { Dialog } from '../../src/components/Dialog.jsx';
import { List, ListItem } from '../../src/components/List.jsx';
import { Hint } from '../../src/components/Hint.jsx';
import { Divider } from '../../src/components/Divider.jsx';
import { Link } from '../../src/components/Link.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { useToast } from '../../src/components/Toast.jsx';
import { href } from './util.js';
import { money } from './data.js';
import { CashbackMark, CashbackTag, CASHBACK_HINT, cashbackOf } from './ui.jsx';
import { useStore } from './store.jsx';

export const plural = (n) => `${n} item${n === 1 ? '' : 's'}`;

/** A line of the order: the picture, the name and the price, what it is, who sells it and when it comes. */
function CartLine({ item, onRemove, onQty }) {
  const [multi] = useState(item.qty > 1);   // a line of several units keeps its stepper while it is on the screen, also at 1
  return (
    <li className="og-line">
      <div className="og-line__pic">{item.image ? <img src={item.image} alt="" /> : <Icon name="Image01" size={24} />}</div>
      <div className="og-line__body">
        <span className="og-line__title">{item.title}</span>
        <p className="og-line__meta">{item.qty > 1 ? `${item.sub} · × ${item.qty}` : item.sub}</p>
        <p className="og-line__meta"><Icon name="User01" size={16} />Sold by Overgear</p>
        {item.eta && <p className="og-line__meta"><Icon name="Clock" size={16} />{`Delivery time: ${item.eta}`}</p>}
        {multi && onQty && <span className="og-line__qty"><NumberInput size="sm" aria-label={`Quantity of ${item.title}`} min={1} value={item.qty} onValueChange={(v) => onQty(Math.max(1, Number(v) || 1))} /></span>}
      </div>
      <div className="og-line__side">
        <span className="og-line__price">{money(item.price * item.qty)}</span>
        {onRemove && <IconButton variant="ghost" size="xsm" label={`Remove ${item.title}`} icon={<Icon name="Trash01" size={20} />} onClick={onRemove} />}
      </div>
    </li>
  );
}

/** The promo code: a row of a list that opens a dialog with a field: the text on the left, a chevron on the right. With a code applied it is a row with the code on the right and a cross that takes it off. */
function Promo() {
  const store = useStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [bad, setBad] = useState(false);
  const show = () => { setCode(''); setBad(false); setOpen(true); };
  const apply = () => {
    const ok = code.trim().toUpperCase() === 'WELCOME10';
    setBad(!ok);
    if (!ok) { document.getElementById('og-promo-code')?.focus(); return; }
    store.setPromo('WELCOME10');
    setOpen(false);
    toast({ message: 'Promo code applied: 10% off', status: 'success' });
  };
  return (
    <>
      <List aria-label="Promo code">
        {store.promo ? (
          <ListItem details={<span className="og-row og-row--nowrap">{store.promo}<IconButton variant="ghost" size="xsm" label="Remove the promo code" icon={<Icon name="XClose" size={20} />} onClick={() => store.setPromo('')} /></span>}>Promo code</ListItem>
        ) : (
          <ListItem onClick={show} details={<Icon name="ChevronRight" size={20} />}>Apply promo code</ListItem>
        )}
      </List>
      <Dialog open={open} onOpenChange={setOpen} title="Promo code">
        <form className="og-stack og-stack--lg" noValidate onSubmit={(e) => { e.preventDefault(); apply(); }}>
          <TextInput id="og-promo-code" label="Promo code" autoComplete="off" value={code} onChange={(e) => { setCode(e.target.value); setBad(false); }} status={bad ? 'error' : undefined} caption={bad ? 'This code does not work' : 'Try WELCOME10'} />
          <Button variant="primary" size="lg" textSize={16} width="100%" type="submit" label="Apply" />
        </form>
      </Dialog>
    </>
  );
}

/** The cashback line: what the order gives back in OG Coins, with a hint. */
function CashbackRow({ amount }) {
  return (
    <div className="og-sum__row og-sum__row--soft">
      <span className="og-sum__label">
        Cashback you will receive
        <Hint label="About the cashback" content={CASHBACK_HINT} />
      </span>
      <span className="og-sum__value og-sum__coins">{cashbackOf(amount)}<CashbackMark /></span>
    </div>
  );
}

// the pay bar is a component of the sublibrary (overgear/components): it keeps the room it takes at the bottom of the page by itself
export { PayBar, PayBarContent } from '../components/paybar.jsx';

/** The title of an order page and, under it, how many items there are (secondary): the checkout and the cart have the same. */
export function OrderHead({ title, count, className = '' }) {
  return (
    <div className={`og-stack og-stack--close ${className}`}>
      <h1 className="og-title og-order__title">{title}</h1>
      {!!count && <p className="og-caption">{plural(count)}</p>}
    </div>
  );
}

/** The items of the order, each a card of its own, with its quantity and its bin. */
export function ItemLines({ className = '' }) {
  const store = useStore();
  return (
    <ul className={`og-lines og-lines--cards og-lines--surface ${className}`} aria-label="Order items">
      {store.cart.map((i) => <CartLine key={i.key} item={i} onRemove={() => store.remove(i.key)} onQty={(q) => store.setQty(i.key, q)} />)}
    </ul>
  );
}

/** The summary: the items, the promo discount, the fee (when the method is known), the amount, the cashback and the button (with the terms in the checkout), then the promo code row on a card under it. */
export function OrderSummary({ fee, label = 'Amount to pay', amount, action, onAction, pinned = false, terms = false }) {
  const store = useStore();
  return (
    <>
      <Card variant="surface" padding={5}>
        <div className="og-stack og-stack--lg">
          <div className="og-stack">
            <div className="og-sum__row"><span className="og-sum__label">Item(s)</span><span className="og-sum__value">{money(store.subtotal)}</span></div>
            {store.discount > 0 && <div className="og-sum__row og-sum__row--discount"><span className="og-sum__label">Promo WELCOME10</span><span className="og-sum__value">{`−${money(store.discount)}`}</span></div>}
            {fee !== undefined && <div className="og-sum__row"><span className="og-sum__label">Payment fee</span><span className="og-sum__value">{money(fee)}</span></div>}
          </div>
          <Divider />
          <div className="og-stack">
            <div className="og-sum__row og-sum__row--big"><span>{label}</span><span>{money(amount)}</span></div>
            <CashbackRow amount={amount} />
          </div>
          {(!pinned || terms) && (
            <div className="og-stack">
              {!pinned && <Button variant="primary" size="lg" width="100%" label={action} onClick={onAction} />}
              {terms && <p className="og-caption og-caption--legal">By placing an order at overgear.com, you agree to our <Link href={href('/info/terms')}>Terms of Use</Link> and <Link href={href('/info/privacy')}>Privacy Policy</Link>. After your purchase, we may email you offers about products and services similar to your order.</p>}
            </div>
          )}
        </div>
      </Card>
      <PromoCard />
    </>
  );
}

/** The promo code row on a card of its own. */
export function PromoCard() {
  return <Card variant="surface" padding={0} className="og-coupon"><Promo /></Card>;
}
