import Link from 'next/link';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

const fields = ['Vehicle nickname','Make','Model','Year','Color','Plate number','Vehicle type','VIN optional','Photo optional'];

export default function AddVehiclePage() {
  return <DemoAppShell activeTab="Account" eyebrow="Garage" title="Add vehicle" copy="Demo add-vehicle form with all production fields ready for storage and uploads later."><div className="mx-auto max-w-2xl"><DemoSection title="Vehicle details"><div className="grid gap-3 sm:grid-cols-2">{fields.map((field) => <label key={field} className="block text-sm font-black text-white/70">{field}<input placeholder={field} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 outline-none focus:border-blue-300" /></label>)}</div><label className="mt-4 flex items-center gap-3 rounded-2xl bg-black/24 p-4 font-black"><input type="checkbox" defaultChecked /> Set as default vehicle</label><Link href="/account/vehicles" className="mt-5 flex min-h-13 items-center justify-center rounded-full bg-blue-500 px-5 font-black text-white">Save demo vehicle</Link></DemoSection></div></DemoAppShell>;
}
