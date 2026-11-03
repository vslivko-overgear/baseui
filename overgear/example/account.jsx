import { useState } from '../../src/react.js';
import { Button } from '../../src/components/Button.jsx';
import { ButtonGroup } from '../../src/components/ButtonGroup.jsx';
import { Card } from '../../src/components/Card.jsx';
import { Avatar } from '../../src/components/Avatar.jsx';
import { TextInput } from '../../src/components/TextInput.jsx';
import { Switch } from '../../src/components/Switch.jsx';
import { Status } from '../../src/components/Status.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { Divider } from '../../src/components/Divider.jsx';
import { List, ListItem } from '../../src/components/List.jsx';
import { usePrefs } from './prefs.jsx';
import { go } from './util.js';
import { offerOf } from './data.js';
import { Page, PageHead, OfferListing } from './ui.jsx';
import { useStore } from './store.jsx';
import { Amounts } from './wallet.jsx';
import { RankBadge, useRank } from './rank.jsx';
import { rankLine } from './rank-core.js';


/** The value on the right of a row and the chevron after it. */
const Value = ({ children }) => <span className="og-row og-row--nowrap">{children}<Icon name="ChevronRight" size={20} /></span>;

/** The profile row: the avatar with the picture of the rank at its corner, the nick, and the rank under it ("Rank: Guardian"); a click opens the page of the rank. */
export function ProfileRow({ active, onPick }) {
  const store = useStore();
  const { grade } = useRank();
  return (
    <ListItem avatar={<span className="og-avatarrank"><Avatar name={store.user.name} size={40} shape="rounded" className="og-profilerow__avatar" /><span className="og-avatarrank__badge"><RankBadge grade={grade} size={20} /></span></span>} subtitle={rankLine(grade)} onClick={() => { onPick?.(); go('/rank'); }} active={active} details={<Value />} className="og-profilerow" data-test-id="profile-rank-row">{store.user.name}</ListItem>
  );
}

/**
 * The one menu of the account, on a phone (the account screen), in the profile popup of the header and in the left column of the account page on a desktop: the profile with the rank, the orders, the favorites, the settings,
 * the currency, the language, the support and the logout. A visitor without a login gets the three preferences only. Each place hides what it does not need (`hide`: ids of rows), marks the row of the open page (`active`),
 * and passes `prefs` (the result of `usePrefs`) when the sheets of the currency and the language must outlive the menu (a popup); `onPick` runs after a row is chosen (a popup closes).
 */
export function AccountMenu({ active, hide = [], prefs, onPick, ...rest }) {
  const store = useStore();
  const own = usePrefs();
  const { currency, language, open } = prefs || own;
  const wished = store.wishlist.map(offerOf).filter(Boolean);
  const pick = (fn) => () => { onPick?.(); fn(); };
  const row = (id, icon, label, props) => !hide.includes(id) && <ListItem key={id} icon={<Icon name={icon} size={24} />} active={active === id} data-test-id={`account-menu-${id}`} {...props}>{label}</ListItem>;
  return (
    <div className="og-accmenu">
      {store.user && !hide.includes('profile') && (
        <>
          <List aria-label="Profile"><ProfileRow active={active === 'rank'} onPick={onPick} /></List>
          <Divider className="og-acc__div" />
        </>
      )}
      <List aria-label="Account menu" {...rest}>
        {store.user && row('wallet', 'Wallet01', 'Wallet', { onClick: pick(() => go('/wallet')), details: <span className="og-row og-row--nowrap"><Amounts plus={false} /><Icon name="ChevronRight" size={20} /></span> })}
        {store.user && row('orders', 'ShoppingBag01', 'My orders', { onClick: pick(() => go('/orders')), details: <Value>{store.orders.length}</Value> })}
        {store.user && row('wishlist', 'Heart', 'Favorites', { onClick: pick(() => go('/account?tab=wishlist')), details: <Value>{wished.length}</Value> })}
        {store.user && row('settings', 'Settings01', 'Settings', { onClick: pick(() => go('/account?tab=settings')), details: <Value /> })}
        {row('currency', 'CoinsHand', 'Currency', { onClick: pick(() => open('currency')), details: <Value>{currency}</Value> })}
        {row('language', 'Globe01', 'Language', { onClick: pick(() => open('language')), details: <Value>{language}</Value> })}
        {row('support', 'MessageChatCircle', 'Support', { onClick: pick(() => go('/info/contact')), details: <Value /> })}
        {store.user && row('logout', 'LogOut01', 'Log out', { onClick: pick(() => { store.logout(); go('/'); }), details: <Value /> })}
      </List>
      {!prefs && own.sheets}
    </div>
  );
}

/** The account: a list like the profile of the real service. The orders, the favorites and the settings are screens behind its rows. */
export function Account({ tab, onLogin }) {
  const store = useStore();
  const [name, setName] = useState(store.user?.name || '');
  const [mail, setMail] = useState(true);
  // the wishlist is kept on the device, so it opens without a login
  if (!store.user && tab !== 'wishlist') {
    return (
      <Page>
        <div className="og-stack og-stack--related">
          <h1 className="og-title">Account</h1>
          <Button variant="primary" size="lg" width="100%" label="Log in" onClick={onLogin} />
          <AccountMenu />
        </div>
      </Page>
    );
  }
  const wished = store.wishlist.map(offerOf).filter(Boolean);
  const out = () => { store.logout(); go('/'); };
  if (!tab) {
    return (
      <Page>
        <div className="og-stack og-stack--related">
          <h1 className="og-title">Account</h1>
          <AccountMenu />
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
      <PageHead crumbs={tab === 'wishlist' ? undefined : [{ label: 'Account', href: '#/account' }, { label: titles[tab] || 'Account' }]} title={titles[tab] || 'Account'} />
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
