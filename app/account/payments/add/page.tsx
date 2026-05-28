import Link from 'next/link';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function AddPaymentMethodPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Wallet" title="Add payment method" copy="Demo card form ready to become Stripe SetupIntent collection later."><div className="mx-auto max-w-2xl"><DemoSection title="Card details"><div className="grid gap-3 sm:grid-cols-2">{[['Cardholder name','Demo Customer'],['Last 4 digits demo','4242'],['Expiration','08/29'],['Billing ZIP','11700']].map(([label,value]) => <label key={label} className="block text-sm font-black text-white/70">{label}<input defaultValue={value} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 outline-none focus:border-blue-300" /></label>)}</div><label className="mt-4 flex items-center gap-3 rounded-2xl bg-black/24 p-4 font-black"><input type="checkbox" defaultChecked /> Set as default payment method</label><Link href="/account/payments" className="mt-5 flex min-h-13 items-center justify-center rounded-full bg-blue-500 px-5 font-black text-white">Save demo card</Link></DemoSection></div></DemoAppShell>;
}
