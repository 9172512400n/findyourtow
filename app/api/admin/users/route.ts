import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@/features/auth/admin-auth';
import { getBearerToken, mergeAuthUsersWithAppUsers, validateResetPasswordInput, type AppUserSummary } from '@/features/auth/admin-users';
import { createServerSupabaseClient } from '@/lib/supabase/server';

async function requireAdmin(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return { error: NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 }) } as const;
  }

  const token = getBearerToken(request.headers.get('authorization'));
  if (!token) {
    return { error: NextResponse.json({ error: 'Admin login required.' }, { status: 401 }) } as const;
  }

  const { data: authUser, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authUser.user) {
    return { error: NextResponse.json({ error: 'Admin session expired.' }, { status: 401 }) } as const;
  }

  const { data: appUser, error: appUserError } = await supabase
    .from('users')
    .select('id,email,role')
    .eq('id', authUser.user.id)
    .maybeSingle();

  if (appUserError) {
    return { error: NextResponse.json({ error: appUserError.message }, { status: 500 }) } as const;
  }

  const role = appUser?.role ?? authUser.user.app_metadata?.user_role ?? authUser.user.user_metadata?.user_role;
  if (!isAdminRole(role)) {
    return { error: NextResponse.json({ error: 'Admin access only.' }, { status: 403 }) } as const;
  }

  return { supabase, adminUser: authUser.user } as const;
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if ('error' in admin) return admin.error;

  const { data: authUsers, error: authListError } = await admin.supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (authListError) {
    return NextResponse.json({ error: authListError.message }, { status: 500 });
  }

  const { data: appUsers, error: appUsersError } = await admin.supabase
    .from('users')
    .select('id,email,role')
    .in('id', authUsers.users.map((user) => user.id));

  if (appUsersError) {
    return NextResponse.json({ error: appUsersError.message }, { status: 500 });
  }

  const { data: profiles, error: profilesError } = await admin.supabase
    .from('profiles')
    .select('userId,firstName,lastName')
    .in('userId', authUsers.users.map((user) => user.id));

  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 500 });
  }

  const profileByUserId = new Map((profiles ?? []).map((profile) => [profile.userId, profile]));
  const appSummaries: AppUserSummary[] = (appUsers ?? []).map((user) => ({
    id: user.id,
    email: user.email,
    role: user.role,
    profile: profileByUserId.get(user.id) ?? null,
  }));

  return NextResponse.json({ users: mergeAuthUsersWithAppUsers(authUsers.users, appSummaries) });
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin(request);
  if ('error' in admin) return admin.error;

  const body = await request.json().catch(() => ({}));
  const validation = validateResetPasswordInput(body);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  const { error } = await admin.supabase.auth.admin.updateUserById(body.userId, { password: body.password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
