// The balance of a visitor and the way to top it up. A button in the header (a desktop) and a card in the account tab (a phone) show the money and the OG Coins and open one dialog,
// the top-up, which any of them asks for with openTopUp().
import { useState, useEffect, useRef } from '../../src/react.js';
import { Dialog } from '../../src/components/Dialog.jsx';
import { Button } from '../../src/components/Button.jsx';
import { Card } from '../../src/components/Card.jsx';
import { TokenGroup } from '../../src/components/TokenGroup.jsx';
import { Link } from '../../src/components/Link.jsx';
import { Popover } from '../../src/components/Popover.jsx';
import { TextInput } from '../../src/components/TextInput.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { useToast } from '../../src/components/Toast.jsx';
import { useStore } from './store.jsx';
import { money } from './data.js';
import { Badge } from '../../src/components/Badge.jsx';
import { CashbackMark } from './ui.jsx';
import { OPEN_TOP_UP, openTopUp, parseAmount, amountError, coinsText, bonusFor, bonusRateFor, lowestBonusAmount, SUGGESTIONS, PURCHASE_LIMIT } from './wallet-core.js';

/** The money and the OG Coins of the visitor, side by side. */
export function Amounts() {
  const store = useStore();
  return (
    <span className="og-amounts">
      <span className="og-amounts__coins"><Icon name="PlusCircle" size={20} filled />{money(store.balance)}</span>
      <span className="og-amounts__coins"><CashbackMark />{coinsText(store.coins)}</span>
    </span>
  );
}

/** The balance in the header of a desktop: the amounts in one button. With a mouse a card opens (after 200 ms, and stays 150 ms after the mouse leaves) with the balance, the OG Coins, the top-up and what the coins are;
 *  a click on the button itself opens the top-up at once (the card has the same button). */
export function WalletButton() {
  const store = useStore();
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const hover = (on) => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(on), on ? 200 : 150); };
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <Popover open={open} onOpenChange={(o) => { clearTimeout(timer.current); setOpen(o); }} placement="bottom-end" label="Your balance" trigger={(props) => (
      <Button {...props} className="og-wallet-btn" variant="ghost" size="md" textSize={14} aria-label={`Balance ${money(store.balance)} and ${coinsText(store.coins)} OG Coins`} onMouseEnter={() => hover(true)} onMouseLeave={() => hover(false)} onClick={() => { clearTimeout(timer.current); setOpen(false); openTopUp(); }}>
        <Amounts />
      </Button>
    )}>
      <div className="og-wallet" onMouseEnter={() => hover(true)} onMouseLeave={() => hover(false)} data-test-id="wallet-card">
        <dl className="og-info">
          <div className="og-info__row"><dt>Your balance</dt><dd>{money(store.balance)}</dd></div>
          <div className="og-info__row"><dt>OG Coins</dt><dd className="og-wallet__coins"><CashbackMark />{coinsText(store.coins)}</dd></div>
        </dl>
        <Button variant="primary" size="md" width="100%" label="Top Up Balance" onClick={() => { clearTimeout(timer.current); setOpen(false); openTopUp(); }} data-test-id="wallet-top-up" />
        <div className="og-stack og-stack--close og-wallet__note">
          <p>1 coin = $1. Coins can be used for purchases</p>
          <Link href="https://loyalty.overgear.com/" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} data-test-id="wallet-loyalty">More about loyalty</Link>
        </div>
      </div>
    </Popover>
  );
}

/** The balance in the account tab of a phone: what is on the account, and the button to top it up. */
export function BalanceCard() {
  const store = useStore();
  return (
    <Card variant="surface" padding={5}>
      <div className="og-stack og-stack--related">
        <div className="og-balance">
          <div className="og-stack og-stack--hair"><p className="og-meta">Balance</p><p className="og-balance__money">{money(store.balance)}</p></div>
          <div className="og-stack og-stack--hair og-balance__coins"><p className="og-meta">OG Coins</p><p className="og-balance__coin"><CashbackMark />{coinsText(store.coins)}</p></div>
        </div>
        <Button variant="primary" size="md" width="100%" label="Top up" icon={<Icon name="Plus" size={20} />} onClick={openTopUp} />
      </div>
    </Card>
  );
}

/** The top-up, as the real service has it: an amount, the bonus coins that this amount gives (or the amount that gives one), the brackets of the bonus, what the coins are, and the button. It has no choice of a payment
 *  system (the real one is on the page the button leads to). It is mounted once and opens on openTopUp(). */
export function TopUpDialog() {
  const store = useStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('100');
  const [tried, setTried] = useState(false);
  const [paying, setPaying] = useState(false);
  useEffect(() => {
    const show = () => { setText('100'); setTried(false); setPaying(false); setOpen(true); };
    window.addEventListener(OPEN_TOP_UP, show);
    return () => window.removeEventListener(OPEN_TOP_UP, show);
  }, []);
  const error = amountError(text);
  const amount = parseAmount(text);
  const bonus = amount != null ? bonusFor(amount) : null;
  const lowest = lowestBonusAmount();
  const pay = () => {
    setTried(true);
    if (error) { document.getElementById('og-topup-amount')?.focus(); return; }
    setPaying(true);
    setTimeout(() => {
      store.topUp(amount, bonus || 0);
      setPaying(false);
      setOpen(false);
      toast({ message: bonus ? `${money(amount)} added to your balance, and ${coinsText(bonus)} OG Coins` : `${money(amount)} added to your balance`, status: 'success' });
    }, 700);
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !paying && setOpen(o)} title="Top Up Balance">
      <form className="og-stack og-stack--lg og-topup" noValidate onSubmit={(e) => { e.preventDefault(); pay(); }}>
        <div className="og-stack og-stack--close">
          <TextInput id="og-topup-amount" label="Amount, USD" inputMode="decimal" autoComplete="off" prefix="$" value={text} onChange={(e) => setText(e.target.value)} status={tried && error ? 'error' : undefined} caption={tried && error ? error : undefined} />
          <TokenGroup size="sm" aria-label="Amount suggestions" value={SUGGESTIONS.includes(amount) ? [String(amount)] : []} onValueChange={(v) => v.length && setText(v[v.length - 1])} options={SUGGESTIONS.map((n) => ({ value: String(n), label: <span className="og-topup__chip">{`$${n}`}<Badge variant="warning-light" size="sm" label={`+${bonusRateFor(n)}%`} icon={<CashbackMark />} /></span> }))} />
        </div>
        <div className="og-stack og-stack--close">
        <div className="og-topup__box" data-test-id="topup-bonus">
          {bonus ? (
            <>
              <span className="og-topup__what"><span className="og-meta">As a bonus, you will receive</span><strong className="og-topup__coins"><CashbackMark />{`${coinsText(bonus)} OG Coins`}</strong></span>
              <strong className="og-topup__rate" data-test-id="topup-rate">{`${bonusRateFor(amount)}%`}</strong>
            </>
          ) : (
            <>
              <span className="og-text">{`Top up from $${lowest} to get bonus coins`}</span>
              <Button type="button" variant="primary" size="sm" label="Get bonus" onClick={() => setText(String(lowest))} data-test-id="topup-get-bonus" />
            </>
          )}
        </div>
        <p className="og-topup__rules">{`One coin is equal to $1. Pay up to ${PURCHASE_LIMIT}% of shop products and currencies. Cannot be applied with discounted items and promotional codes`}</p>
        </div>
        <Button variant="primary" size="lg" textSize={16} width="100%" type="submit" loading={paying} label="Top up" data-test-id="topup-submit" />
      </form>
    </Dialog>
  );
}
