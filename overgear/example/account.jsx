import { useState } from '../../src/react.js';
import { Breadcrumbs } from '../../src/components/Breadcrumbs.jsx';
import { Button } from '../../src/components/Button.jsx';
import { ButtonGroup } from '../../src/components/ButtonGroup.jsx';
import { Card } from '../../src/components/Card.jsx';
import { Badge } from '../../src/components/Badge.jsx';
import { Avatar } from '../../src/components/Avatar.jsx';
import { TextInput } from '../../src/components/TextInput.jsx';
import { Switch } from '../../src/components/Switch.jsx';
import { Status } from '../../src/components/Status.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { List, ListItem } from '../../src/components/List.jsx';
import { usePrefs } from './prefs.jsx';
import { Bleed } from '../../src/components/Layout.jsx';
import { go } from './util.js';
import { money, OFFERS, offerOf } from './data.js';
import { Page, PageHead, OfferListing } from './ui.jsx';
import { useStore } from './store.jsx';
import { BalanceCard } from './wallet.jsx';
import { useMedia } from './util.js';

const STATUS = { Paid: 'info', Completed: 'success', 'In progress': 'warning' };
const dateOf = (t) => new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

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

/** The account: a list like the profile of the real service. The orders, the favorites and the settings are screens behind its rows. */
export function Account({ tab, onLogin }) {
  const store = useStore();
  const [name, setName] = useState(store.user?.name || '');
  const [mail, setMail] = useState(true);
  const mobile = useMedia('(max-width: 767px)');
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
    return (
      <Page>
        <div className="og-stack og-stack--related">
          <h1 className="og-title">Account</h1>
          {mobile && <BalanceCard />}
          <List aria-label="Profile">
            <ListItem avatar={<Avatar name={store.user.name} size="lg" />} subtitle={store.user.email} onClick={() => go('/account?tab=settings')} details={<Value />}>{store.user.name}</ListItem>
          </List>
          <Preferences before={<>
            <ListItem icon={<Icon name="ShoppingBag01" size={24} />} onClick={() => go('/account?tab=orders')} details={<Value>{store.orders.length}</Value>}>My orders</ListItem>
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
  const titles = { orders: 'My orders', wishlist: 'Favorites', settings: 'Settings' };
  return (
    <Page>
      <PageHead crumbs={tab === 'wishlist' ? undefined : [{ label: 'Account', href: '#/account' }, { label: titles[tab] || 'Account' }]} title={titles[tab] || 'Account'} />
      {tab === 'orders' && (
        store.orders.length ? (
          <List aria-label="Orders">
            {store.orders.map((o) => (
              <ListItem key={o.id} overline={`${o.id} · ${dateOf(o.date)}`} subtitle={o.items.map((i) => i.title).join(', ')} details={<Badge variant={STATUS[o.status] || 'secondary'} label={o.status} />}>{money(o.total)}</ListItem>
            ))}
          </List>
        ) : <Status status="neutral" title="No orders yet" description="Your orders will be here" actionLabel="Browse games" onAction={() => go('/catalog')} />
      )}
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
