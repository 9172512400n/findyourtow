import Link from 'next/link';
import { DemoList, MetricCard } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';
import { demoRequests } from '@/features/demo/platform-data';
import { formatMoney } from '@/features/pricing/pricing-engine';

export default function AdminJobsPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Admin" title="Job management" copy="View active jobs, request details, vehicle snapshots, payment records, and manual assignment controls."><div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]"><div className="grid gap-3"><MetricCard label="Active jobs" value="18" tone="blue" /><MetricCard label="Today revenue" value="$18.4k" tone="green" /><MetricCard label="SLA hit" value="94%" /></div><DemoSection title="Requests"><DemoList items={demoRequests.map((request) => ({ title: `${request.id} · ${request.serviceLabel}`, subtitle: `${request.customer} · ${request.vehicle} · ${request.pickup}`, right: `${formatMoney(request.totalCents)}`, tone: request.status === 'completed' ? 'green' : 'blue' }))} /><div className="mt-4 grid gap-3 sm:grid-cols-2"><Link href="/admin/dispatch" className="rounded-full bg-blue-500 px-5 py-4 text-center font-black text-white">Open dispatch map</Link><Link href="/admin/refunds" className="rounded-full bg-white/10 px-5 py-4 text-center font-black text-white">Refund demo</Link></div></DemoSection></div></DemoAppShell>;
}
