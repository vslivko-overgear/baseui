// The cashback of Overgear: the mark of OG Coins, the tag that shows a bonus and explains itself, and the share of an order paid back. A component of the sublibrary:
// it depends on baseui only (Hint, Badge), never on the example, so every product of Overgear draws the same tag.
import { Hint } from '../../src/components/Hint.jsx';
import { Badge } from '../../src/components/Badge.jsx';

// the cashback mark from the Overgear UI icons (CashbackBadgeIcon): a gold hexagon with a shield
export function CashbackMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <g clipPath="url(#og-cashback-clip)">
        <path fill="url(#og-cashback-gradient)" d="M6.96.242a2.36 2.36 0 0 1 2.08 0l4.494 2.202A2.43 2.43 0 0 1 14.83 4.1l1.11 4.95a2.47 2.47 0 0 1-.463 2.063l-3.11 3.97a2.38 2.38 0 0 1-1.873.918H5.506a2.38 2.38 0 0 1-1.873-.918l-3.11-3.97A2.47 2.47 0 0 1 .06 9.05l1.11-4.95a2.43 2.43 0 0 1 1.296-1.655z" />
        <path fill="#191A29" d="M12.584 4.578c-1.988-.7-3.228-.841-4.585-.841s-2.593.137-4.588.844a.27.27 0 0 0-.182.257c0 5.193 3.52 8.395 4.595 9.25a.28.28 0 0 0 .343.004c.686-.542 3.009-2.563 4.06-5.818a.28.28 0 0 0-.04-.239s-.004-.007-.008-.01a.3.3 0 0 0-.11-.087 10.179 10.179 0 0 0-4.023-.827h-.05a.274.274 0 0 0-.274.271v1.386c0 .148.124.27.274.27h.047a8 8 0 0 1 1.667.174 10.1 10.1 0 0 1-1.714 2.397 10 10 0 0 1-2.707-5.577c.92-.249 1.81-.371 2.71-.371.901 0 1.904.148 2.903.425l.033.011q.766.218 1.353.47a.3.3 0 0 0 .245-.011.28.28 0 0 0 .138-.199q.104-.754.102-1.52a.27.27 0 0 0-.182-.256z" />
      </g>
      <defs>
        <linearGradient id="og-cashback-gradient" x1="2.37" x2="12.153" y1="13.434" y2="2.021" gradientUnits="userSpaceOnUse"><stop stopColor="#B9843D" /><stop offset="0.563" stopColor="#F5D56B" /><stop offset="1" stopColor="#FEFBAD" /></linearGradient>
        <clipPath id="og-cashback-clip"><path fill="#fff" d="M0 0h16v16H0z" /></clipPath>
      </defs>
    </svg>
  );
}
/** The words that explain the cashback: the hint of the line of the summary and of every tag of it. */
export const CASHBACK_HINT = 'Cashback is credited to your balance in OG Coins after the order is completed';

/** A tag of the cashback (light yellow, the amount and the mark of OG Coins at its end, close to it): it explains itself, a tooltip with a mouse and a dialog on a phone. Every tag of the cashback is this one. */
export function CashbackTag({ label, size = 'md', hint = CASHBACK_HINT }) {
  return <Hint label={`About the bonus, ${label}`} content={hint}><Badge variant="warning" light size={size} label={<span className="og-cbtag">{label}<CashbackMark /></span>} /></Hint>;
}

/** The cashback of an order, in percent of its price (paid in OG Coins). */
export const CASHBACK = 1;
export const cashbackOf = (amount) => (amount * CASHBACK / 100).toFixed(2);
