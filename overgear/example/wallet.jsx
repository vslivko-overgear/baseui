// The balance of a visitor and the way to top it up. A button in the header (a desktop) and a card in the account tab (a phone) show the money and the OG Coins and open one dialog,
// the top-up, which any of them asks for with openTopUp().
import { useState, useEffect } from '../../src/react.js';
import { Dialog } from '../../src/components/Dialog.jsx';
import { Button } from '../../src/components/Button.jsx';
import { Card } from '../../src/components/Card.jsx';
import { TextInput } from '../../src/components/TextInput.jsx';
import { TokenGroup } from '../../src/components/TokenGroup.jsx';
import { RadioGroup } from '../../src/components/RadioGroup.jsx';
import { Icon } from '../../src/components/Icon.jsx';
import { useToast } from '../../src/components/Toast.jsx';
import { useStore } from './store.jsx';
import { money } from './data.js';
import { CashbackMark } from './ui.jsx';
import { PRESETS, OPEN_TOP_UP, openTopUp, parseAmount, amountError, coinsText } from './wallet-core.js';

const METHODS = [{ value: 'card', label: 'Visa, Mastercard' }, { value: 'paypal', label: 'PayPal' }, { value: 'apple-pay', label: 'Apple Pay' }, { value: 'google-pay', label: 'Google Pay' }];

/** The money and the OG Coins of the visitor, side by side. */
export function Amounts() {
  const store = useStore();
  return (
    <span className="og-amounts">
      <span className="og-amounts__money">{money(store.balance)}</span>
      <span className="og-amounts__coins"><CashbackMark />{coinsText(store.coins)}</span>
    </span>
  );
}

/** The balance in the header of a desktop: the amounts and a plus, one button that opens the top-up. */
export function WalletButton() {
  const store = useStore();
  return (
    <Button variant="secondary" size="md" textSize={14} aria-label={`Balance ${money(store.balance)} and ${coinsText(store.coins)} OG Coins. Top up`} endContent={<Icon name="Plus" size={20} />} onClick={openTopUp}>
      <Amounts />
    </Button>
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

/** The top-up: an amount (a few presets or any amount), a way to pay and the button. It is mounted once and opens on openTopUp(). */
export function TopUpDialog() {
  const store = useStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('25');
  const [method, setMethod] = useState('card');
  const [tried, setTried] = useState(false);
  const [paying, setPaying] = useState(false);
  useEffect(() => {
    const show = () => { setText('25'); setTried(false); setPaying(false); setOpen(true); };
    window.addEventListener(OPEN_TOP_UP, show);
    return () => window.removeEventListener(OPEN_TOP_UP, show);
  }, []);
  const error = amountError(text);
  const amount = parseAmount(text);
  const pay = () => {
    setTried(true);
    if (error) { document.getElementById('og-topup-amount')?.focus(); return; }
    setPaying(true);
    setTimeout(() => {
      store.topUp(amount);
      setPaying(false);
      setOpen(false);
      toast({ message: `${money(amount)} added to your balance`, status: 'success' });
    }, 700);
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !paying && setOpen(o)} title="Top up your balance">
      <form className="og-stack og-stack--lg og-topup" noValidate onSubmit={(e) => { e.preventDefault(); pay(); }}>
        <p className="og-text">{`On your balance now: ${money(store.balance)}`}</p>
        <div className="og-stack og-stack--related">
          <TokenGroup size="sm" aria-label="Amount" value={PRESETS.includes(amount) ? [String(amount)] : []} onValueChange={(v) => v.length && setText(v[v.length - 1])} options={PRESETS.map((n) => ({ value: String(n), label: `$${n}` }))} />
          <TextInput id="og-topup-amount" label="Amount, USD" inputMode="decimal" autoComplete="off" value={text} onChange={(e) => setText(e.target.value)} status={tried && error ? 'error' : undefined} caption={tried && error ? error : `From $5 to $1,000`} />
        </div>
        <RadioGroup label="Pay with" value={method} onValueChange={setMethod} options={METHODS} />
        <Button variant="primary" size="lg" textSize={16} width="100%" type="submit" loading={paying} label={amount != null && !error ? `Pay ${money(amount)}` : 'Pay'} />
      </form>
    </Dialog>
  );
}
