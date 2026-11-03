// The list of the orders of a buyer (/orders), as the real service has it (orders-listing-widget): a title with the count, a filter by the state and a sort, a card for each order (the title, the status, the date, the game,
// the seller, the price, Reorder; the whole card opens the order), 20 to a page (numbered pages on a desktop, "Show more" on a phone), and the states of the list: loading, an error with a retry, empty, and the guest
// (temporary) account, which has no history. The rules are in order-core.js.
import { useEffect, useState } from '../../src/react.js';
import { Button } from '../../src/components/Button.jsx';
import { Badge } from '../../src/components/Badge.jsx';
import { ClickableCard } from '../../src/components/Card.jsx';
import { Selector } from '../../src/components/Selector.jsx';
import { Pagination } from '../../src/components/Pagination.jsx';
import { Skeleton } from '../../src/components/Skeleton.jsx';
import { Status } from '../../src/components/Status.jsx';
import { Avatar } from '../../src/components/Avatar.jsx';
import { ControlRow } from '../../src/components/Layout.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { go, href, useMedia, useTitleUnderBar } from './util.js';
import { money, gameOf } from './data.js';
import { Page, PageHead } from './ui.jsx';
import { useStore } from './store.jsx';
import { Navbar } from '../../src/components/MobileNavigation.jsx';
import { STATE_FILTERS, SORTS, filterOrders, sortOrders, pageOf, listState, statusLabel, statusBadge, cardDate, ordersCount } from './order-core.js';

/** Where Reorder leads: the offer of the order, or the game when the offer is gone. */
export const reorderPath = (order) => (order.offerId ? `/offer/${order.offerId}` : `/games/${order.game || 'wow'}`);

/** The seller of an order: a name and whether they are online. */
function SellerInfo({ seller }) {
  if (!seller) return null;
  return (
    <span className="og-seller" data-test-id="order-card-seller">
      <Avatar size="md" name={seller.name} />
      <span className="og-stack og-stack--hair">
        <span className="og-seller__name">{seller.name}</span>
        <span className="og-meta">{seller.online ? 'Online' : 'Offline'}</span>
      </span>
    </span>
  );
}

/** A card of the list. The whole card is the link to the order; Reorder stays a button of its own. */
export function OrderCard({ order }) {
  const game = gameOf(order.game)?.name || '';
  return (
    <ClickableCard href={href(`/order/${order.link}`)} label={order.title} variant="surface" padding={4} className="og-ocard" data-test-id="order-card">
      <div className="og-ocard__row">
        <div className="og-ocard__info">
          <span className="og-ocard__title" data-test-id="order-card-title">{order.title}</span>
          <span className="og-ocard__meta">
            <Badge variant={statusBadge(order.status)} size="sm" label={statusLabel(order.status)} data-test-id="order-card-status" />
            <span className="og-meta" data-test-id="order-card-date">{cardDate(order.createdAt)}</span>
          </span>
        </div>
        <span className="og-ocard__chip" data-test-id="order-card-game"><span>{game}</span><span className="og-meta">game</span></span>
        <SellerInfo seller={order.seller} />
        <span className="og-ocard__price" data-test-id="order-card-price"><strong>{money(order.price)}</strong><span className="og-meta">price</span></span>
        <Button variant="primary" size="sm" label="Reorder" onClick={() => go(reorderPath(order))} data-test-id="order-card-reorder" />
      </div>
    </ClickableCard>
  );
}

const Skeletons = () => (
  <div className="og-stack og-stack--tight" data-test-id="orders-list-skeleton" aria-busy="true" aria-label="Loading the orders">
    {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="rect" height={88} />)}
  </div>
);

/** The states of the page the example lets you open (`?demo=`): the real ones come from the network. */
const DEMO = [['', 'The list'], ['loading', 'Loading'], ['error', 'An error'], ['empty', 'Empty'], ['temporary', 'Guest account']];

export function Orders({ onLogin, demo = '' }) {
  const store = useStore();
  const mobile = useMedia('(max-width: 767px)');
  const [state, setState] = useState('all');
  const [sort, setSort] = useState('new');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  // the list is asked for when the page opens: a short wait with the skeleton, as on the network
  useEffect(() => { setLoading(true); const id = setTimeout(() => setLoading(false), 450); return () => clearTimeout(id); }, [attempt]);
  // the page goes back to the first when the filter or the sort changes
  useEffect(() => { setPage(1); }, [state, sort]);

  const mine = demo === 'empty' ? [] : store.orders;
  const filtered = sortOrders(filterOrders(mine, state), sort);
  const view = pageOf(filtered, page, mobile);
  const phase = listState({ temporary: demo === 'temporary' || (!store.user && !!store.temp), loading: loading || demo === 'loading', error: demo === 'error', count: filtered.length });

  if (!store.user && !store.temp && demo !== 'temporary') {
    return <Page fill><Status status="neutral" icon={<Icon name="ShoppingBag01" size={28} />} title="Sign in to see your orders" description="Your orders are kept in your account" actionLabel="Sign in" onAction={onLogin} /></Page>;
  }

  const body = {
    temporary: <Status status="neutral" title="Orders are not available for a temporary account" description="Sign in with your email to see your orders" actionLabel="Sign in" onAction={onLogin} data-test-id="orders-temporary" />,
    error: <Status status="error" title="Something went wrong" description="We couldn't load your orders. Please try again" actionLabel="Try again" onAction={() => { setAttempt((n) => n + 1); if (demo) go('/orders'); }} data-test-id="orders-error" />,
    loading: <Skeletons />,
    empty: <Status status="neutral" icon={<Icon name="ShoppingBag01" size={28} />} title={state === 'all' ? 'No orders yet' : 'No orders found'} description={state === 'all' ? 'Your orders will be here' : 'Try another state'} actionLabel={state === 'all' ? 'Browse games' : 'All orders'} onAction={() => (state === 'all' ? go('/catalog') : setState('all'))} data-test-id="orders-empty" />,
    list: (
      <div className="og-stack" data-test-id="orders-list">
        <div className="og-stack og-stack--tight">{view.nodes.map((o) => <OrderCard key={o.link} order={o} />)}</div>
        {mobile
          ? view.nodes.length < filtered.length && <Button variant="secondary" size="lg" width="100%" label="Show More" onClick={() => setPage(view.page + 1)} data-test-id="orders-show-more" />
          : view.totalPages > 1 && <Pagination page={view.page} total={view.totalPages} onPageChange={setPage} />}
      </div>
    ),
  }[phase];

  const showControls = phase === 'list' || phase === 'loading' || (phase === 'empty' && state !== 'all');
  return (
    <Page bar>
      <div className="og-stack og-stack--xl" data-test-id="orders-listing">
        <PageHead title="My orders" meta={phase === 'list' || phase === 'empty' ? ordersCount(filtered.length) : undefined} />
        {showControls && (
          <ControlRow size="md">
            <Selector size="sm" label="Order state" value={state} onValueChange={setState} options={STATE_FILTERS} data-test-id="orders-filters" />
            <Selector size="sm" label="Sort by" value={sort} onValueChange={setSort} options={SORTS} data-test-id="orders-sort" />
          </ControlRow>
        )}
        {body}
        <nav className="og-result__demo" aria-label="States of this page">
          <span className="og-meta">Show the state</span>
          {DEMO.map(([d, label]) => <a key={label} href={href(`/orders${d ? `?demo=${d}` : ''}`)} onClick={(e) => { e.preventDefault(); go(`/orders${d ? `?demo=${d}` : ''}`); }}>{label}</a>)}
        </nav>
      </div>
    </Page>
  );
}

/** The top bar of the orders pages on a phone: back (the list goes back to the account, an order to the list), no title at the start, the title when the heading scrolls under the bar. */
export function OrdersBar({ route }) {
  const list = route.parts[0] === 'orders';
  const under = useTitleUnderBar('.og-title', route.path);
  return <Navbar title={list ? 'My orders' : 'Order'} titleVisible={under} onBack={() => go(list ? '/account' : '/orders')} />;
}
