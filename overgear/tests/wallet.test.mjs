// The wallet of the example: what an amount of a top-up may be, and what the wallet becomes after a top-up or the cashback of an order.
import { describe, expect, test } from 'vitest';
import { MAX_AMOUNT, MIN_AMOUNT, PRESETS, WALLET_START, amountError, coinsText, parseAmount, withCoins, withTopUp } from '../example/wallet-core.js';

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
  test('is the percentage of the highest bracket that the amount reaches', async () => {
    const { bonusFor, lowestBonusAmount, BONUS_RULES } = await import('../example/wallet-core.js');
    expect(bonusFor(49)).toBe(null);
    expect(bonusFor(50)).toBe(1.5);
    expect(bonusFor(100)).toBe(5);
    expect(bonusFor(300)).toBe(21);
    expect(bonusFor(1000)).toBe(100);
    expect(bonusFor('')).toBe(null);
    expect(bonusFor('abc')).toBe(null);
    expect(lowestBonusAmount()).toBe(50);
    expect(lowestBonusAmount([])).toBe(100);
    expect(BONUS_RULES.every((r, i, all) => i === 0 || all[i - 1].percentage < r.percentage)).toBe(true);
  });
});
