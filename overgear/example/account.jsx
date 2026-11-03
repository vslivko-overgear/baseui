import { useState, useEffect } from '../../src/react.js';
import { Button } from '../../src/components/Button.jsx';
import { ButtonGroup } from '../../src/components/ButtonGroup.jsx';
import { Card } from '../../src/components/Card.jsx';
import { Avatar } from '../../src/components/Avatar.jsx';
import { TextInput } from '../../src/components/TextInput.jsx';
import { Switch } from '../../src/components/Switch.jsx';
import { Status } from '../../src/components/Status.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { List, ListItem } from '../../src/components/List.jsx';
import { usePrefs } from './prefs.jsx';
import { go, goReplace } from './util.js';
import { offerOf } from './data.js';
import { Page, PageHead, OfferListing } from './ui.jsx';
import { useStore } from './store.jsx';
import { BalanceCard } from './wallet.jsx';
import { RankBadge, useRank } from './rank.jsx';
import { rankLine } from './rank-core.js';
import { useMedia } from './util.js';


/** The value on the right of a row and the chevron after it. */
const Value = ({ children }) => <span className="og-row og-row--nowrap">{children}<Icon name="ChevronRight" size={20} /></span>;

/** What a visitor can set before logging in: the currency, the language, and the way to the support. */
function Preferences({ before, children }) {
  const { currency, language, open, sheets } = usePrefs();
  return (
    <>
      <List aria-label="Preferences">
        {before}
        <ListItem icon={<Icon name="CoinsHand" size={24} />} onClick={() => open('currency')} details={<Value>{currency}</Value>}>Currency</ListItem>
        <ListItem icon={<Icon name="Globe01" size={24} />} onClick={() => open('language')} details={<Value>{language}</Value>}>Language</ListItem>
        <ListItem icon={<Icon name="MessageChatCircle" size={24} />} onClick={() => go('/info/contact')} details={<Value />}>Support</ListItem>
        {children}
      </List>
      {sheets}
    </>
  );
}

/** The profile row: the avatar with the picture of the rank at its corner, the nick, and the rank under it ("Rank: Guardian"); a click opens the page of the rank. */
function ProfileRow({ active }) {
  const store = useStore();
  const { grade } = useRank();
  return (
    <ListItem avatar={<span className="og-avatarrank"><Avatar name={store.user.name} size="lg" /><span className="og-avatarrank__badge"><RankBadge grade={grade} size={22} /></span></span>} subtitle={rankLine(grade)} onClick={() => go('/rank')} active={active} details={<Value />} data-test-id="profile-rank-row">{store.user.name}</ListItem>
  );
}

/** The account on a desktop: the menu on the left (the profile with the rank, the orders, the favorites, the settings), the page of the active row on the right. A phone has no menu: every row is a screen of its own. */
export function AccountShell({ route, children }) {
  const store = useStore();
  if (!store.user) return children;
  const [first] = route.parts;
  const key = first === 'order' ? 'orders' : first === 'account' ? route.query.tab || 'settings' : first;
  const wished = store.wishlist.map(offerOf).filter(Boolean);
  const out = () => { store.logout(); go('/'); };
  return (
    <div className="og-acc" data-test-id="account-shell">
      <nav className="og-acc__menu" aria-label="Account">
        <List aria-label="Account menu">
          <ProfileRow active={key === 'rank'} />
          <ListItem icon={<Icon name="ShoppingBag01" size={24} />} active={key === 'orders'} onClick={() => go('/orders')} details={<span className="og-meta">{store.orders.length}</span>} data-test-id="account-menu-orders">My orders</ListItem>
          <ListItem icon={<Icon name="Heart" size={24} />} active={key === 'wishlist'} onClick={() => go('/account?tab=wishlist')} details={<span className="og-meta">{wished.length}</span>} data-test-id="account-menu-wishlist">Favorites</ListItem>
          <ListItem icon={<Icon name="Settings01" size={24} />} active={key === 'settings'} onClick={() => go('/account?tab=settings')} data-test-id="account-menu-settings">Settings</ListItem>
          <ListItem icon={<Icon name="LogOut01" size={24} />} onClick={out}>Log out</ListItem>
        </List>
      </nav>
      <div className="og-acc__page">{children}</div>
    </div>
  );
}

/** The account: a list like the profile of the real service. The orders, the favorites and the settings are screens behind its rows. */
export function Account({ tab, onLogin }) {
  const store = useStore();
  const [name, setName] = useState(store.user?.name || '');
  const [mail, setMail] = useState(true);
  const mobile = useMedia('(max-width: 767px)');
  // on a desktop the account is its menu: the root opens the first page of it
  useEffect(() => { if (!mobile && store.user && !tab) goReplace('/orders'); }, [mobile, store.user, tab]);
  // the wishlist is kept on the device, so it opens without a login
  if (!store.user && tab !== 'wishlist') {
    return (
      <Page>
        <div className="og-stack og-stack--related">
          <h1 className="og-title">Account</h1>
          <Button variant="primary" size="lg" width="100%" label="Log in" onClick={onLogin} />
          <Preferences />
        </div>
      </Page>
    );
  }
  const wished = store.wishlist.map(offerOf).filter(Boolean);
  const out = () => { store.logout(); go('/'); };
  if (!tab) {
    if (!mobile) return null;
    return (
      <Page>
        <div className="og-stack og-stack--related">
          <h1 className="og-title">Account</h1>
          {mobile && <BalanceCard />}
          <List aria-label="Profile">
            <ProfileRow />

          </List>
          <Preferences before={<>
            <ListItem icon={<Icon name="ShoppingBag01" size={24} />} onClick={() => go('/orders')} details={<Value>{store.orders.length}</Value>}>My orders</ListItem>
            <ListItem icon={<Icon name="Heart" size={24} />} onClick={() => go('/account?tab=wishlist')} details={<Value>{wished.length}</Value>}>Favorites</ListItem>
            <ListItem icon={<Icon name="Settings01" size={24} />} onClick={() => go('/account?tab=settings')} details={<Value />}>Settings</ListItem>
          </>}>
            <ListItem icon={<Icon name="LogOut01" size={24} />} onClick={out} details={<Value />}>Log out</ListItem>
          </Preferences>
        </div>
      </Page>
    );
  }
  // nothing saved yet: the empty state is the whole screen, as in the cart
  if (tab === 'wishlist' && !wished.length) {
    return <Page fill><Status status="neutral" icon={<Icon name="Heart" size={28} />} title="Your favorites are empty" description="Tap the heart on an offer to keep it here" actionLabel="Browse games" onAction={() => go('/catalog')} /></Page>;
  }
  const titles = { wishlist: 'Favorites', settings: 'Settings' };
  return (
    <Page>
      <PageHead crumbs={tab === 'wishlist' || !mobile ? undefined : [{ label: 'Account', href: '#/account' }, { label: titles[tab] || 'Account' }]} title={titles[tab] || 'Account'} />
      {tab === 'wishlist' && (
        <OfferListing offers={wished} />
      )}
      {tab === 'settings' && (
        <Card variant="surface" padding={5}>
          <div className="og-stack" style={{ maxWidth: 480 }}>
            <TextInput label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <TextInput label="Email" value={store.user?.email || ''} disabled />
            <Switch label="Email me about my orders" checked={mail} onCheckedChange={setMail} />
            <ButtonGroup stackOnMobile><Button variant="primary" label="Save" onClick={() => store.login({ ...store.user, name })} /><Button variant="secondary" label="Log out" onClick={out} /></ButtonGroup>
          </div>
        </Card>
      )}
    </Page>
  );
}
