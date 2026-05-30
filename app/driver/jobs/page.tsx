import { DemoList, MetricCard } from '@/components/app/DemoCards';
import { DemoAppShell, DemoSection } from '@/components/app/DemoAppShell';
import { DriverJobsPanel } from '@/components/marketplace/DriverJobsPanel';
import { demoRequests } from '@/features/demo/platform-data';
import { formatMoney } from '@/features/pricing/pricing-engine';

export default function DriverJobsPage() {
  return (
    <DemoAppShell activeTab="Account" eyebrow="Provider jobs" title="Job offers" copy="Real assigned roadside jobs with provider status controls. Dispatch assigns approved providers first, then the provider advances the job lifecycle.">
      <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
        <div className="grid gap-3">
          <MetricCard label="Assigned jobs" value="3" tone="blue" />
          <MetricCard label="Best payout" value="$148" tone="green" />
          <MetricCard label="Avg pickup" value="1.8 mi" />
          <DemoSection title="Demo offers fallback">
            <DemoList items={demoRequests.slice(0,3).map((request) => ({ title: `${request.serviceLabel} · ${formatMoney(request.totalCents)}`, subtitle: `${request.pickup} · ${request.vehicle}`, right: request.etaMinutes ? `${request.etaMinutes} min` : 'Done', tone: 'blue' }))} />
          </DemoSection>
        </div>
        <DriverJobsPanel initialJobs={[]} />
      </div>
    </DemoAppShell>
  );
}
