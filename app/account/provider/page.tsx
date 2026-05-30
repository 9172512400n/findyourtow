import { ActionCard, DemoList, MetricCard } from "@/components/app/DemoCards";
import { DemoAppShell, DemoSection } from "@/components/app/DemoAppShell";

export default function ProviderAccountPage() {
  return (
    <DemoAppShell activeTab="Account" eyebrow="Provider access" title="Provider Account" copy="Apply to join RoadAssistNow, manage service availability, and prepare for dispatch-approved jobs.">
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-3">
          <MetricCard label="Application" value="Pending" tone="amber" />
          <MetricCard label="Availability" value="Offline" />
          <MetricCard label="Completed jobs" value="0" tone="blue" />
        </div>
        <div className="space-y-4">
          <DemoSection title="Provider access">
            <DemoList items={[
              { title: 'Apply to join', subtitle: 'Business, owner, phone, email, services, truck', right: 'Start', tone: 'blue' },
              { title: 'Manage jobs', subtitle: 'Accept assigned jobs and update status', right: 'Dashboard', tone: 'green' },
              { title: 'Set availability', subtitle: 'Online/offline toggle for dispatch visibility', right: 'Soon', tone: 'amber' },
            ]} />
          </DemoSection>
          <div className="grid gap-3 sm:grid-cols-2">
            <ActionCard title="Provider application" copy="Submit business, truck, service area, availability, and document placeholders." href="/provider/apply" />
            <ActionCard title="Provider dashboard" copy="View status, profile, services, jobs, earnings, and completed work." href="/provider/dashboard" />
          </div>
        </div>
      </div>
    </DemoAppShell>
  );
}
