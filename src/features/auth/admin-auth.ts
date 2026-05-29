export type AppUserRole = 'CUSTOMER' | 'DRIVER' | 'DISPATCHER' | 'ADMIN' | 'SUPER_ADMIN';

const ADMIN_ROLES = new Set<AppUserRole>(['DISPATCHER', 'ADMIN', 'SUPER_ADMIN']);

export function normalizeLoginEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isAdminRole(role: AppUserRole | string | null | undefined): role is 'DISPATCHER' | 'ADMIN' | 'SUPER_ADMIN' {
  return Boolean(role && ADMIN_ROLES.has(role as AppUserRole));
}

export function getAdminRedirectPath(role: AppUserRole | string | null | undefined) {
  if (isAdminRole(role)) return '/admin/dispatch';
  if (role === 'DRIVER') return '/driver';
  return '/customer';
}
