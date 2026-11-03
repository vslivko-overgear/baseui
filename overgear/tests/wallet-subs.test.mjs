import { describe, it, expect } from 'vitest';
import { emailError, discordError, withSubscription, NO_SUBS } from '../example/wallet-core.js';

describe('the subscription flow', () => {
  it('checks the email', () => {
    expect(emailError('dana@example.com')).toBe('');
    expect(emailError('bad')).not.toBe('');
    expect(emailError('')).not.toBe('');
  });
  it('checks the name of the Discord account', () => {
    expect(discordError('@dana_01')).toBe('');
    expect(discordError('d')).not.toBe('');
    expect(discordError('has space')).not.toBe('');
    expect(discordError('')).not.toBe('');
  });
  it('pays the reward once, and turning the email off turns its sub-setting off', () => {
    const first = withSubscription(NO_SUBS, 'email', true);
    expect(first.reward).toBe(5);
    const off = withSubscription({ ...first.subs, wishlist: true }, 'email', false);
    expect(off.subs.wishlist).toBe(false);
    expect(withSubscription(off.subs, 'email', true).reward).toBe(0);
  });
});
