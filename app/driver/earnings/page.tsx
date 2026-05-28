import { DemoList, MetricCard } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';
import { demoDriverEarnings } from '@/features/demo/platform-data';
import { formatMoney } from '@/features/pricing/pricing-engine';

export default function DriverEarningsPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Provider wallet" title="Earnings" copy="Driver payouts, completed jobs, tips, and future Stripe Connect wiring."><div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]"><div className="grid gap-3"><MetricCard label="Today" value="$482" tone="green" /><MetricCard label="Jobs" value="7" /><MetricCard label="Accept rate" value="98%" tone="blue" /></div><DemoSection title="Completed jobs"><DemoList items={demoDriverEarnings.map((earning) => ({ title: earning.label, subtitle: `${earning.area} · ${earning.date}`, right: formatMoney(earning.amountCents), tone: 'green' }))} /></DemoSection></div></DemoAppShell>;
}
