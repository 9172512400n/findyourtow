import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function RegisterPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Create account" title="Create your account" copy="Start a full demo account with profile, default vehicle, payment method, and emergency contact setup."><div className="mx-auto max-w-md"><DemoSection title="New customer"><div className="space-y-3">{['Full name','Phone number','Email'].map((label) => <label key={label} className="block text-sm font-black text-white/70">{label}<input placeholder={label} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 outline-none focus:border-blue-300" /></label>)}<Link href="/account/setup" className="flex min-h-13 items-center justify-center gap-2 rounded-full bg-blue-500 px-5 font-black text-white">Create demo account <ArrowRight size={18} /></Link><Link href="/login" className="block text-center text-sm font-bold text-white/52">Already have an account?</Link></div></DemoSection></div></DemoAppShell>;
}
