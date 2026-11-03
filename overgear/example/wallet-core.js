// The wallet of a visitor: the balance in money, the OG Coins (the cashback of the orders), and what the top-up asks. Pure functions, so they are tested without a browser.

/** What a new browser starts with, so the balance of the demo is not empty. */
export const WALLET_START = { balance: 48.5, coins: 3.2 };
export const PRESETS = [10, 25, 50, 100];
export const MIN_AMOUNT = 5;
export const MAX_AMOUNT = 1000;

/** The amount typed as a number of dollars (a dollar sign, spaces and commas are allowed, two decimals at most), or null when it is not an amount. */
export function parseAmount(text) {
  const t = String(text ?? '').replace(/[,\s$]/g, '');
  return /^\d+(\.\d{1,2})?$/.test(t) ? +t : null;
}

/** What is wrong with the amount, in a sentence for the field, or null when it can be paid. */
export function amountError(text) {
  const n = parseAmount(text);
  if (n == null) return 'Enter an amount, for example 25';
  if (n < MIN_AMOUNT) return `The minimum is $${MIN_AMOUNT}`;
  if (n > MAX_AMOUNT) return `The maximum is $${MAX_AMOUNT.toLocaleString('en-US')}`;
  return null;
}

const cents = (n) => Math.round(n * 100) / 100;
/** The wallet after a top-up. */
export const withTopUp = (wallet, amount) => ({ ...wallet, balance: cents(wallet.balance + amount) });
/** The wallet after the cashback of an order is paid in OG Coins. */
export const withCoins = (wallet, coins) => ({ ...wallet, coins: cents(wallet.coins + coins) });

export const coinsText = (n) => n.toFixed(2);

// The bonus for a top-up, as the real service has it (its backend gives the brackets; these are the example's): from a top-up of `refillAmount` dollars the buyer gets `percentage` percent of it in OG Coins.
// One coin is one dollar, and coins pay up to PURCHASE_LIMIT percent of a shop product (never a discounted one, or one with a promo code).
export const BONUS_RULES = [{ refillAmount: 100, percentage: 5 }, { refillAmount: 500, percentage: 10 }];
export const PURCHASE_LIMIT = 15;
/** The bracket of the highest percentage that `amount` reaches, or undefined. */
const bracketOf = (amount, rules) => {
  const n = Number(amount);
  if (amount === '' || amount == null || Number.isNaN(n) || !rules.length) return undefined;
  return rules.reduce((best, r) => (r.refillAmount <= n && r.refillAmount > (best?.refillAmount || 0) ? r : best), undefined);
};
/** The coins a top-up of `amount` gives: the percentage of the highest bracket that the amount reaches; null when it reaches none (the real service says so, and offers the amount that does). */
export const bonusFor = (amount, rules = BONUS_RULES) => {
  const hit = bracketOf(amount, rules);
  return hit?.percentage ? Math.round((Number(amount) / 100) * hit.percentage * 100) / 100 : null;
};
/** The percent that the bonus of `amount` is, or null. */
export const bonusRateFor = (amount, rules = BONUS_RULES) => bracketOf(amount, rules)?.percentage ?? null;
/** The amounts the top-up suggests, each with the percent of its bonus (`bonusRateFor`). */
export const SUGGESTIONS = [100, 200, 500];
/** The smallest top-up that gives a bonus. */
export const lowestBonusAmount = (rules = BONUS_RULES) => rules.reduce((min, r) => Math.min(min, r.refillAmount), rules[0]?.refillAmount ?? 100);

/** The top-up dialog opens on this event, so any place can open it without owning its state. */
export const OPEN_TOP_UP = 'og:open-top-up';
export const openTopUp = () => window.dispatchEvent(new Event(OPEN_TOP_UP));

/** The rewards for subscriptions (the real service: "Get 10 Coins for subscriptions"): the Discord notifications and the email updates give 5 coins each, once. The email has a sub-setting, the notifications about the wishlist. */
export const SUBSCRIPTIONS = [
  { id: 'discord', title: 'Discord notifications', text: 'Join our Discord for exclusive chats, tips, and much more', coins: 5 },
  { id: 'email', title: 'Email Updates', text: 'Subscribe to get the latest updates, tips, and exclusive offers', coins: 5, sub: { id: 'wishlist', label: 'Notifications about wishlist items' } },
];
export const NO_SUBS = { discord: false, email: false, wishlist: false, paid: {} };

/** Turns a subscription on or off. The reward is given the first time it is turned on, and never twice; turning the email off turns its sub-setting off. Returns the new settings and the coins to credit. */
export function withSubscription(subs, id, on) {
  const next = { ...NO_SUBS, ...subs, paid: { ...(subs?.paid || {}) } };
  next[id] = on;
  if (id === 'email' && !on) next.wishlist = false;
  const coins = SUBSCRIPTIONS.find((s) => s.id === id)?.coins ?? 0;
  const reward = on && coins && !next.paid[id] ? coins : 0;
  if (reward) next.paid[id] = true;
  return { subs: next, reward };
}

/** The checks of the subscription flow: the email, and the name of the Discord account (2 to 32 letters, digits, dots or underscores, the leading @ is allowed). An empty text is the answer for a valid value. */
export const emailError = (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || '').trim()) ? '' : 'Enter an email we can send the code to');
export const discordError = (value) => {
  const name = String(value || '').trim().replace(/^@/, '');
  if (!name) return 'Enter your Discord username';
  return /^[a-z0-9_.]{2,32}$/i.test(name) ? '' : 'Use 2 to 32 letters, digits, dots or underscores';
};
