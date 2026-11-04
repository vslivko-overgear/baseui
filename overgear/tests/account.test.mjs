import { describe, expect, test, it } from 'vitest';
import { MAX_AMOUNT, MIN_AMOUNT, PRESETS, WALLET_START, amountError, coinsText, parseAmount, withCoins, withTopUp, withSubscription, NO_SUBS } from '../example/wallet-core.js';
import { passwordErrors, passwordValid, newError, avatarError, AVATAR_MAX_BYTES } from '../example/settings-core.js';
import { transactionsOf, filterTransactions, pagesOf, pageOf, titleOf, signOf, amountText, shownDirection, purchaseState, refillEntry, seedLog, TX_STATES } from '../example/transactions-core.js';
import { ORDER_STATUS as S } from '../example/order-core.js';
import { GRADES, spentLastYear, gradeFor, progressTo, rankHistory, rankLine } from '../example/rank-core.js';

describe('wallet', () => {
  // The wallet of the example: what an amount of a top-up may be, and what the wallet becomes after a top-up or the cashback of an order.
  describe('the amount of a top-up', () => {
    test('is read as dollars, with or without a sign, spaces and commas, two decimals at most', () => {
      expect(parseAmount('25')).toBe(25);
      expect(parseAmount(' $1,000 ')).toBe(1000);
      expect(parseAmount('12.5')).toBe(12.5);
      expect(parseAmount('12.50')).toBe(12.5);
    });

    test('is nothing when it is not an amount', () => {
      for (const text of ['', ' ', 'abc', '1.234', '-5', '5-', '1e3', '$', null, undefined]) expect(parseAmount(text), String(text)).toBeNull();
    });

    test('may be paid from the minimum to the maximum, and says why when it may not', () => {
      expect(amountError(String(MIN_AMOUNT))).toBeNull();
      expect(amountError(String(MAX_AMOUNT))).toBeNull();
      expect(amountError('4.99')).toMatch(/minimum/);
      expect(amountError('1000.01')).toMatch(/maximum/);
      expect(amountError('abc')).toMatch(/Enter an amount/);
    });

    test('every preset can be paid', () => {
      for (const n of PRESETS) expect(amountError(String(n)), String(n)).toBeNull();
    });
  });

  describe('the wallet', () => {
    test('a new browser starts with a balance and some OG Coins', () => {
      expect(WALLET_START.balance).toBeGreaterThan(0);
      expect(WALLET_START.coins).toBeGreaterThan(0);
    });

    test('a top-up adds to the balance and leaves the coins, without a drift of cents', () => {
      expect(withTopUp({ balance: 48.5, coins: 3.2 }, 25)).toEqual({ balance: 73.5, coins: 3.2 });
      expect(withTopUp({ balance: 0.1, coins: 0 }, 0.2).balance).toBe(0.3);
    });

    test('the cashback of an order adds to the coins and leaves the balance', () => {
      expect(withCoins({ balance: 10, coins: 3.2 }, 0.89)).toEqual({ balance: 10, coins: 4.09 });
      expect(withCoins({ balance: 10, coins: 0.1 }, 0.2).coins).toBe(0.3);
    });

    test('the coins are shown with two decimals', () => {
      expect(coinsText(3.2)).toBe('3.20');
      expect(coinsText(0)).toBe('0.00');
    });
  });

  describe('the bonus for a top-up', () => {
    test('is 5 percent from $100 and 10 percent from $500', async () => {
      const { bonusFor, bonusRateFor, lowestBonusAmount, SUGGESTIONS, BONUS_RULES } = await import('../example/wallet-core.js');
      expect(BONUS_RULES).toEqual([{ refillAmount: 100, percentage: 5 }, { refillAmount: 500, percentage: 10 }]);
      expect(bonusFor(99)).toBe(null);
      expect(bonusFor(100)).toBe(5);
      expect(bonusFor(300)).toBe(15);
      expect(bonusFor(500)).toBe(50);
      expect(bonusFor(1000)).toBe(100);
      expect(bonusFor('')).toBe(null);
      expect(bonusFor('abc')).toBe(null);
      expect(bonusRateFor(99)).toBe(null);
      expect(bonusRateFor(250)).toBe(5);
      expect(bonusRateFor(500)).toBe(10);
      expect(lowestBonusAmount()).toBe(100);
      expect(lowestBonusAmount([])).toBe(100);
      expect(SUGGESTIONS).toEqual([100, 200, 500]);
      expect(SUGGESTIONS.map((n) => bonusRateFor(n))).toEqual([5, 5, 10]);
    });
  });
});

describe('wallet-subs', () => {
  describe('the subscriptions', () => {
    it('pays the reward once, and turning the email off turns its sub-setting off', () => {
      const first = withSubscription(NO_SUBS, 'email', true);
      expect(first.reward).toBe(5);
      const off = withSubscription({ ...first.subs, wishlist: true }, 'email', false);
      expect(off.subs.wishlist).toBe(false);
      expect(withSubscription(off.subs, 'email', true).reward).toBe(0);
    });
  });
});

describe('settings-core', () => {
  describe('the change of the password', () => {
    it('asks for the current password', () => {
      expect(passwordErrors({ current: '', next: 'newpass12', repeat: 'newpass12' }).current).not.toBe('');
    });
    it('checks the length and the letter with a digit of the new one, and that it differs from the current', () => {
      expect(newError('short1', 'x')).toMatch(/at least 8/);
      expect(newError('onlyletters', 'x')).toMatch(/letter and a digit/);
      expect(newError('12345678', 'x')).toMatch(/letter and a digit/);
      expect(newError('samepass1', 'samepass1')).toMatch(/differ/);
      expect(newError('newpass12', 'oldpass1')).toBe('');
    });
    it('checks the repeat', () => {
      expect(passwordErrors({ current: 'a', next: 'newpass12', repeat: 'other' }).repeat).not.toBe('');
      expect(passwordValid({ current: 'oldpass1', next: 'newpass12', repeat: 'newpass12' })).toBe(true);
    });
  });
});

describe('transactions-core', () => {
  const now = Date.UTC(2026, 5, 1);
  const order = (link, status, price = 10, createdAt = now) => ({ link, status, price, title: 'Order', game: 'wow', createdAt, completedAt: status === S.COMPLETED ? createdAt + 1 : null });

  describe('the payment history', () => {
    it('makes a payment for each order, and a cashback for a completed one', () => {
      const list = transactionsOf([order('a', S.COMPLETED, 200), order('b', S.IN_PROGRESS)], [], () => 'Game');
      expect(list.map((t) => t.type).sort()).toEqual(['CASHBACK', 'PRODUCT_PURCHASE', 'PRODUCT_PURCHASE']);
      expect(list.find((t) => t.type === 'CASHBACK').amount).toBe(2);
    });
    it('gives the state of a payment by the order', () => {
      expect(purchaseState(order('a', S.ERROR))).toBe('failed');
      expect(purchaseState(order('a', S.CANCELLED))).toBe('cancelled');
      expect(purchaseState(order('a', S.UNDER_REVIEW))).toBe('arbitrage');
      expect(purchaseState(order('a', S.IN_PROGRESS))).toBe('completed');
    });
    it('filters by the direction and hides the incomplete ones', () => {
      const list = transactionsOf([order('a', S.COMPLETED)], seedLog(now));
      expect(filterTransactions(list, { direction: 'outgoing' }).every((t) => t.direction === 'outgoing')).toBe(true);
      expect(filterTransactions(list, { showIncomplete: false }).every((t) => t.state === TX_STATES.COMPLETED)).toBe(true);
      expect(filterTransactions(list, { showIncomplete: false }).length).toBeLessThan(filterTransactions(list).length);
    });
    it('cuts pages of twenty', () => {
      const list = Array.from({ length: 45 }, (_, i) => i);
      expect(pagesOf(45)).toBe(3);
      expect(pagesOf(0)).toBe(0);
      expect(pageOf(list, 3)).toHaveLength(5);
    });
    it('writes the title, the sign and the amount as the real service', () => {
      expect(titleOf({ type: 'ACCOUNT_REFILL' })).toBe('Account refill');
      expect(titleOf({ type: 'PRODUCT_PURCHASE', state: 'arbitrage' })).toBe('Arbitrage');
      expect(signOf({ amount: 5, direction: 'incoming', state: 'completed' })).toBe('+');
      expect(signOf({ amount: 5, direction: 'outgoing', state: 'completed' })).toBe('-');
      expect(signOf({ amount: 5, direction: 'incoming', state: 'failed' })).toBe('');
      expect(signOf({ amount: 0, direction: 'incoming', state: 'completed' })).toBe('');
      expect(shownDirection({ direction: 'outgoing', state: 'cancelled' })).toBe('default');
      expect(amountText({ amount: 1234.5, currency: 'USD' })).toBe('$1,234.50');
      expect(amountText({ amount: 5, currency: 'COINS' })).toBe('5.00 OG Coins');
      expect(refillEntry(10, now).direction).toBe('incoming');
    });
  });
});

describe('rank-core', () => {
  const DAY = 864e5;
  const now = Date.UTC(2026, 5, 1);
  const done = (price, daysAgo) => ({ status: 'status/COMPLETED', price, createdAt: now - daysAgo * DAY });

  describe('rank-core', () => {
    it('counts only completed orders of the last 365 days', () => {
      const orders = [done(100, 10), done(200, 400), { status: 'status/PAID', price: 50, createdAt: now - DAY }];
      expect(spentLastYear(orders, now)).toBe(100);
    });
    it('picks the highest reached rank', () => {
      expect(gradeFor(0).code).toBe('guardian');
      expect(gradeFor(100).code).toBe('gladiator');
      expect(gradeFor(1000).code).toBe('epic-hero');
      expect(gradeFor(99999).code).toBe('legend');
    });
    it('shows the way to the next rank', () => {
      const p = progressTo(50, GRADES[0]);
      expect(p.left).toBe(50);
      expect(p.percentage).toBe(50);
      expect(progressTo(20000, GRADES[6]).isMax).toBe(true);
    });
    it('builds the history, newest first, with a fall back when old orders leave the year', () => {
      const h = rankHistory([done(120, 400)], now);
      expect(h.map((e) => e.grade.code)).toEqual(['guardian', 'gladiator']);
    });
    it('writes the line of the account', () => {
      expect(rankLine(GRADES[1])).toBe('Rank: Gladiator');
    });
  });
});

describe('avatar of the account', () => {
  test('an image up to 5 MB will do, anything else gets a reason', () => {
    expect(avatarError({ type: 'image/png', size: 1000 })).toBe('');
    expect(avatarError({ type: 'image/jpeg', size: AVATAR_MAX_BYTES })).toBe('');
    expect(avatarError({ type: 'image/png', size: AVATAR_MAX_BYTES + 1 })).toMatch(/larger/);
    expect(avatarError({ type: 'application/pdf', size: 10 })).toMatch(/image/);
    expect(avatarError(undefined)).toMatch(/Choose/);
  });
});

