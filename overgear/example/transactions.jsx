// The page "Payment History" (/wallet/history): the transactions of the account, as in the real service (the profile, the tab of the payments): a filter of the direction, a switch that shows the transactions that are not
// completed, a table of the details, the status, the amount and the date (a list on a phone), pages of 20. The rules are in transactions-core.js.
import { useEffect, useMemo, useState } from '../../src/react.js';
import { Checkbox } from '../../src/components/Checkbox.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { Card } from '../../src/components/Card.jsx';
import { Badge } from '../../src/components/Badge.jsx';
import { Pagination } from '../../src/components/Pagination.jsx';
import { Selector } from '../../src/components/Selector.jsx';
import { Status } from '../../src/components/Status.jsx';
import { go, href } from './util.js';
import { gameOf } from './data.js';
import { Page, PageHead, CashbackMark } from './ui.jsx';
import { useStore } from './store.jsx';
import { DIRECTION_OPTIONS, STATE_LABEL, transactionsOf, filterTransactions, pagesOf, pageOf, titleOf, shownDirection, signOf, amountText, numberText, dateText } from './transactions-core.js';

/** The title of a row: a payment or a cashback for an order is a link to the order. */
function Title({ t }) {
  const text = titleOf(t);
  if (!t.orderLink) return <span className="og-tx__title">{text}</span>;
  return <a className="og-tx__title og-tx__link" href={href(`/order/${t.orderLink}`)} onClick={(e) => { e.preventDefault(); go(`/order/${t.orderLink}`); }} data-test-id={`transaction-order-link-${t.id}`}>{`${text} ${t.orderLink}`}</a>;
}

/** The amount, in the main color: the sign says the direction (a plus comes in, a minus goes out), the color does not shout it. Coins are the number and the mark of the coins, not the words. */
const Amount = ({ t }) => (
  <span className="og-tx__amount" data-direction={shownDirection(t)} aria-label={`${signOf(t)} ${amountText(t)}`.trim()}>
    {signOf(t) ? `${signOf(t)} ` : ''}{t.currency === 'COINS' ? <span className="og-cbtag">{numberText(t)}<CashbackMark /></span> : `$${numberText(t)}`}
  </span>
);

// the state is a colored tag, in its light version: green is done, yellow waits, red failed, the others are neutral or orange
const TAG = { completed: 'success', pending: 'warning', hold: 'warning', failed: 'error', cancelled: 'secondary', arbitrage: 'orange' };
const Status_ = ({ t }) => <Badge variant={TAG[t.state] || 'secondary'} light size="sm" label={STATE_LABEL[t.state] || t.state} data-state={t.state} />;

/** A transaction: a card of its own. On the left what it is (the title, what it was for, the date), on the right how much and the state. */
function Transaction({ t }) {
  return (
    <Card variant="surface" padding={4} data-test-id={`transaction-${t.id}`}>
      <div className="og-tx">
        <div className="og-tx__main">
          <Title t={t} />
          {t.description && <span className="og-tx__sub">{t.description}</span>}
          <span className="og-tx__sub">{dateText(t.date)}</span>
        </div>
        <div className="og-tx__side"><Amount t={t} /><Status_ t={t} /></div>
      </div>
    </Card>
  );
}

export function TransactionsPage({ onLogin }) {
  const store = useStore();
  const [direction, setDirection] = useState('all');
  const [showIncomplete, setShowIncomplete] = useState(true);
  const [page, setPage] = useState(1);
  const all = useMemo(() => transactionsOf(store.orders, store.txlog, (g) => gameOf(g)?.name || ''), [store.orders, store.txlog]);
  const list = useMemo(() => filterTransactions(all, { direction, showIncomplete }), [all, direction, showIncomplete]);
  const pages = pagesOf(list.length);
  useEffect(() => { if (page > 1 && pages > 0 && page > pages) setPage(1); }, [page, pages]);
  // a guest buyer has a temporary account: it has no history of payments (the real service says so and offers to sign in)
  if (!store.user && store.temp) return <Page fill><Status status="neutral" icon={<Icon name="Wallet01" size={28} />} title="Payment history is not available for a temporary account" description="It was created at the checkout. Sign in with your email to see your payments" actionLabel="Sign in with email" onAction={onLogin} /></Page>;
  if (!store.user) return <Page fill><Status status="neutral" icon={<Icon name="Wallet01" size={28} />} title="Sign in to see your payments" description="Your payment history is kept in your account" actionLabel="Sign in" onAction={onLogin} /></Page>;
  const shown = pageOf(list, page);
  return (
    <Page bar>
      <div className="og-stack og-stack--xl" data-test-id="transactions-page">
        <PageHead crumbs={[{ label: 'Home', href: '#/' }, { label: 'Account', href: '#/account' }, { label: 'Wallet', href: '#/wallet' }, { label: 'Payment History' }]} title="Payment History" />
        <div className="og-txfilters" data-test-id="transactions-filters">
          <Selector size="sm" label="Type" value={direction} onValueChange={(v) => { setDirection(v); setPage(1); }} options={DIRECTION_OPTIONS} data-test-id="transactions-direction" />
          <Checkbox label="Show incomplete transactions" checked={showIncomplete} onCheckedChange={(v) => { setShowIncomplete(v); setPage(1); }} data-test-id="transactions-incomplete" />
        </div>
        {!list.length ? (
          <p className="og-text og-tx__empty" data-test-id="transactions-empty">You have not any transactions yet</p>
        ) : (
          <div className="og-stack og-stack--tight" data-test-id="transactions-list">
            {shown.map((t) => <Transaction key={t.id} t={t} />)}
          </div>
        )}
        {pages > 1 && <Pagination page={page} total={pages} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0 }); }} />}
      </div>
    </Page>
  );
}
