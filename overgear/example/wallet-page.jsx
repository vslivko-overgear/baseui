// The wallet: what is on the account (the money and the OG Coins), how coins are acquired and used, and the ways to get more. The rank decides the cashback and the limit of payment with coins, so they are read from it.
import { Badge } from '../../src/components/Badge.jsx';
import { Button } from '../../src/components/Button.jsx';
import { Card } from '../../src/components/Card.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { Status } from '../../src/components/Status.jsx';
import { useToast } from '../../src/components/Toast.jsx';
import { money } from './data.js';
import { Page, PageHead, Section } from './ui.jsx';
import { useStore } from './store.jsx';
import { useRank } from './rank.jsx';
import { BalanceCard } from './wallet.jsx';
import { BONUS_RULES, openTopUp } from './wallet-core.js';

export function WalletPage({ onLogin }) {
  const store = useStore();
  const { grade } = useRank();
  const toast = useToast();
  if (!store.user) return <Page fill><Status status="neutral" icon={<Icon name="Wallet01" size={28} />} title="Sign in to see your wallet" description="Your balance and OG Coins are kept in your account" actionLabel="Sign in" onAction={onLogin} /></Page>;
  return (
    <Page bar>
      <div className="og-stack og-stack--xl" data-test-id="wallet-page">
        <PageHead crumbs={[{ label: 'Home', href: '#/' }, { label: 'Account', href: '#/account' }, { label: 'Wallet' }]} title="Wallet" meta="Your balance and OG Coins" />
        <BalanceCard />
        <Section title="OG Coins">
          <div className="og-stack og-stack--lg" data-test-id="wallet-coins">
            <p className="og-text">1 OG Coin = $1.00</p>
            <div className="og-stack og-stack--close">
              <h3 className="og-h3">How can I acquire OG Coins?</h3>
              <ul className="og-bullets">
                <li><span>{`Top up your Overgear Wallet: ${BONUS_RULES.map((r) => `+${r.percentage}% bonus on deposits over ${money(r.refillAmount).replace('.00', '')}`).join(', ')}`}</span></li>
                <li><span>{`Earn ${grade.cashbackPercentage}% cashback in OG Coin on all purchases, credited after order completion`}</span></li>
              </ul>
            </div>
            <div className="og-stack og-stack--close">
              <h3 className="og-h3">How can I use it?</h3>
              <p className="og-text">{`OG Coins can cover up to ${grade.purchaseLimitPercentage}% of your purchase costs`}</p>
            </div>
          </div>
        </Section>
        <Section title="Ways to get OG Coins">
          <div className="og-stack">
            <Card variant="surface" padding={5}>
              <div className="og-stack og-stack--related" data-test-id="wallet-way-topup">
                <div className="og-stack og-stack--hair"><h3 className="og-h3">Receive up to 10%</h3><span className="og-meta">when you top up</span></div>
                <div className="og-row">{BONUS_RULES.map((r) => <Badge key={r.refillAmount} variant="warning-light" size="md" label={`${r.percentage}% for ${money(r.refillAmount).replace('.00', '')}+`} />)}</div>
                <Button variant="primary" size="lg" width="100%" label="Top up" onClick={() => openTopUp()} />
              </div>
            </Card>
            <Card variant="surface" padding={5}>
              <div className="og-stack og-stack--related" data-test-id="wallet-way-subscribe">
                <div className="og-stack og-stack--hair"><h3 className="og-h3">Gain 10 OG Coins</h3><span className="og-meta">for newsletter subscription</span></div>
                <div className="og-row"><Badge variant="warning-light" size="md" label="$5 for Discord" /><Badge variant="warning-light" size="md" label="$5 for email" /></div>
                <Button variant="secondary" size="lg" width="100%" label="Subscribe" onClick={() => toast({ message: 'You are subscribed (a demo: nothing was sent)', status: 'success' })} />
              </div>
            </Card>
          </div>
        </Section>
      </div>
    </Page>
  );
}
