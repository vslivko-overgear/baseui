// The result of a payment, as the real service shows it (/checkout/result/:result): a standalone page with its own slim header and one dialog-like block: the status, its words and its buttons.
//   success   one paid order opens its own page at once (?orderLink=), several orders say "Orders are Placed" and lead to the list; a buyer who has not joined the Discord server is asked to, first
//   check     the payment provider has not answered: the page waits (it asks every 3 seconds, with no end) and goes on to success when the payment settles
//   error / warning   the payment did not go through: try again, or back to the shop
// The words and the rules are in order-core.js (resultView); this file draws them.
import { useEffect, useRef } from '../../src/react.js';
import { Button } from '../../src/components/Button.jsx';
import { ButtonGroup } from '../../src/components/ButtonGroup.jsx';
import { Banner } from '../../src/components/Banner.jsx';
import { Spinner } from '../../src/components/Spinner.jsx';
import { Status } from '../../src/components/Status.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { useToast } from '../../src/components/Toast.jsx';
import { go, goReplace, href } from './util.js';
import { useStore } from './store.jsx';
import { resultView, POLL_MS } from './order-core.js';

const LOGO_FULL = 'https://overgear.com/images/overgear-logo-full.svg';
const ICONS = { success: 'CheckCircle', error: 'XCircle', warning: 'AlertTriangle', check: 'Clock' };
const TONE = { success: 'success', error: 'error', warning: 'error', check: 'warning' };
/** A payment under verification settles after this long in the example (the real provider answers when it does). */
const SETTLE_MS = POLL_MS * 2;


export function CheckoutResult({ result, orderLink, transaction }) {
  const store = useStore();
  const { toast } = useToast();
  const settled = useRef(false);
  const view = resultView(result, { single: !!orderLink, joinedDiscord: store.discord });

  // one paid order is shown on its own page, whatever the status of the result (the real page does it with a replace)
  useEffect(() => {
    if (!orderLink) return;
    const order = store.orders.find((o) => o.link === orderLink);
    if (order) goReplace(`/order/${orderLink}`);
  }, [orderLink]);

  // a payment that waits for its provider: ask every 3 seconds; when it settles, the orders are made and the page goes on to success
  useEffect(() => {
    if (result !== 'check') return undefined;
    const tick = () => {
      const pending = store.pending;
      if (!pending || (transaction && pending.id !== transaction) || settled.current) return;
      if (Date.now() - pending.createdAt >= SETTLE_MS) {
        settled.current = true;
        store.settlePending();
        goReplace(pending.orders.length === 1 ? `/checkout/result/success?orderLink=${pending.orders[0].link}` : '/checkout/result/success');
      }
    };
    const id = setInterval(tick, POLL_MS);
    tick();
    return () => clearInterval(id);
  }, [result, transaction, store.pending]);

  if (!view) return <ResultShell><Status status="neutral" title="Page not found" actionLabel="Home" onAction={() => go('/')} /></ResultShell>;

  const act = {
    view: () => go(orderLink ? `/order/${orderLink}` : '/orders'),
    discord: () => { store.joinDiscord(); toast({ message: 'You joined the Discord server (a demo: nothing was opened)', status: 'success' }); },
    again: () => go('/checkout'),
    home: () => go('/'),
  };
  const buttons = view.buttons.length ? (
    <ButtonGroup orientation="horizontal" stackOnMobile justify="center">
      {view.buttons.map((b) => <Button key={b.id} variant={b.variant} size="lg" label={b.label} icon={b.external ? <Icon name="LinkExternal01" size={20} /> : undefined} onClick={act[b.id]} />)}
    </ButtonGroup>
  ) : undefined;

  return (
    <ResultShell>
      <div className="og-result__block" data-test-id="checkout-result" data-result={result} data-discord={view.buttons.some((b) => b.id === 'discord') || undefined}>
        <Status
          status={TONE[result]}
          icon={result === 'check' ? <span className="og-result__spin"><Icon name="Clock" size={28} /><Spinner size={56} aria-label="Verifying the payment" /></span> : <Icon name={ICONS[result]} size={28} />}
          title={<><span className={`og-result__overline og-result__overline--${TONE[result]}`}>{view.overline}</span>{view.title}</>}
          description={view.text}
          action={buttons}
        />
        {view.note && <Banner status="success">{view.note}</Banner>}
      </div>
    </ResultShell>
  );
}

/** The standalone chrome of the result pages: the logo and "Contact Support", and the block in the middle. */
function ResultShell({ children }) {
  const { toast } = useToast();
  return (
    <div className="og-result" data-test-id="checkout-result-page">
      <div className="og-result__top og-wrap">
        <a href={href('/')} aria-label="Overgear"><img src={LOGO_FULL} alt="" width="145" height="32" /></a>
        <Button variant="ghost" label="Contact Support" icon={<Icon name="MessageChatCircle" size={20} />} onClick={() => toast({ message: 'The support chat opens here' })} />
      </div>
      <div className="og-result__main">{children}</div>
    </div>
  );
}
