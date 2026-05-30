import Link from "next/link";
import { ActionCard, DemoList, MetricCard, StatusPill } from "@/components/app/DemoCards";
import { DemoAppShell, DemoSection } from "@/components/app/DemoAppShell";
import { DriverJobsPanel } from "@/components/marketplace/DriverJobsPanel";

export default function ProviderDashboardPage() {
  return (
    <DemoAppShell activeTab="Account" eyebrow="Provider dashboard" title="Provider Dashboard" copy="Manage application status, services, coverage, availability, incoming jobs, earnings, and completed work.">
      <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Application status" value="Pending" tone="amber" />
            <MetricCard label="Online/offline" value="Offline" />
            <MetricCard label="Earnings placeholder" value="$0" tone="green" />
            <MetricCard label="Completed jobs placeholder" value="0" tone="blue" />
          </div>
          <DemoSection title="Profile info">
            <DemoList items={[
              { title: 'Provider profile', subtitle: 'Business and owner details after application', right: 'Draft', tone: 'amber' },
              { title: 'Services offered', subtitle: 'Tow, flatbed, roadside support', right: 'Editable', tone: 'blue' },
              { title: 'Service area', subtitle: 'Coverage area for dispatch matching', right: 'Set', tone: 'green' },
            ]} />
          </DemoSection>
          <ActionCard title="Update application" copy="Return to the provider application form." href="/provider/apply" />
        </div>
        <div className="space-y-4">
          <DemoSection title="Availability">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.35rem] border border-white/10 bg-black/20 p-4">
              <div><p className="font-black">Online/offline</p><p className="mt-1 text-sm font-bold text-white/46">Provider availability toggle placeholder for dispatch.</p></div>
              <StatusPill tone="white">Offline</StatusPill>
            </div>
          </DemoSection>
          <DemoSection title="Marketplace status">
            <DemoList items={[
              { title: 'Incoming job placeholder', subtitle: 'Assigned jobs appear after admin approval and dispatch', right: 'Waiting', tone: 'amber' },
              { title: 'Earnings placeholder', subtitle: 'Payout and completed-job earnings will show here', right: '$0', tone: 'green' },
              { title: 'Completed jobs placeholder', subtitle: 'Finished service history appears here', right: '0', tone: 'blue' },
            ]} />
          </DemoSection>
          <DriverJobsPanel initialJobs={[]} />
          <Link href="/admin/dispatch" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-blue-500 px-5 text-sm font-black text-white">Open dispatch view</Link>
        </div>
      </div>
    </DemoAppShell>
  );
}
