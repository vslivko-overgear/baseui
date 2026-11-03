// The cart and the checkout, as on Overgear: a side panel of the cart on a desktop (a page on a phone), and a checkout of its own
// (no header and no footer of the shop): the order on the left, the payment method, the summary on the right.
import { useState, useEffect } from '../../src/react.js';
import { usePresence } from '../../src/theme-flags.js';
import { Button, IconButton } from '../../src/components/Button.jsx';
import { Card } from '../../src/components/Card.jsx';
import { TextInput } from '../../src/components/TextInput.jsx';
import { Status } from '../../src/components/Status.jsx';
import { Divider } from '../../src/components/Divider.jsx';
import { Navbar } from '../../src/components/MobileNavigation.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { go, href, useMedia, useTitleUnderBar } from './util.js';
import { OrderHead, ItemLines, OrderSummary, PayBar, PayBarContent, PromoCard } from './order.jsx';
import { Dialog } from '../../src/components/Dialog.jsx';
import { money } from './data.js';
import { ordersFromCart, outcomeOf } from './order-core.js';
import { deliveryFor } from './order-seed.js';
import { Page, PaymentLogos, PAY_BADGES, cashbackOf } from './ui.jsx';
import { useStore } from './store.jsx';

const LOGO_FULL = 'https://overgear.com/images/overgear-logo-full.svg';

const EmptyCart = ({ onBrowse }) => (
  <Status status="neutral" icon={<Icon name="ShoppingCart01" size={28} />} title="Your cart is empty" description="Pick a game and add a service to start" actionLabel="Browse games" onAction={onBrowse} />
);

/** The mini-cart: a side panel on a desktop, the standard dialog (a sheet) on a phone. The lines and the promo code card scroll; the pay bar (the price, the bonus, the button) is pinned at the bottom. */
export function CartDrawer({ open, onClose }) {
  const store = useStore();
  const mobile = useMedia('(max-width: 767px)');
  const checkout = () => { onClose(); go('/checkout'); };
  const [shown, closing] = usePresence(open, 280);   // the panel stays mounted while it slides out
  useEffect(() => {
    if (!open || mobile) return undefined;
    const key = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', key);
    const was = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = was; };
  }, [open, mobile]);
  const body = store.cart.length ? <div className="og-stack"><ItemLines /><PromoCard /></div> : <EmptyCart onBrowse={() => { onClose(); go('/catalog'); }} />;
  if (mobile) {
    return (
      <Dialog open={open} onOpenChange={(o) => !o && onClose()} title={`Shopping Cart · ${store.count}`} className="og-minicart" primaryAction={store.cart.length ? <PayBarContent amount={store.total} action="Secure checkout" onClick={checkout} /> : undefined}>
        {body}
      </Dialog>
    );
  }
  if (!shown) return null;
  return (
    <>
      <div className="og-scrim" data-closing={closing || undefined} onClick={onClose} aria-hidden="true" />
      <aside className="og-drawer" data-closing={closing || undefined} role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div className="og-drawer__head">
          <h2 className="og-h3">Shopping Cart <span className="og-h3__count">{store.count}</span></h2>
          <IconButton variant="ghost" size="sm" label="Close the cart" icon={<Icon name="XClose" size={24} />} onClick={onClose} />
        </div>
        {store.cart.length ? (
          <>
            <div className="og-drawer__body og-stack"><ItemLines /><PromoCard /></div>
            <div className="og-drawer__foot"><PayBar inline amount={store.total} action="Secure checkout" onClick={checkout} /></div>
          </>
        ) : (
          <div className="og-drawer__body">{body}</div>
        )}
      </aside>
    </>
  );
}

/** The cart as a page (a phone, or a direct link). */
export function Cart() {
  const store = useStore();
  const mobile = useMedia('(max-width: 767px)');
  if (!store.cart.length) return <Page fill><EmptyCart onBrowse={() => go('/catalog')} /></Page>;
  return (
    <Page>
      <div>
        <OrderHead title="Shopping Cart" count={store.count} />
        <div className="og-co">
          <ItemLines />
          <div className="og-stack og-sticky"><OrderSummary label="Subtotal" amount={store.total} action="Secure checkout" onAction={() => go('/checkout')} pinned={mobile} /></div>
        </div>
      </div>
      {mobile && <PayBar above amount={store.total} action="Secure checkout" onClick={() => go('/checkout')} />}
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
  { id: 'paypal', name: 'PayPal', fee: 2.1, tile: TILE(<img src="./assets/payments/paypal.svg" alt="" />) },
];
const MORE_METHODS = [
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
/** The payment methods as tiles in a grid: each is a radio in an outline, the chosen one with a 2px outline in the selected color and the others with the standard one. */
function MethodTiles({ value, onChange, methods }) {
  return (
    <div className="og-methods" role="radiogroup" aria-label="Payment method">
      {methods.map((m) => (
        <label key={m.id} className="og-methodcard" data-checked={value === m.id || undefined}>
          <input type="radio" name="og-method" value={m.id} checked={value === m.id} onChange={() => onChange(m.id)} />
          {methodLabel(m)}
        </label>
      ))}
    </div>
  );
}

export function Checkout() {
  const store = useStore();
  const [method, setMethod] = useState('card');
  const [more, setMore] = useState(false)
  const scrolled = useTitleUnderBar('.og-order__title');   // the bar shows the title only once the heading of the page has scrolled under it

  const [email, setEmail] = useState(store.user?.email || '');
  const [tried, setTried] = useState(false);
  const mobile = useMedia('(max-width: 767px)');
  const fee = [...METHODS, ...MORE_METHODS].find((m) => m.id === method)?.fee ?? 0;
  const amount = +(store.total + fee).toFixed(2);
  const badEmail = !store.user && !email.includes('@');
  const pay = () => {
    setTried(true);
    if (badEmail) return;
    // the payment method decides what the provider answers (outcomeOf): paid, to be verified, or declined
    const outcome = outcomeOf(method);
    const info = { email: store.user?.email || email, cashback: +cashbackOf(amount) };
    if (outcome === 'error') { go('/checkout/result/error'); return; }
    const orders = ordersFromCart(store.cart, { now: Date.now(), seed: Math.floor(Math.random() * 1e6), method, fee, discountRate: store.subtotal ? store.discount / store.subtotal : 0, email: info.email, delivery: (line) => deliveryFor(/gold/i.test(line.title) ? 'currency' : 'service') });
    const next = (orders.length === 1 ? `?orderLink=${orders[0].link}` : '');
    if (outcome === 'check') {
      const id = `tx${Date.now()}`;
      store.setPending({ id, orders, info, createdAt: Date.now() });
      go(`/checkout/result/check?transaction=${id}`);
      return;
    }
    store.placeOrders(orders, info);
    go(`/checkout/result/success${next}`);
  };
  return (
    <div className="og-checkout">
      {mobile ? (
        <Navbar title="Secure Checkout" titleVisible={scrolled} onBack={() => window.history.back()} />
      ) : (
        <>
          <div className="og-wrap og-checkout__top">
            <IconButton variant="secondary" size="sm" label="Back" icon={<Icon name="ChevronLeft" size={20} />} onClick={() => window.history.back()} />
            <a className="og-checkout__logo" href={href('/')} aria-label="Overgear"><img src={LOGO_FULL} alt="" width="145" height="32" /></a>
          </div>
          <Divider />
        </>
      )}
      <div className="og-wrap og-checkout__main">
        <OrderHead title="Secure Checkout" count={store.cart.length ? store.count : 0} className="og-checkout__head" />
        {!store.cart.length ? (
          <Page><Status status="neutral" title="Nothing to pay for" description="Your cart is empty" actionLabel="Browse games" onAction={() => go('/catalog')} /></Page>
        ) : (
          <div className="og-co">
            <div className="og-stack og-stack--xl og-co__main">
              <div className="og-stack">
                <ItemLines />
                {!store.user && <TextInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} status={tried && badEmail ? 'error' : undefined} caption={tried && badEmail ? 'Enter an email we can send the receipt to' : 'The receipt and the order chat link come here'} />}
              </div>
              <div className="og-stack og-co__pay">
                <h2 className="og-h2">Payment method</h2>
                <MethodTiles value={method} onChange={setMethod} methods={more ? [...METHODS, ...MORE_METHODS] : METHODS} />
                <Button variant="secondary" width="100%" label={more ? 'Show fewer payment methods' : 'Show other payment methods'} icon={<Icon name={more ? 'ArrowUp' : 'ArrowDown'} size={20} />} onClick={() => setMore((v) => !v)} />
              </div>
            </div>
            <div className="og-stack og-sticky">
              <OrderSummary fee={fee} amount={amount} action="Pay" onAction={pay} pinned={mobile} terms />
            </div>
          </div>
        )}
        {mobile && !!store.cart.length && <PayBar amount={amount} action="Pay" onClick={pay} />}
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
