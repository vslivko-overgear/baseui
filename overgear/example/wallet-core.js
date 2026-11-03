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
export const BONUS_RULES = [{ refillAmount: 50, percentage: 3 }, { refillAmount: 100, percentage: 5 }, { refillAmount: 250, percentage: 7 }, { refillAmount: 500, percentage: 10 }];
export const PURCHASE_LIMIT = 15;
/** The coins a top-up of `amount` gives: the percentage of the highest bracket that the amount reaches; null when it reaches none (the real service says so, and offers the amount that does). */
export const bonusFor = (amount, rules = BONUS_RULES) => {
  const n = Number(amount);
  if (amount === '' || amount == null || Number.isNaN(n) || !rules.length) return null;
  const hit = rules.reduce((best, r) => (r.refillAmount <= n && r.refillAmount > (best?.refillAmount || 0) ? r : best), undefined);
  return hit?.percentage ? Math.round((n / 100) * hit.percentage * 100) / 100 : null;
};
/** The smallest top-up that gives a bonus. */
export const lowestBonusAmount = (rules = BONUS_RULES) => rules.reduce((min, r) => Math.min(min, r.refillAmount), rules[0]?.refillAmount ?? 100);

/** The top-up dialog opens on this event, so any place can open it without owning its state. */
export const OPEN_TOP_UP = 'og:open-top-up';
export const openTopUp = () => window.dispatchEvent(new Event(OPEN_TOP_UP));
