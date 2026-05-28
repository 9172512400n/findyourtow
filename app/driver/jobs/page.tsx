import Link from 'next/link';
import { DemoList, MetricCard } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';
import { demoRequests } from '@/features/demo/platform-data';
import { formatMoney } from '@/features/pricing/pricing-engine';

export default function DriverJobsPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Provider jobs" title="Job offers" copy="Incoming paid roadside jobs with accept/decline paths and route preview."><div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]"><div className="grid gap-3"><MetricCard label="Open offers" value="3" tone="blue" /><MetricCard label="Best payout" value="$148" tone="green" /><MetricCard label="Avg pickup" value="1.8 mi" /></div><DemoSection title="Incoming offers"><DemoList items={demoRequests.slice(0,3).map((request) => ({ title: `${request.serviceLabel} · ${formatMoney(request.totalCents)}`, subtitle: `${request.pickup} · ${request.vehicle}`, right: request.etaMinutes ? `${request.etaMinutes} min` : 'Done', tone: 'blue' }))} /><div className="mt-4 grid grid-cols-2 gap-3"><Link href="/driver/active" className="rounded-full bg-blue-500 px-5 py-4 text-center font-black text-white">Accept first job</Link><button className="rounded-full bg-white/10 px-5 py-4 font-black text-white">Decline</button></div></DemoSection></div></DemoAppShell>;
}
