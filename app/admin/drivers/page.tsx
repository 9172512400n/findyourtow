import Link from 'next/link';
import { DemoList, MetricCard } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';
import { demoProviders } from '@/features/demo/platform-data';

export default function AdminDriversPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Admin" title="Provider management" copy="Approve providers, inspect documents, trucks, service areas, and availability."><div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]"><div className="grid gap-3"><MetricCard label="Approved" value="42" tone="green" /><MetricCard label="Awaiting approval" value="3" tone="amber" /><MetricCard label="Online now" value="18" tone="blue" /></div><DemoSection title="Providers"><DemoList items={demoProviders.map((driver) => ({ title: driver.name, subtitle: `${driver.truckType} · ${driver.truckNumber} · ${driver.distanceMiles} mi`, right: driver.status, tone: driver.status === 'available' ? 'green' : 'blue' }))} /><div className="mt-4 grid gap-3 sm:grid-cols-2"><Link href="/driver/onboarding" className="rounded-full bg-white px-5 py-4 text-center font-black text-black">Review application</Link><Link href="/driver/documents" className="rounded-full bg-white/10 px-5 py-4 text-center font-black text-white">View documents</Link></div></DemoSection></div></DemoAppShell>;
}
