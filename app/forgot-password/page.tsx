import Link from 'next/link';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function ForgotPasswordPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Account recovery" title="Forgot password" copy="Demo recovery flow for future Supabase Auth email reset wiring."><div className="mx-auto max-w-md"><DemoSection title="Send reset link"><label className="block text-sm font-black text-white/70">Email<input defaultValue="demo@findyourtow.app" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 outline-none focus:border-blue-300" /></label><Link href="/login" className="mt-4 flex min-h-13 items-center justify-center rounded-full bg-blue-500 px-5 font-black text-white">Send demo reset link</Link></DemoSection></div></DemoAppShell>;
}
