import { describe, it, expect } from 'vitest';
import { withSubscription, NO_SUBS } from '../example/wallet-core.js';

describe('the subscriptions', () => {
  it('pays the reward once, and turning the email off turns its sub-setting off', () => {
    const first = withSubscription(NO_SUBS, 'email', true);
    expect(first.reward).toBe(5);
    const off = withSubscription({ ...first.subs, wishlist: true }, 'email', false);
    expect(off.subs.wishlist).toBe(false);
    expect(withSubscription(off.subs, 'email', true).reward).toBe(0);
  });
});
