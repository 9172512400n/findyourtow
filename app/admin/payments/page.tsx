import { DemoList, MetricCard } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';
import { demoPaymentMethods, demoRequests } from '@/features/demo/platform-data';
import { formatMoney } from '@/features/pricing/pricing-engine';

export default function AdminPaymentsPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Admin" title="Payment demo records" copy="Demo authorization, cards, Apple Pay, business account, and refund-ready records."><div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]"><div className="grid gap-3"><MetricCard label="Authorized" value="$4,921" tone="green" /><MetricCard label="Refund holds" value="2" tone="amber" /></div><DemoSection title="Payment records"><DemoList items={demoRequests.map((request) => ({ title: `${request.id} · ${formatMoney(request.totalCents)}`, subtitle: demoPaymentMethods.find((method) => method.id === request.paymentMethodId)?.label ?? 'Demo payment', right: request.status }))} /></DemoSection></div></DemoAppShell>;
}
