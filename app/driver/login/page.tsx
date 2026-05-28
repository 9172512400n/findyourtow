import Link from 'next/link';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function ProviderLoginPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Provider access" title="Provider login" copy="Provider login flow with dispatcher-ready role-based routing."><div className="mx-auto max-w-md"><DemoSection title="Provider portal"><label className="block text-sm font-black text-white/70">Email<input defaultValue="driver@findyourtow.app" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4" /></label><label className="mt-3 block text-sm font-black text-white/70">Password<input type="password" defaultValue="demo-password" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4" /></label><Link href="/driver" className="mt-5 flex min-h-13 items-center justify-center rounded-full bg-blue-500 px-5 font-black text-white">Enter provider dashboard</Link><Link href="/driver/onboarding" className="mt-3 block text-center text-sm font-bold text-white/52">Apply as provider</Link></DemoSection></div></DemoAppShell>;
}
