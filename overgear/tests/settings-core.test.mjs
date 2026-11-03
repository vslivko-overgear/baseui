import { describe, it, expect } from 'vitest';
import { passwordErrors, passwordValid, newError } from '../example/settings-core.js';

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
