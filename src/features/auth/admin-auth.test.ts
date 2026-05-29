import { describe, expect, it } from 'vitest';
import { getAdminRedirectPath, isAdminRole, normalizeLoginEmail } from './admin-auth';

describe('admin auth helpers', () => {
  it('normalizes admin login email before authentication', () => {
    expect(normalizeLoginEmail('  9172512400n@GMAIL.COM  ')).toBe('9172512400n@gmail.com');
  });

  it('allows dispatcher, admin, and super admin roles into the admin panel', () => {
    expect(isAdminRole('DISPATCHER')).toBe(true);
    expect(isAdminRole('ADMIN')).toBe(true);
    expect(isAdminRole('SUPER_ADMIN')).toBe(true);
    expect(isAdminRole('CUSTOMER')).toBe(false);
    expect(isAdminRole('DRIVER')).toBe(false);
  });

  it('routes admin roles to dispatch and non-admin roles away from the panel', () => {
    expect(getAdminRedirectPath('ADMIN')).toBe('/admin/dispatch');
    expect(getAdminRedirectPath('SUPER_ADMIN')).toBe('/admin/dispatch');
    expect(getAdminRedirectPath('DRIVER')).toBe('/driver');
    expect(getAdminRedirectPath('CUSTOMER')).toBe('/customer');
  });
});
