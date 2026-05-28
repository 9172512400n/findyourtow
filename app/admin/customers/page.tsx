import { DemoList, MetricCard } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';
import { demoRequests } from '@/features/demo/platform-data';

export default function AdminCustomersPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Admin" title="Customer management" copy="Customer profiles, request history, saved vehicles, and support context."><div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]"><div className="grid gap-3"><MetricCard label="Customers" value="1,248" /><MetricCard label="Repeat rate" value="38%" tone="green" /></div><DemoSection title="Recent customers"><DemoList items={demoRequests.map((request) => ({ title: request.customer, subtitle: `${request.serviceLabel} · ${request.vehicle}`, right: request.status }))} /></DemoSection></div></DemoAppShell>;
}
