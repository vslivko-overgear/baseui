// The wallet: what is on the account (the money and the OG Coins, each on its own card, with the top-up), what the coins give at the rank of the buyer (the cashback and the payment with coins), and the subscriptions that pay coins.
// A subscription is turned on by a button, which becomes the status "Subscribed" (no sheet), and it pays its reward once. The email has a switch for the notifications about the wishlist.
import { Badge } from '../../src/components/Badge.jsx';
import { Button } from '../../src/components/Button.jsx';
import { Card } from '../../src/components/Card.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { List, ListItem } from '../../src/components/List.jsx';
import { Status } from '../../src/components/Status.jsx';
import { Switch } from '../../src/components/Switch.jsx';
import { useToast } from '../../src/components/Toast.jsx';
import { go } from './util.js';
import { money } from './data.js';
import { Page, PageHead, Section, CashbackMark } from './ui.jsx';
import { useStore } from './store.jsx';
import { useRank, RankBadge } from './rank.jsx';
import { SUBSCRIPTIONS, coinsText, openTopUp } from './wallet-core.js';

/** The reward of a subscription: the coins it pays, big, in the tag of the bonuses. */
const Reward = ({ coins, paid }) => <Badge variant="warning-light" size="lg" icon={<CashbackMark />} label={paid ? `+${coins} received` : `+${coins}`} data-test-id="subscription-reward" />;

/** A subscription: what it is, the reward, and the button that turns it on; the button becomes the status "Subscribed" (to whom, for the email), and the reward is paid once. The email has a switch for the wishlist notifications. */
function Subscription({ item }) {
  const store = useStore();
  const { toast } = useToast();
  const on = store.subs[item.id];
  const paid = !!store.subs.paid[item.id];
  const turnOn = () => {
    const gets = !paid;
    store.setSubscription(item.id, true);
    toast({ message: gets ? `${item.coins} OG Coins credited` : `${item.title} is on`, status: 'success' });
  };
  return (
    <Card variant="surface" padding={5} data-test-id={`subscription-${item.id}`}>
      <div className="og-stack og-stack--related og-sub">
        <div className="og-sub__head">
          <div className="og-stack og-stack--hair">
            <h3 className="og-h3">{item.title}</h3>
            <p className="og-meta">{item.text}</p>
          </div>
          <Reward coins={item.coins} paid={paid} />
        </div>
        {item.sub && <Switch label={item.sub.label} checked={on && store.subs[item.sub.id]} disabled={!on} onCheckedChange={(v) => store.setSubscription(item.sub.id, v)} data-test-id={`subscription-${item.sub.id}`} />}
        <div className="og-sub__act">
          {on ? (
            <span className="og-subscribed" role="status" data-test-id="subscription-on"><Icon name="CheckCircle" size={24} filled />Subscribed</span>
          ) : (
            <Button variant="primary" size="lg" width="100%" label={item.id === 'email' ? 'Subscribe' : 'Connect Discord'} onClick={turnOn} data-test-id={`subscription-start-${item.id}`} />
          )}
        </div>
      </div>
    </Card>
  );
}

/** One amount of the wallet on its own card, from the left edge. */
const Amount = ({ label, children, testId }) => (
  <Card variant="surface" padding={5}>
    <div className="og-stack og-stack--hair og-wamount" data-test-id={testId}>
      <p className="og-meta">{label}</p>
      <p className="og-balance__money">{children}</p>
    </div>
  </Card>
);

/** A row of the terms: the same box for the picture or the icon, the value, what it is. */
const Pic = ({ children }) => <span className="og-termpic">{children}</span>;

export function WalletPage({ onLogin }) {
  const store = useStore();
  const { grade } = useRank();
  if (!store.user) return <Page fill><Status status="neutral" icon={<Icon name="Wallet01" size={28} />} title="Sign in to see your wallet" description="Your balance and OG Coins are kept in your account" actionLabel="Sign in" onAction={onLogin} /></Page>;
  const total = SUBSCRIPTIONS.reduce((n, s) => n + s.coins, 0);
  return (
    <Page bar>
      <div className="og-stack og-stack--xl og-wpage" data-test-id="wallet-page">
        <PageHead crumbs={[{ label: 'Home', href: '#/' }, { label: 'Account', href: '#/account' }, { label: 'Wallet' }]} title="Wallet" meta="1 OG Coin = $1.00" />
        <div className="og-stack">
          <div className="og-amounts-grid">
            <Amount label="Balance" testId="wallet-balance">{money(store.balance)}</Amount>
            <Amount label="OG Coins" testId="wallet-coins"><span className="og-balance__coin"><CashbackMark />{coinsText(store.coins)}</span></Amount>
          </div>
          <Button variant="primary" size="lg" width="100%" label="Top up" icon={<Icon name="Plus" size={20} />} onClick={openTopUp} data-test-id="wallet-top-up-page" />
        </div>
        <Section title="Your terms">
          <Card variant="surface" padding={4}>
            <List aria-label="Your terms" spacing="lg" data-test-id="wallet-terms">
              <ListItem avatar={<Pic><Icon name="Coins01" size={24} /></Pic>} subtitle="of every purchase comes back as OG Coins once the order is completed">{`${grade.cashbackPercentage}% cashback`}</ListItem>
              <ListItem avatar={<Pic><Icon name="Wallet01" size={24} /></Pic>} subtitle="of a purchase can be paid with OG Coins">{`Up to ${grade.purchaseLimitPercentage}%`}</ListItem>
              <ListItem avatar={<Pic><RankBadge grade={grade} size={28} /></Pic>} subtitle="The terms depend on your rank" onClick={() => go('/rank')} details={<Icon name="ChevronRight" size={20} />}>{`${grade.name} rank`}</ListItem>
            </List>
          </Card>
        </Section>
        <Section>
          <div className="og-stack">
            <div className="og-stack og-stack--close">
              <h2 className="og-h2">{`Get ${total} OG Coins for subscriptions`}</h2>
              <p className="og-text">Stay in the loop with updates and get rewards</p>
            </div>
            <div className="og-subs-grid">{SUBSCRIPTIONS.map((item) => <Subscription key={item.id} item={item} />)}</div>
          </div>
        </Section>
      </div>
    </Page>
  );
}
