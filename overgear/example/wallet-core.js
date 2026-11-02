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

/** The top-up dialog opens on this event, so any place can open it without owning its state. */
export const OPEN_TOP_UP = 'og:open-top-up';
export const openTopUp = () => window.dispatchEvent(new Event(OPEN_TOP_UP));
