// The history of the payments of an account (the real service, og-frontend-4: the profile, "Payment History"): a list of transactions with a filter of the direction (any, incoming, outgoing), a switch that shows or hides
// the transactions that are not completed, pages of 20, the status and the amount (+ green for an incoming one, - red for an outgoing one, no sign for one that failed, was cancelled or went to arbitration), and the date.
// Pure functions: the page (transactions.jsx) draws them. The real list comes from the network; here it is made of the orders (the payments for them, the cashback) and of a log that the wallet keeps (top-ups, bonuses, gifts).
import { ORDER_STATUS as S } from './order-core.js';

export const TX_TYPES = { REFILL: 'ACCOUNT_REFILL', PURCHASE: 'PRODUCT_PURCHASE', CASHBACK: 'CASHBACK', GIFT: 'GIFT', COUPON: 'COUPON', REFUND: 'ACCOUNT_REFUND' };
export const TX_STATES = { COMPLETED: 'completed', PENDING: 'pending', FAILED: 'failed', CANCELLED: 'cancelled', ARBITRAGE: 'arbitrage', HOLD: 'hold' };
export const PAGE_SIZE = 20;
/** The states with no money movement (the real service: failed, cancelled, arbitration): the row has no sign and no color of a direction. */
const TERMINAL = [TX_STATES.FAILED, TX_STATES.CANCELLED, TX_STATES.ARBITRAGE];

export const STATE_LABEL = { completed: 'Completed', pending: 'Pending', failed: 'Failed', cancelled: 'Cancelled', arbitrage: 'Arbitrage', hold: 'On hold' };
export const DIRECTION_OPTIONS = [{ value: 'all', label: 'Any type' }, { value: 'incoming', label: 'Incoming' }, { value: 'outgoing', label: 'Outgoing' }];

/** The state of the payment for an order: it is made at the checkout, so it is completed unless the order failed, was cancelled or went to arbitration. */
export const purchaseState = (order) => {
  if (order.status === S.ERROR) return TX_STATES.FAILED;
  if ([S.CANCELLED, S.REJECTED, S.REFUNDED].includes(order.status)) return TX_STATES.CANCELLED;
  if (order.status === S.UNDER_REVIEW) return TX_STATES.ARBITRAGE;
  return TX_STATES.COMPLETED;
};

/**
 * The payments for the orders (outgoing, in dollars) and the cashback for the completed ones (incoming, in OG Coins, 1% of the price).
 * @param {Array<any>} orders
 * @param {(game: string) => string} [gameName] the name of a game by its slug
 */
export const fromOrders = (orders, gameName = () => '') => orders.flatMap((o) => {
  const out = [{ id: `pay-${o.link}`, type: TX_TYPES.PURCHASE, direction: 'outgoing', state: purchaseState(o), amount: o.price, currency: 'USD', orderLink: o.link, description: [gameName(o.game), o.title].filter(Boolean).join(' · '), date: o.createdAt }];
  if ([S.COMPLETED, S.RESOLVED].includes(o.status)) out.push({ id: `cash-${o.link}`, type: TX_TYPES.CASHBACK, direction: 'incoming', state: TX_STATES.COMPLETED, amount: +(o.price * 0.01).toFixed(2), currency: 'COINS', orderLink: o.link, description: o.title, date: o.completedAt ?? o.createdAt });
  return out;
});

/** The entries the wallet writes to its log: a top-up (incoming dollars), the bonus coins of it (a coupon) and a reward (a gift). */
export const refillEntry = (amount, now, state = TX_STATES.COMPLETED) => ({ id: `refill-${now}`, type: TX_TYPES.REFILL, direction: 'incoming', state, amount, currency: 'USD', description: '', date: now });
export const bonusEntry = (coins, now, text = 'Bonus for the top-up') => ({ id: `bonus-${now}`, type: TX_TYPES.COUPON, direction: 'incoming', state: TX_STATES.COMPLETED, amount: coins, currency: 'COINS', description: text, date: now });
export const giftEntry = (coins, now, text) => ({ id: `gift-${now}-${text}`, type: TX_TYPES.GIFT, direction: 'incoming', state: TX_STATES.COMPLETED, amount: coins, currency: 'COINS', description: text, date: now });

const DAY = 864e5;
/** What a browser starts with, so that every state can be seen: a top-up with its bonus, one that failed, one that waits, a gift. */
export const seedLog = (now) => [
  { ...refillEntry(100, now - 40 * DAY), id: 'seed-refill-1' },
  { ...bonusEntry(5, now - 40 * DAY + 1), id: 'seed-bonus-1' },
  { ...refillEntry(50, now - 12 * DAY, TX_STATES.FAILED), id: 'seed-refill-2' },
  { ...refillEntry(25, now - 2 * DAY, TX_STATES.PENDING), id: 'seed-refill-3' },
  { ...giftEntry(3, now - 20 * DAY, 'Welcome gift'), id: 'seed-gift-1' },
];

/** The whole list: the log and what the orders make, the newest first. */
export const transactionsOf = (orders, log, gameName) => [...fromOrders(orders, gameName), ...(log || [])].sort((a, b) => b.date - a.date);

/** The filter of the page: the direction, and whether the transactions that are not completed are shown (they are by default). The incomplete ones are every state but completed. */
export const filterTransactions = (list, { direction = 'all', showIncomplete = true } = {}) => list.filter((t) => (direction === 'all' || t.direction === direction) && (showIncomplete || t.state === TX_STATES.COMPLETED));
export const pagesOf = (count, size = PAGE_SIZE) => (count > 0 ? Math.ceil(count / size) : 0);
export const pageOf = (list, page, size = PAGE_SIZE) => list.slice((page - 1) * size, page * size);

/** The title of a transaction, as in the real service. */
export const titleOf = (t) => {
  switch (t.type) {
    case TX_TYPES.REFILL: return 'Account refill';
    case TX_TYPES.GIFT: return 'Gift';
    case TX_TYPES.COUPON: return 'Coupon';
    case TX_TYPES.REFUND: return 'Account refund';
    case TX_TYPES.CASHBACK: return t.orderLink ? 'Cashback for order #' : 'Cashback';
    case TX_TYPES.PURCHASE: return t.state === TX_STATES.ARBITRAGE ? 'Arbitrage' : 'Payment for the order';
    default: return 'Transaction';
  }
};

/** The direction a row is shown in: a transaction that did not move money has none. */
export const shownDirection = (t) => (TERMINAL.includes(t.state) ? 'default' : t.direction);

/** The sign of the amount: "+" for incoming, "-" for outgoing, nothing for a row with no direction or a zero amount. */
export const signOf = (t) => {
  if (!t.amount) return '';
  const d = shownDirection(t);
  return d === 'incoming' ? '+' : d === 'outgoing' ? '-' : '';
};

/** The number of an amount, two decimals: "24.00". */
export const numberText = (t) => (+t.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** The amount as it is read: "$24.00", or "5.00 OG Coins" for coins (the page draws the mark of the coins for the words). */
export const amountText = (t) => (t.currency === 'COINS' ? `${numberText(t)} OG Coins` : `$${numberText(t)}`);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** The date as the page writes it: "03 Nov 2026 11:08", in the time zone of the viewer (the zone is not written). */
export const dateText = (time) => {
  const d = new Date(time);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
