// The cart and the checkout, as on Overgear: a side panel of the cart on a desktop (a page on a phone), and a checkout of its own
// (no header and no footer of the shop): the order on the left, the payment method, the summary on the right.
import { useState, useEffect } from '../../src/react.js';
import { Button, IconButton } from '../../src/components/Button.jsx';
import { Card } from '../../src/components/Card.jsx';
import { TextInput } from '../../src/components/TextInput.jsx';
import { RadioGroup } from '../../src/components/RadioGroup.jsx';
import { Collapsible } from '../../src/components/Collapsible.jsx';
import { Tooltip } from '../../src/components/Tooltip.jsx';
import { Status } from '../../src/components/Status.jsx';
import { Divider } from '../../src/components/Divider.jsx';
import { Navbar } from '../../src/components/MobileNavigation.jsx';
import { ControlRow } from '../../src/components/Layout.jsx';
import { Link } from '../../src/components/Link.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { useToast } from '../../src/components/Toast.jsx';
import { go, href, useMedia } from './util.js';
import { money } from './data.js';
import { Page, PageHead, PaymentLogos, PAY_BADGES, CashbackMark, CASHBACK, cashbackOf } from './ui.jsx';
import { useStore } from './store.jsx';

const LOGO_FULL = 'https://overgear.com/images/overgear-logo-full.svg';
const plural = (n) => `${n} item${n === 1 ? '' : 's'}`;

/** A line of the order: the picture, the name and the price, what it is, who sells it and when it comes. */
function CartLine({ item, onRemove }) {
  return (
    <li className="og-line">
      <div className="og-line__pic">{item.image ? <img src={item.image} alt="" /> : <Icon name="Image01" size={24} />}</div>
      <div className="og-line__body">
        <div className="og-line__head">
          <span className="og-line__title">{item.title}</span>
          <span className="og-line__price">{money(item.price * item.qty)}</span>
        </div>
        <p className="og-line__meta">{item.qty > 1 ? `${item.sub} · × ${item.qty}` : item.sub}</p>
        <p className="og-line__meta"><Icon name="User01" size={16} />Sold by Overgear</p>
        {item.eta && <p className="og-line__meta"><Icon name="Clock" size={16} />{`Delivery time: ${item.eta}`}</p>}
      </div>
      {onRemove && <IconButton variant="ghost" size="xsm" label={`Remove ${item.title}`} icon={<Icon name="Trash01" size={20} />} onClick={onRemove} />}
    </li>
  );
}

/** The promo code: a section that opens into a field. */
function Promo() {
  const store = useStore();
  const [code, setCode] = useState(store.promo);
  const [bad, setBad] = useState(false);
  const apply = () => { const ok = code.trim().toUpperCase() === 'WELCOME10'; setBad(!ok && !!code); store.setPromo(ok ? 'WELCOME10' : ''); };
  return (
    <Collapsible title="Apply promo code" defaultOpen={!!store.promo}>
      <ControlRow size="md" align="start">
        <TextInput label="Promo code" value={code} onChange={(e) => setCode(e.target.value)} status={bad ? 'error' : undefined} caption={bad ? 'This code does not work' : store.promo ? 'Applied: 10% off' : 'Try WELCOME10'} />
        <Button variant="secondary" label="Apply" onClick={apply} />
      </ControlRow>
    </Collapsible>
  );
}

/** The cashback line: what the order gives back in OG Coins, with a hint. */
function CashbackRow({ amount }) {
  return (
    <div className="og-sum__row og-sum__row--soft">
      <span className="og-sum__label">
        Cashback you will receive
        <Tooltip content="Cashback is credited to your balance in OG Coins after the order is completed"><span className="og-sum__hint" tabIndex={0}><Icon name="HelpCircle" size={16} /></span></Tooltip>
      </span>
      <span className="og-sum__value og-sum__coins">{cashbackOf(amount)}<CashbackMark /></span>
    </div>
  );
}

/** The summary of the cart: the sum, the promo code, the subtotal, the cashback and the button to the checkout. */
function CartSummary({ onCheckout }) {
  const store = useStore();
  return (
    <div className="og-stack og-stack--lg">
      <div className="og-stack">
        {store.discount > 0 && <div className="og-sum__row"><span className="og-sum__label">Promo WELCOME10</span><span className="og-sum__value">{`−${money(store.discount)}`}</span></div>}
        <Promo />
        <div className="og-sum__row og-sum__row--big"><span>Subtotal</span><span>{money(store.total)}</span></div>
        <CashbackRow amount={store.total} />
      </div>
      <Button variant="primary" size="lg" width="100%" label="Secure checkout" onClick={onCheckout} />
    </div>
  );
}

const EmptyCart = ({ onBrowse }) => (
  <Status status="neutral" icon={<Icon name="ShoppingCart01" size={28} />} title="Your cart is empty" description="Pick a game and add a service to start" actionLabel="Browse games" onAction={onBrowse} />
);

/** The cart as a side panel (a desktop): a scrim, the lines, and the summary at the bottom. */
export function CartDrawer({ open, onClose }) {
  const store = useStore();
  useEffect(() => {
    if (!open) return undefined;
    const key = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', key);
    const was = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = was; };
  }, [open]);
  if (!open) return null;
  return (
    <>
      <div className="og-scrim" onClick={onClose} aria-hidden="true" />
      <aside className="og-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div className="og-drawer__head">
          <h2 className="og-h3">Shopping Cart <span className="og-h3__count">{store.count}</span></h2>
          <IconButton variant="ghost" size="sm" label="Close the cart" icon={<Icon name="XClose" size={24} />} onClick={onClose} />
        </div>
        {store.cart.length ? (
          <>
            <ul className="og-lines og-lines--cards og-drawer__body" aria-label="Cart items">
              {store.cart.map((i) => <CartLine key={i.key} item={i} onRemove={() => store.remove(i.key)} />)}
            </ul>
            <div className="og-drawer__foot"><CartSummary onCheckout={() => { onClose(); go('/checkout'); }} /></div>
          </>
        ) : (
          <div className="og-drawer__body"><EmptyCart onBrowse={() => { onClose(); go('/catalog'); }} /></div>
        )}
      </aside>
    </>
  );
}

/** The cart as a page (a phone, or a direct link). */
export function Cart() {
  const store = useStore();
  if (!store.cart.length) return <Page fill><EmptyCart onBrowse={() => go('/catalog')} /></Page>;
  return (
    <Page>
      <PageHead title="Shopping Cart" meta={plural(store.count)} />
      <div className="og-split og-split--right">
        <Card variant="surface" padding={5}>
          <ul className="og-lines" aria-label="Cart items">
            {store.cart.map((i) => <CartLine key={i.key} item={i} onRemove={() => store.remove(i.key)} />)}
          </ul>
        </Card>
        <Card variant="surface" padding={5}><div className="og-sticky"><CartSummary onCheckout={() => go('/checkout')} /></div></Card>
      </div>
    </Page>
  );
}

const TILE = (children) => <span className="og-method__tile">{children}</span>;
const METHODS = [
  { id: 'card', name: 'Card', fee: 1.47, tile: TILE(<Icon name="CreditCard01" size={24} />) },
  { id: 'apple', name: 'Apple Pay', fee: 0.95, tile: TILE(<img src="./assets/payments/apple-pay.svg" alt="" />) },
  { id: 'google', name: 'Google Pay', fee: 0.95, tile: TILE(<img src="./assets/payments/google-pay.svg" alt="" />) },
  { id: 'klarna', name: 'Klarna', fee: 1.4, tile: TILE(<b>K</b>) },
  { id: 'neteller', name: 'Neteller', fee: 2.65, tile: TILE(<b>N</b>) },
];
const MORE_METHODS = [
  { id: 'paypal', name: 'PayPal', fee: 2.1, tile: TILE(<img src="./assets/payments/paypal.svg" alt="" />) },
  { id: 'crypto', name: 'Cryptocurrency', fee: 0, tile: TILE(<Icon name="Coins01" size={24} />) },
  { id: 'balance', name: 'Account balance', fee: 0, tile: TILE(<Icon name="Wallet01" size={24} />) },
];
const methodLabel = (m) => (
  <span className="og-method">
    {m.tile}
    <span className="og-stack og-stack--hair"><b className="og-method__name">{m.name}</b><span className="og-meta">{m.fee ? `+${money(m.fee)} service fee` : 'No service fee'}</span></span>
  </span>
);

/** The checkout: the order, the payment method and the summary; it has a slim top bar of its own and no footer of the shop. */
export function Checkout() {
  const store = useStore();
  const { toast } = useToast();
  const [method, setMethod] = useState('card');
  const [more, setMore] = useState(false);
  const [email, setEmail] = useState(store.user?.email || '');
  const [tried, setTried] = useState(false);
  const mobile = useMedia('(max-width: 767px)');
  const all = more ? [...METHODS, ...MORE_METHODS] : METHODS;
  const fee = [...METHODS, ...MORE_METHODS].find((m) => m.id === method)?.fee ?? 0;
  const amount = +(store.total + fee).toFixed(2);
  const badEmail = !store.user && !email.includes('@');
  const pay = () => {
    setTried(true);
    if (badEmail) return;
    const order = store.placeOrder({ email: store.user?.email || email, method, total: amount });
    toast({ message: 'Payment received', status: 'success' });
    go(`/order/${order.id}`);
  };
  return (
    <div className="og-checkout">
      {mobile ? (
        <Navbar title="Checkout" onBack={() => window.history.back()} />
      ) : (
        <>
          <div className="og-wrap">
            <a className="og-checkout__logo" href={href('/')} aria-label="Overgear"><img src={LOGO_FULL} alt="" width="145" height="32" /></a>
          </div>
          <div className="og-checkout__bar">
            <div className="og-wrap og-checkout__bar-in">
              <IconButton variant="secondary" size="sm" label="Back" icon={<Icon name="ChevronLeft" size={20} />} onClick={() => window.history.back()} />
              <h1 className="og-title">Secure Checkout</h1>
            </div>
          </div>
        </>
      )}
      <div className="og-wrap">
        {!store.cart.length ? (
          <Page><Status status="neutral" title="Nothing to pay for" description="Your cart is empty" actionLabel="Browse games" onAction={() => go('/catalog')} /></Page>
        ) : (
          <div className="og-co">
            <div className="og-stack og-stack--xl">
              <div className="og-stack">
                <h2 className="og-h2">Review order <span className="og-meta">{`(${plural(store.count)})`}</span></h2>
                <Card variant="surface" padding={4}><ul className="og-lines" aria-label="Order items">{store.cart.map((i) => <CartLine key={i.key} item={i} onRemove={() => store.remove(i.key)} />)}</ul></Card>
                {!store.user && <TextInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} status={tried && badEmail ? 'error' : undefined} caption={tried && badEmail ? 'Enter an email we can send the receipt to' : 'The receipt and the order chat link come here'} />}
              </div>
              <div className="og-stack">
                <h2 className="og-h2">Payment method</h2>
                <Card variant="surface" padding={2}>
                  <RadioGroup value={method} onValueChange={setMethod} options={all.map((m) => ({ value: m.id, label: methodLabel(m) }))} />
                  <Button variant="ghost" width="100%" label={more ? 'Show fewer payment methods' : 'Show other payment methods'} icon={<Icon name={more ? 'ArrowUp' : 'ArrowDown'} size={20} />} onClick={() => setMore((v) => !v)} />
                </Card>
                <Card variant="surface" padding={2}><Promo /></Card>
              </div>
            </div>
            <div className="og-stack og-sticky">
              <h2 className="og-h2">Order summary</h2>
              <Card variant="surface" padding={5}>
                <div className="og-stack og-stack--lg">
                  <div className="og-stack">
                    <div className="og-sum__row"><span className="og-sum__label">Item(s)</span><span className="og-sum__value">{money(store.subtotal)}</span></div>
                    {store.discount > 0 && <div className="og-sum__row"><span className="og-sum__label">Promo WELCOME10</span><span className="og-sum__value">{`−${money(store.discount)}`}</span></div>}
                    <div className="og-sum__row"><span className="og-sum__label">Payment fee</span><span className="og-sum__value">{money(fee)}</span></div>
                  </div>
                  <Divider />
                  <div className="og-stack">
                    <div className="og-sum__row og-sum__row--big"><span>Amount to pay</span><span>{money(amount)}</span></div>
                    <CashbackRow amount={amount} />
                  </div>
                  <Button variant="primary" size="lg" width="100%" label="Pay" onClick={pay} />
                  <p className="og-caption">By placing an order at overgear.com, you agree to our <Link href={href('/info/terms')}>Terms of Use</Link> and <Link href={href('/info/privacy')}>Privacy Policy</Link>. After your purchase, we may email you offers about products and services similar to your order.</p>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
      <div className="og-checkout__foot">
        <div className="og-wrap og-row og-row--between">
          <p className="og-caption og-caption--dim">This payment will show on your account as OVERGEAR LIMITED. Diagorou 4, Kermia Building, 3rd floor, Nicosia, Cyprus. Reg. number: HE395043</p>
          <PaymentLogos items={PAY_BADGES} label="Security badges" />
        </div>
      </div>
    </div>
  );
}

export function OrderDone({ id }) {
  const store = useStore();
  const order = store.orders.find((o) => o.id === id);
  if (!order) return <Page><Status status="neutral" title="Order not found" actionLabel="My orders" onAction={() => go('/account?tab=orders')} /></Page>;
  return (
    <Page>
      <Status status="success" title={`Thank you! Order ${order.id} is paid`} description="A booster will start within the hour. You can follow it in the order chat" actionLabel="My orders" onAction={() => go('/account?tab=orders')} />
      <Card variant="surface" padding={5}>
        <div className="og-stack">
          <h2 className="og-h3">What you bought</h2>
          <ul className="og-bullets">{order.items.map((i) => <li key={i.title}>{`${i.qty} × ${i.title}, ${money(i.price * i.qty)}`}</li>)}</ul>
          <Divider />
          <div className="og-row og-row--between"><strong className="og-text">Total</strong><strong className="og-price">{money(order.total)}</strong></div>
        </div>
      </Card>
    </Page>
  );
}
