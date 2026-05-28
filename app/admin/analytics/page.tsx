import { MetricCard } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';

export default function AdminAnalyticsPage() {
  return <DemoAppShell activeTab="Account" eyebrow="Admin" title="Analytics" copy="Demo revenue, SLA, dispatch, and marketplace metrics."><DemoSection title="Performance"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><MetricCard label="Revenue today" value="$18.4k" tone="green" /><MetricCard label="Avg ETA" value="7m" tone="blue" /><MetricCard label="SLA hit" value="94%" /><MetricCard label="Repeat customers" value="38%" tone="green" /></div></DemoSection></DemoAppShell>;
}
