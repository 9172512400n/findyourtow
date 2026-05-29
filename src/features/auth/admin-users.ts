import type { AppUserRole } from './admin-auth';

export type AuthUserSummary = {
  id: string;
  email?: string;
  created_at?: string;
  last_sign_in_at?: string | null;
};

export type AppUserSummary = {
  id: string;
  email: string;
  role: AppUserRole | string;
  profile?: {
    firstName?: string | null;
    lastName?: string | null;
  } | null;
};

export type AdminUserRow = {
  id: string;
  email: string;
  role: AppUserRole | string;
  name: string;
  createdAt: string;
  lastSignInAt: string | null;
};

export type ResetPasswordInput = {
  userId?: string;
  password?: string;
};

export function getBearerToken(authorization: string | null) {
  if (!authorization?.startsWith('Bearer ')) return null;
  const token = authorization.slice('Bearer '.length).trim();
  return token.length ? token : null;
}

export function mergeAuthUsersWithAppUsers(authUsers: AuthUserSummary[], appUsers: AppUserSummary[]): AdminUserRow[] {
  const appById = new Map(appUsers.map((user) => [user.id, user]));

  return authUsers.map((authUser) => {
    const appUser = appById.get(authUser.id);
    const firstName = appUser?.profile?.firstName?.trim() ?? '';
    const lastName = appUser?.profile?.lastName?.trim() ?? '';
    const name = [firstName, lastName].filter(Boolean).join(' ') || 'RoadAssistNow user';

    return {
      id: authUser.id,
      email: authUser.email ?? appUser?.email ?? 'unknown email',
      role: appUser?.role ?? 'CUSTOMER',
      name,
      createdAt: authUser.created_at ?? '',
      lastSignInAt: authUser.last_sign_in_at ?? null,
    };
  });
}

export function validateResetPasswordInput(input: ResetPasswordInput): { ok: true } | { ok: false; message: string } {
  if (!input.userId?.trim()) return { ok: false, message: 'User id is required.' };
  if (!input.password || input.password.length < 8) return { ok: false, message: 'Password must be at least 8 characters.' };
  return { ok: true };
}
