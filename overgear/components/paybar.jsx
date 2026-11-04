// The pay bar of Overgear: what is to pay (the price and the bonus tag) and the button that pays. On a phone it is pinned to the bottom of the screen; inline it is the foot of a panel.
// A pinned bar keeps the room it takes by itself: it measures its height and gives it to the page (--og-paybar-room, the bottom padding of the body), so nothing of the page
// stays under it, whatever the page, its footer or the height of the bar. Depends on baseui only.
import { useEffect, useRef } from '../../src/react.js';
import { Button } from '../../src/components/Button.jsx';
import { CashbackTag, cashbackOf } from './cashback.jsx';
import { money } from './money.js';

/** The room a pinned bar takes, on the root of the document while it is there: its height (the page adds it to its bottom padding). */
function useRoom(ref, on) {
  useEffect(() => {
    const el = ref.current;
    if (!on || !el) return undefined;
    const root = document.documentElement;
    const set = () => root.style.setProperty('--og-paybar-room', `${Math.ceil(el.getBoundingClientRect().height)}px`);
    set();
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(set);
    ro?.observe(el);
    return () => { ro?.disconnect(); root.style.removeProperty('--og-paybar-room'); };
  }, [ref, on]);
}

/** The bar that is pinned to the bottom of the screen of a phone: what is to pay and the button that pays. `above` lifts it over the bottom bar of the tabs (the cart); the checkout has none. `inline`: the foot of a panel, not pinned. */
export function PayBar({ amount, action, onClick, above, inline = false }) {
  const ref = useRef(null);
  useRoom(ref, !inline);
  return (
    <div ref={ref} className={inline ? 'og-paybar og-paybar--inline' : 'og-paybar'} data-pinned={inline ? undefined : ''} style={inline ? undefined : { '--og-paybar-bottom': above ? 'var(--og-bottom)' : '0px' }}>
      <PayBarContent amount={amount} action={action} onClick={onClick} />
    </div>
  );
}

/** What is in the pay bar: the price with the bonus tag next to it, then the button. The footer of the dialog of the mini-cart on a phone holds it as well. */
export function PayBarContent({ amount, action, onClick }) {
  return (
    <div className="og-paybar__in">
      <p className="og-paybar__sum"><span className="og-paybar__amount">{money(amount)}</span><CashbackTag size="lg" label={`+${cashbackOf(amount)}`} /></p>
      <Button variant="primary" size="lg" textSize={16} label={action} onClick={onClick} />
    </div>
  );
}
