// The page "Bonus History" (/wallet/bonuses): what was credited in OG Coins (cashback, bonuses, gifts) with the day each burns, and what was spent. The rules are in transactions-core.js.
import { useMemo, useState } from '../../src/react.js';
import { Icon } from '../../src/components/Icon.jsx';
import { Card } from '../../src/components/Card.jsx';
import { Pagination } from '../../src/components/Pagination.jsx';
import { Status } from '../../src/components/Status.jsx';
import { gameOf } from './data.js';
import { Page, PageHead, CashbackMark } from './ui.jsx';
import { useStore } from './store.jsx';
import { TxMain } from './transactions.jsx';
import { bonusesOf, isBurnt, pagesOf, pageOf, numberText, dayText } from './transactions-core.js';

/** A bonus: a card of its own. On the left what it is (the title, what it was for, the date), on the right the coins and the day they burn (a spending has none). */
function Bonus({ t, now }) {
  const burnt = isBurnt(t, now);
  const sign = t.direction === 'incoming' ? '+' : '-';
  return (
    <Card variant="surface" padding={4} data-test-id={`bonus-${t.id}`}>
      <div className="og-tx">
        <TxMain t={t} />
        <div className="og-tx__side">
          <span className="og-tx__amount" data-direction={t.direction} aria-label={`${sign} ${numberText(t)} OG Coins`}>{`${sign} `}<span className="og-cbtag">{numberText(t)}<CashbackMark /></span></span>
          {t.expiresAt != null && <span className="og-tx__sub" data-test-id={`bonus-expiry-${t.id}`}>{burnt ? `Burnt ${dayText(t.expiresAt)}` : `Burns ${dayText(t.expiresAt)}`}</span>}
        </div>
      </div>
    </Card>
  );
}

export function BonusesPage({ onLogin }) {
  const store = useStore();
  const [page, setPage] = useState(1);
  const list = useMemo(() => bonusesOf(store.orders, store.txlog, (g) => gameOf(g)?.name || ''), [store.orders, store.txlog]);
  const now = useMemo(() => Date.now(), []);
  if (!store.user) return <Page fill><Status status="neutral" icon={<Icon name="Wallet01" size={28} />} title="Sign in to see your bonuses" description="Your bonus history is kept in your account" actionLabel="Sign in" onAction={onLogin} /></Page>;
  const pages = pagesOf(list.length);
  const shown = pageOf(list, page);
  return (
    <Page bar>
      <div className="og-stack" data-test-id="bonuses-page">
        <PageHead crumbs={[{ label: 'Home', href: '#/' }, { label: 'Account', href: '#/account' }, { label: 'Wallet', href: '#/wallet' }, { label: 'Bonus History' }]} title="Bonus History" />
        {!list.length ? (
          <p className="og-text og-tx__empty" data-test-id="bonuses-empty">You have not any bonuses yet</p>
        ) : (
          <div className="og-stack og-stack--cards" data-test-id="bonuses-list">
            {shown.map((t) => <Bonus key={t.id} t={t} now={now} />)}
          </div>
        )}
        {pages > 1 && <Pagination page={page} total={pages} onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0 }); }} />}
      </div>
    </Page>
  );
}
