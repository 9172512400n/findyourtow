import Link from 'next/link';
import { Smartphone, ShieldCheck } from 'lucide-react';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';
import { StatusPill } from '@/components/app/DemoCards';

export default function ApplePayPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Wallet" title="Apple Pay demo" copy="Keyless wallet setup flow that later connects to Apple Pay through Stripe."><div className="mx-auto max-w-2xl"><DemoSection title="Wallet status"><div className="rounded-[2rem] bg-black/24 p-6 text-center"><Smartphone className="mx-auto" size={44} /><h2 className="mt-4 text-3xl font-black">Apple Pay demo ready</h2><p className="mt-2 text-sm font-bold text-white/52">No real wallet or Stripe keys are required. This simulates the exact production decision point.</p><div className="mt-4"><StatusPill tone="green"><ShieldCheck size={14} /> Tokenized demo method</StatusPill></div></div><Link href="/account/payments" className="mt-5 flex min-h-13 items-center justify-center rounded-full bg-blue-500 px-5 font-black text-white">Use Apple Pay demo</Link></DemoSection></div></DemoAppShell>;
}
