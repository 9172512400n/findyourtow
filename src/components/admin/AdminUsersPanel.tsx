'use client';

import type { FormEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, RefreshCw, Search, ShieldCheck, Users } from 'lucide-react';
import type { AdminUserRow } from '@/features/auth/admin-users';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

function formatDate(value: string | null) {
  if (!value) return 'Never';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
}

export function AdminUsersPanel() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [query, setQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'saving'>('loading');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getToken = useCallback(async () => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) throw new Error('Admin login is not configured.');
    const { data } = await supabase.auth.getSession();
    if (!data.session?.access_token) throw new Error('Please sign in again.');
    return data.session.access_token;
  }, []);

  const loadUsers = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch('/api/admin/users', { headers: { authorization: `Bearer ${token}` } });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Unable to load users.');
      setUsers(payload.users ?? []);
      setStatus('ready');
    } catch (loadError) {
      setStatus('ready');
      setError(loadError instanceof Error ? loadError.message : 'Unable to load users.');
    }
  }, [getToken]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadUsers();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return users;
    return users.filter((user) => `${user.email} ${user.name} ${user.role}`.toLowerCase().includes(needle));
  }, [query, users]);

  const selectedUser = users.find((user) => user.id === selectedUserId) ?? null;

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedUser) return;
    setStatus('saving');
    setError(null);
    setMessage(null);
    try {
      const token = await getToken();
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: selectedUser.id, password: newPassword }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Unable to reset password.');
      setNewPassword('');
      setMessage(`Password reset for ${selectedUser.email}.`);
      setStatus('ready');
    } catch (resetError) {
      setStatus('ready');
      setError(resetError instanceof Error ? resetError.message : 'Unable to reset password.');
    }
  }

  async function signOut() {
    const supabase = createBrowserSupabaseClient();
    await supabase?.auth.signOut();
    router.push('/admin/login');
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-white/42"><Users size={16} /> User support</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.05em]">Accounts</h2>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={loadUsers} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white"><RefreshCw size={15} /> Refresh</button>
            <button type="button" onClick={signOut} className="rounded-full bg-white px-4 py-2 text-sm font-black text-black">Sign out</button>
          </div>
        </div>
        <label className="mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white/70">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users by name, email, or role" className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-white/34" />
        </label>
        <div className="space-y-3">
          {status === 'loading' && <div className="rounded-2xl bg-white/[0.055] p-4 text-sm font-bold text-white/54">Loading users...</div>}
          {filteredUsers.map((user) => (
            <button key={user.id} type="button" onClick={() => setSelectedUserId(user.id)} className={`w-full rounded-2xl border p-4 text-left transition ${selectedUserId === user.id ? 'border-blue-300/45 bg-blue-400/12' : 'border-white/10 bg-white/[0.045] hover:bg-white/[0.07]'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-black tracking-[-0.03em]">{user.name}</p>
                  <p className="mt-1 text-sm font-bold text-white/54">{user.email}</p>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/64">{user.role}</span>
              </div>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-white/34">Last sign-in: {formatDate(user.lastSignInAt)}</p>
            </button>
          ))}
          {status !== 'loading' && filteredUsers.length === 0 && <div className="rounded-2xl bg-white/[0.055] p-4 text-sm font-bold text-white/54">No users found.</div>}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="mb-5 rounded-[1.5rem] border border-emerald-300/18 bg-emerald-400/10 p-4 text-sm font-bold leading-6 text-emerald-50/76">
          <p className="inline-flex items-center gap-2 font-black text-emerald-50"><ShieldCheck size={17} /> Free app admin tools</p>
          <p className="mt-2">No paid account grants here — this panel is only for account visibility and password support.</p>
        </div>
        <h2 className="text-3xl font-black tracking-[-0.05em]">Reset password</h2>
        <p className="mt-2 text-sm font-semibold leading-6 text-white/54">Choose a user, enter a temporary password, then tell them to sign in and change it later.</p>
        {selectedUser ? (
          <form onSubmit={resetPassword} className="mt-5 space-y-4">
            <div className="rounded-2xl bg-black/30 p-4">
              <p className="font-black">{selectedUser.name}</p>
              <p className="mt-1 text-sm font-bold text-white/52">{selectedUser.email}</p>
            </div>
            <label className="block text-sm font-black text-white/70">
              New temporary password
              <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" minLength={8} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 outline-none transition focus:border-blue-300" />
            </label>
            <button type="submit" disabled={status === 'saving'} className="flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-blue-500 px-5 font-black text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60">
              <KeyRound size={18} /> {status === 'saving' ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        ) : (
          <div className="mt-5 rounded-2xl bg-white/[0.055] p-4 text-sm font-bold text-white/54">Select a user from the account list.</div>
        )}
        {message && <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-50">{message}</div>}
        {error && <div className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100">{error}</div>}
      </section>
    </div>
  );
}
