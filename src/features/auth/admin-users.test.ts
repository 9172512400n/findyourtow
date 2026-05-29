import { describe, expect, it } from 'vitest';
import { getBearerToken, mergeAuthUsersWithAppUsers, validateResetPasswordInput } from './admin-users';

describe('admin user support helpers', () => {
  it('extracts bearer token from authorization header', () => {
    expect(getBearerToken('Bearer abc.def')).toBe('abc.def');
    expect(getBearerToken('Basic nope')).toBeNull();
    expect(getBearerToken(null)).toBeNull();
  });

  it('merges auth users with FindYourTow app roles and profile names', () => {
    const users = mergeAuthUsersWithAppUsers(
      [{ id: 'auth-1', email: 'person@example.com', created_at: '2026-01-01T00:00:00Z', last_sign_in_at: '2026-01-02T00:00:00Z' }],
      [{ id: 'auth-1', email: 'person@example.com', role: 'CUSTOMER', profile: { firstName: 'Road', lastName: 'User' } }],
    );

    expect(users).toEqual([{ id: 'auth-1', email: 'person@example.com', role: 'CUSTOMER', name: 'Road User', createdAt: '2026-01-01T00:00:00Z', lastSignInAt: '2026-01-02T00:00:00Z' }]);
  });

  it('requires a strong enough reset password', () => {
    expect(validateResetPasswordInput({ userId: 'u1', password: 'short' })).toEqual({ ok: false, message: 'Password must be at least 8 characters.' });
    expect(validateResetPasswordInput({ userId: '', password: 'long-enough' })).toEqual({ ok: false, message: 'User id is required.' });
    expect(validateResetPasswordInput({ userId: 'u1', password: 'long-enough' })).toEqual({ ok: true });
  });
});
