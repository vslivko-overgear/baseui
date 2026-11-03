// The wallet: what is on the account (the money and the OG Coins, each on its own card, with the top-up), what the coins give at the rank of the buyer (the cashback and the payment with coins), and the subscriptions that pay coins.
// A subscription is turned on by a button and a short check (the name or the email, then the code that was sent), and it pays its reward once.
import { useState } from '../../src/react.js';
import { Badge } from '../../src/components/Badge.jsx';
import { Button } from '../../src/components/Button.jsx';
import { Card } from '../../src/components/Card.jsx';
import { Checkbox } from '../../src/components/Checkbox.jsx';
import { Dialog } from '../../src/components/Dialog.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { List, ListItem } from '../../src/components/List.jsx';
import { OtpInput } from '../../src/components/OtpInput.jsx';
import { Status } from '../../src/components/Status.jsx';
import { TextInput } from '../../src/components/TextInput.jsx';
import { useToast } from '../../src/components/Toast.jsx';
import { go } from './util.js';
import { money } from './data.js';
import { Page, PageHead, Section, CashbackMark } from './ui.jsx';
import { useStore } from './store.jsx';
import { useRank, RankBadge } from './rank.jsx';
import { SUBSCRIPTIONS, coinsText, openTopUp, emailError, discordError } from './wallet-core.js';

/** The reward of a subscription: the coins it pays, big, in the tag of the bonuses. */
const Reward = ({ coins, paid }) => <Badge variant="warning-light" size="lg" icon={<CashbackMark />} label={paid ? `${coins} OG Coins received` : `+${coins} OG Coins`} data-test-id="subscription-reward" />;

/**
 * The check of a subscription: 1) the value (the email, or the name of the Discord account) with its error, 2) the code that was sent to it (any six digits in the demo), then the subscription is on and the reward is paid.
 */
function CheckDialog({ item, open, onClose, onDone }) {
  const store = useStore();
  const email = item.id === 'email';
  const [step, setStep] = useState('value');
  const [value, setValue] = useState(email ? store.user?.email || '' : '');
  const [tried, setTried] = useState(false);
  const error = email ? emailError(value) : discordError(value);
  const close = () => { setStep('value'); setTried(false); onClose(); };
  const send = () => { setTried(true); if (!error) setStep('code'); };
  const shown = value.trim().replace(/^@/, '');
  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()} title={step === 'value' ? (email ? 'Subscribe to email updates' : 'Connect your Discord') : (email ? 'Check your email' : 'Check Discord')} data-test-id={`subscription-dialog-${item.id}`}>
      <div className="og-stack og-stack--lg">
        {step === 'value' ? (
          <form className="og-stack og-stack--lg" noValidate onSubmit={(e) => { e.preventDefault(); send(); }}>
            <TextInput
              label={email ? 'Email' : 'Discord username'}
              type={email ? 'email' : 'text'}
              value={value}
              onChange={(e) => { setValue(e.target.value); setTried(false); }}
              status={tried && error ? 'error' : undefined}
              caption={tried && error ? error : email ? 'We send a code to confirm it is yours' : 'The bot of the server sends you a code to confirm it'}
              autoComplete={email ? 'email' : 'off'}
              data-test-id="subscription-value"
            />
            <Button variant="primary" size="lg" width="100%" label="Send the code" type="submit" data-test-id="subscription-send" />
          </form>
        ) : (
          <>
            <p className="og-text">{`We sent a 6-digit code to ${email ? shown : `@${shown} on Discord`}. Any code works in this demo`}</p>
            <OtpInput label="Code" grouped captureTyping onComplete={() => new Promise((r) => setTimeout(r, 600)).then(() => { setStep('value'); setTried(false); onDone(email ? { emailTo: shown } : { discordName: shown }); })} />
            <Button variant="secondary" size="lg" width="100%" label={email ? 'Use another email' : 'Use another name'} onClick={() => setStep('value')} />
          </>
        )}
      </div>
    </Dialog>
  );
}

/** A subscription: what it is, the reward, and the button that turns it on (a check first). When it is on, it says to whom, and can be turned off; the reward stays paid. */
function Subscription({ item }) {
  const store = useStore();
  const { toast } = useToast();
  const [checking, setChecking] = useState(false);
  const on = store.subs[item.id];
  const paid = !!store.subs.paid[item.id];
  const who = item.id === 'email' ? store.subs.emailTo : store.subs.discordName;
  const done = (extra) => {
    const gets = !paid;
    store.setSubscription(item.id, true, extra);
    setChecking(false);
    toast({ message: gets ? `${item.coins} OG Coins credited` : `${item.title} is on`, status: 'success' });
  };
  return (
    <Card variant="surface" padding={5} data-test-id={`subscription-${item.id}`}>
      <div className="og-stack og-stack--related">
        <div className="og-stack og-stack--hair">
          <h3 className="og-h3">{item.title}</h3>
          <p className="og-meta">{item.text}</p>
        </div>
        <Reward coins={item.coins} paid={paid} />
        {on ? (
          <div className="og-stack og-stack--related">
            <p className="og-text og-subs__on" data-test-id="subscription-on"><Icon name="CheckCircle" size={20} filled />{who ? `On for ${item.id === 'discord' ? '@' : ''}${who}` : 'On'}</p>
            {item.sub && <Checkbox label={item.sub.label} checked={store.subs[item.sub.id]} onCheckedChange={(v) => store.setSubscription(item.sub.id, v)} />}
            <Button variant="secondary" size="md" label="Turn off" onClick={() => store.setSubscription(item.id, false)} />
          </div>
        ) : (
          <Button variant="primary" size="lg" label={item.id === 'email' ? 'Subscribe' : 'Connect Discord'} onClick={() => setChecking(true)} data-test-id={`subscription-start-${item.id}`} />
        )}
      </div>
      <CheckDialog item={item} open={checking} onClose={() => setChecking(false)} onDone={done} />
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
      <div className="og-stack og-stack--xl" data-test-id="wallet-page">
        <PageHead crumbs={[{ label: 'Home', href: '#/' }, { label: 'Account', href: '#/account' }, { label: 'Wallet' }]} title="Wallet" meta="1 OG Coin = $1.00" />
        <div className="og-stack">
          <div className="og-amounts-grid">
            <Amount label="Balance" testId="wallet-balance">{money(store.balance)}</Amount>
            <Amount label="OG Coins" testId="wallet-coins"><span className="og-balance__coin"><CashbackMark />{coinsText(store.coins)}</span></Amount>
          </div>
          <Button variant="primary" size="lg" width="100%" label="Top up" icon={<Icon name="Plus" size={20} />} onClick={openTopUp} data-test-id="wallet-top-up-page" />
        </div>
        <Section title="Your terms">
          <Card variant="surface" padding={2}>
            <List aria-label="Your terms" data-test-id="wallet-terms">
              <ListItem avatar={<Pic><Icon name="Coins01" size={24} /></Pic>} subtitle="of every purchase comes back as OG Coins once the order is completed">{`${grade.cashbackPercentage}% cashback`}</ListItem>
              <ListItem avatar={<Pic><Icon name="Wallet01" size={24} /></Pic>} subtitle="of a purchase can be paid with OG Coins">{`Up to ${grade.purchaseLimitPercentage}%`}</ListItem>
              <ListItem avatar={<Pic><RankBadge grade={grade} size={28} /></Pic>} subtitle="The terms depend on your rank" onClick={() => go('/rank')} details={<Icon name="ChevronRight" size={20} />}>{`${grade.name} rank`}</ListItem>
            </List>
          </Card>
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
