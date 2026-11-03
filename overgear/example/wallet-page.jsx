// The wallet: what is on the account (the money and the OG Coins, with the top-up and its bonus), what the coins give at the rank of the buyer (the cashback and the payment with coins), and the subscriptions that pay coins.
// Each fact is in one place: the amounts and the top-up bonus in the card, the rank terms in two rows, the rewards in the switches.
import { Badge } from '../../src/components/Badge.jsx';
import { Card } from '../../src/components/Card.jsx';
import { Checkbox } from '../../src/components/Checkbox.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { List, ListItem } from '../../src/components/List.jsx';
import { Status } from '../../src/components/Status.jsx';
import { Switch } from '../../src/components/Switch.jsx';
import { useToast } from '../../src/components/Toast.jsx';
import { go } from './util.js';
import { Page, PageHead, Section, CashbackMark } from './ui.jsx';
import { useStore } from './store.jsx';
import { useRank, RankBadge } from './rank.jsx';
import { BalanceCard } from './wallet.jsx';
import { SUBSCRIPTIONS } from './wallet-core.js';

/** The reward of a subscription: the coins it pays, in the tag of the bonuses. */
const Reward = ({ coins, paid }) => <Badge variant="warning-light" size="md" icon={<CashbackMark />} label={paid ? `${coins} received` : `+${coins}`} />;

/** A subscription: the switch with its name, what it is, the reward, and (for the email) the setting that depends on it. */
function Subscription({ item }) {
  const store = useStore();
  const { toast } = useToast();
  const on = store.subs[item.id];
  const paid = !!store.subs.paid[item.id];
  const change = (value) => {
    const gets = value && !paid;
    store.setSubscription(item.id, value);
    if (gets) toast({ message: `${item.coins} OG Coins credited`, status: 'success' });
  };
  return (
    <Card variant="surface" padding={5} data-test-id={`subscription-${item.id}`}>
      <div className="og-stack og-stack--related">
        <div className="og-row og-row--between">
          <Switch label={<strong className="og-h3">{item.title}</strong>} checked={on} onCheckedChange={change} />
          <Reward coins={item.coins} paid={paid} />
        </div>
        <p className="og-meta">{item.text}</p>
        {item.sub && <Checkbox label={item.sub.label} checked={store.subs[item.sub.id]} disabled={!on} onCheckedChange={(v) => store.setSubscription(item.sub.id, v)} />}
      </div>
    </Card>
  );
}

export function WalletPage({ onLogin }) {
  const store = useStore();
  const { grade } = useRank();
  if (!store.user) return <Page fill><Status status="neutral" icon={<Icon name="Wallet01" size={28} />} title="Sign in to see your wallet" description="Your balance and OG Coins are kept in your account" actionLabel="Sign in" onAction={onLogin} /></Page>;
  const total = SUBSCRIPTIONS.reduce((n, s) => n + s.coins, 0);
  return (
    <Page bar>
      <div className="og-stack og-stack--xl" data-test-id="wallet-page">
        <PageHead crumbs={[{ label: 'Home', href: '#/' }, { label: 'Account', href: '#/account' }, { label: 'Wallet' }]} title="Wallet" meta="1 OG Coin = $1.00" />
        <BalanceCard />
        <Section title="Your terms">
          <List aria-label="Your terms" data-test-id="wallet-terms">
            <ListItem icon={<Icon name="Coins01" size={24} />} subtitle="of every purchase comes back as OG Coins once the order is completed">{`${grade.cashbackPercentage}% cashback`}</ListItem>
            <ListItem icon={<Icon name="Wallet01" size={24} />} subtitle="of a purchase can be paid with OG Coins">{`Up to ${grade.purchaseLimitPercentage}%`}</ListItem>
            <ListItem avatar={<RankBadge grade={grade} size={32} />} subtitle="The terms depend on your rank" onClick={() => go('/rank')} details={<Icon name="ChevronRight" size={20} />}>{`${grade.name} rank`}</ListItem>
          </List>
        </Section>
        <Section title={`Get ${total} OG Coins for subscriptions`}>
          <div className="og-stack">
            <p className="og-text">Stay in the loop with updates and get rewards</p>
            {SUBSCRIPTIONS.map((item) => <Subscription key={item.id} item={item} />)}
          </div>
        </Section>
      </div>
    </Page>
  );
}
