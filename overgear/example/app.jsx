import { createRoot } from 'react-dom/client';
import { cx, useState, useEffect } from '../../src/react.js';
import { ToastProvider } from '../../src/components/Toast.jsx';
import { Status } from '../../src/components/Status.jsx';
import { Page } from './ui.jsx';
import { startOvergearTheme } from '../theme.js';
import { StoreProvider } from './store.jsx';
import { useRoute, useMedia, go } from './util.js';
import { TopUpDialog } from './wallet.jsx';
import { Header, MobileHeader, MobileBar, Footer, LoginDialog } from './shell.jsx';
import { Home } from './home.jsx';
import { Offers, Game, Gold, SearchResults } from './games.jsx';
import { Catalog, CatalogDesktop, CatalogGame, CatalogGroup, CatalogBar } from './catalog.jsx';
import { Offer } from './offer.jsx';
import { Cart, Checkout, OrderDone } from './cart.jsx';
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
  if (first === 'checkout') return <Checkout />;
  if (first === 'order') return <OrderDone id={second} />;
  if (first === 'account') return <Account tab={route.query.tab} onLogin={onLogin} />;
  if (first === 'info') return <Info id={second} />;
  return <Page404 />;
}
const Page404 = () => <Page><Status status="neutral" title="Page not found" actionLabel="Home" onAction={() => go('/')} /></Page>;

function Shell() {
  const route = useRoute();
  const mobile = useMedia('(max-width: 767px)');
  const [login, setLogin] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, [route.path]);
  // on a phone the tabs of the bottom bar (Catalog, Favorites, Cart, Account) are screens of their own: no header and no footer
  const step2 = mobile && route.parts[0] === 'catalog' && !!route.parts[1];
  const bare = route.parts[0] === 'checkout';   // the checkout has a slim top bar and no footer of its own shop
  const tab = mobile && (route.parts[0] === 'catalog' || ['cart', 'account'].includes(route.parts[0]));
  return (
    <div className={cx('og', mobile && 'og--mobile', tab && 'og--tab')}>
      {bare ? null : step2 ? <CatalogBar slug={route.parts[1]} group={route.parts[2]} /> : tab ? null : mobile ? <MobileHeader route={route} onLogin={() => setLogin(true)} /> : <Header route={route} onLogin={() => setLogin(true)} />}
      <main className={bare ? 'og-bare' : 'og-wrap'} key={route.path + (route.query.c || '') + (route.query.s || '')}>
        <Body route={route} onLogin={() => setLogin(true)} mobile={mobile} />
      </main>
      {!tab && !bare && <Footer />}
      {mobile && !bare && <MobileBar route={route} />}
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
