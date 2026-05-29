'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { getAdminRedirectPath, normalizeLoginEmail } from '@/features/auth/admin-auth';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('9172512400n@gmail.com');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setError(null);

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setStatus('idle');
      setError('Admin login is not configured yet. Supabase public keys are missing.');
      return;
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizeLoginEmail(email),
      password,
    });

    if (signInError || !data.session) {
      setStatus('idle');
      setError(signInError?.message ?? 'Unable to sign in.');
      return;
    }

    const role = data.user.app_metadata?.user_role ?? data.user.user_metadata?.user_role;
    router.push(getAdminRedirectPath(role));
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="rounded-[1.5rem] border border-blue-300/18 bg-blue-400/10 p-4 text-sm font-bold leading-6 text-blue-50/78">
        <span className="inline-flex items-center gap-2 font-black text-blue-50"><ShieldCheck size={17} /> Owner support access</span>
        <p className="mt-2 text-blue-50/66">Use this panel to view app users and reset passwords when someone has trouble signing in.</p>
      </div>
      <label className="block text-sm font-black text-white/70">
        Email
        <input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 outline-none transition focus:border-blue-300" />
      </label>
      <label className="block text-sm font-black text-white/70">
        Password
        <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 outline-none transition focus:border-blue-300" />
      </label>
      {error && <div className="rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm font-bold text-red-100">{error}</div>}
      <button type="submit" disabled={status === 'loading'} className="flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-blue-500 px-5 font-black text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60">
        {status === 'loading' ? 'Checking access...' : 'Open admin panel'} <ArrowRight size={18} />
      </button>
    </form>
  );
}
