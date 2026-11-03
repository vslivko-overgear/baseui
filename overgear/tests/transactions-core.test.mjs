import { describe, it, expect } from 'vitest';
import { transactionsOf, filterTransactions, pagesOf, pageOf, titleOf, signOf, amountText, shownDirection, purchaseState, refillEntry, seedLog, TX_STATES } from '../example/transactions-core.js';
import { ORDER_STATUS as S } from '../example/order-core.js';

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
