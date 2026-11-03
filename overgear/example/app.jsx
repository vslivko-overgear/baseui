import { createRoot } from 'react-dom/client';
import { cx, useState, useEffect } from '../../src/react.js';
import { ToastProvider } from '../../src/components/Toast.jsx';
import { Status } from '../../src/components/Status.jsx';
import { Page } from './ui.jsx';
import { startOvergearTheme } from '../theme.js';
import { StoreProvider } from './store.jsx';
import { useRoute, useMedia, go, OPEN_CART } from './util.js';
import { TopUpDialog } from './wallet.jsx';
import { Header, MobileHeader, MobileBar, Footer, LoginDialog } from './shell.jsx';
import { Home } from './home.jsx';
import { Offers, Game, Gold, SearchResults } from './games.jsx';
import { Catalog, CatalogDesktop, CatalogGame, CatalogGroup, CatalogBar } from './catalog.jsx';
import { Offer } from './offer.jsx';
import { Cart, CartDrawer, Checkout } from './cart.jsx';
import { Orders, OrdersBar } from './orders.jsx';
import { OrderPage } from './order-page.jsx';
import { RankPage } from './rank.jsx';
import { CheckoutResult } from './order-result.jsx';
import { Account } from './account.jsx';
import { Info } from './info.jsx';

// the global settings come from the Theme page; the bottom bar and the dropdowns have local ones that can be switched off there
startOvergearTheme();

function Body({ route, onLogin, mobile }) {
  const [first, second, third] = route.parts;
  if (!first) return <Home />;
  // the catalog is a classifier of the pages; the listings (games) are the shop with the products
  if (first === 'catalog') return !mobile ? <CatalogDesktop slug={second} /> : third ? <CatalogGroup slug={second} group={third} /> : second ? <CatalogGame slug={second} /> : <Catalog />;
  if (first === 'games') {
    if (!second) return <Offers category={route.query.c || 'All games'} />;
    if (third === 'gold') return <Gold />;
    return <Game slug={second} service={route.query.s || 'hot'} />;
  }
  if (first === 'search') return <SearchResults q={route.query.q} />;
  if (first === 'offer') return <Offer id={second} />;
  if (first === 'cart') return <Cart />;
  if (first === 'checkout') return second === 'result' ? <CheckoutResult result={third} orderLink={route.query.orderLink} transaction={route.query.transaction} /> : <Checkout />;
  if (first === 'rank') return <RankPage onLogin={onLogin} />;
  if (first === 'orders') return <Orders onLogin={onLogin} demo={route.query.demo} />;
  if (first === 'order') return <OrderPage link={second} onLogin={onLogin} />;
  if (first === 'account') return <Account tab={route.query.tab} onLogin={onLogin} />;
  if (first === 'info') return <Info id={second} />;
  return <Page404 />;
}
const Page404 = () => <Page><Status status="neutral" title="Page not found" actionLabel="Home" onAction={() => go('/')} /></Page>;

function Shell() {
  const route = useRoute();
  const mobile = useMedia('(max-width: 767px)');
  const [login, setLogin] = useState(false);
  const [mini, setMini] = useState(false);   // the mini-cart: any page opens it (after "Add to cart", the cart button of the header), on a desktop and on a phone
  useEffect(() => { const open = () => setMini(true); window.addEventListener(OPEN_CART, open); return () => window.removeEventListener(OPEN_CART, open); }, []);
  useEffect(() => { setMini(false); }, [route.path]);
  useEffect(() => { window.scrollTo(0, 0); }, [route.path]);
  // on a phone the tabs of the bottom bar (Catalog, Favorites, Cart, Account) are screens of their own: no header and no footer
  const step2 = mobile && route.parts[0] === 'catalog' && !!route.parts[1];
  const bare = route.parts[0] === 'checkout';   // the checkout has a slim top bar and no footer of its own shop
  const orders = mobile && ['orders', 'order', 'rank'].includes(route.parts[0]);   // behind the account: a bar with back, and no header and no footer of the shop
  const tab = orders || (mobile && (route.parts[0] === 'catalog' || ['cart', 'account'].includes(route.parts[0])));
  return (
    <div className={cx('og', mobile && 'og--mobile', tab && 'og--tab')}>
      {bare ? null : step2 ? <CatalogBar slug={route.parts[1]} group={route.parts[2]} /> : orders ? <OrdersBar route={route} /> : tab ? null : mobile ? <MobileHeader route={route} onLogin={() => setLogin(true)} /> : <Header route={route} onLogin={() => setLogin(true)} />}
      <main className={bare ? 'og-bare' : 'og-wrap'} key={route.path + (route.query.c || '') + (route.query.s || '')}>
        <Body route={route} onLogin={() => setLogin(true)} mobile={mobile} />
      </main>
      {!tab && !bare && <Footer />}
      {mobile && !bare && <MobileBar route={route} />}
      <CartDrawer open={mini} onClose={() => setMini(false)} />
      <LoginDialog open={login} onClose={() => setLogin(false)} />
      <TopUpDialog />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <ToastProvider placement="top-center">
    <StoreProvider>
      <Shell />
    </StoreProvider>
  </ToastProvider>,
);
