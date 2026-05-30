import Link from "next/link";
import { DemoList } from "@/components/app/DemoCards";
import { DemoAppShell, DemoSection } from "@/components/app/DemoAppShell";
import { ProviderOnboardingForm } from "@/components/marketplace/ProviderOnboardingForm";

export default function ProviderApplyPage() {
  return (
    <DemoAppShell activeTab="Account" eyebrow="Provider application" title="Provider Application" copy="Apply to become a verified RoadAssistNow provider. Admin reviews applications before dispatch can assign jobs.">
      <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-4">
          <DemoSection title="Required details">
            <DemoList items={[
              { title: 'Business name', subtitle: 'Company or operator name', right: 'Required', tone: 'blue' },
              { title: 'Owner name', subtitle: 'Primary responsible operator', right: 'Required', tone: 'blue' },
              { title: 'Phone/email', subtitle: 'Dispatch contact details', right: 'Required', tone: 'blue' },
              { title: 'Service area', subtitle: 'Neighborhoods, cities, or counties served', right: 'Required', tone: 'blue' },
              { title: 'Services offered', subtitle: 'Tow, flatbed, fuel, tire, lockout, battery', right: 'Required', tone: 'blue' },
              { title: 'Truck type', subtitle: 'Flatbed, wheel-lift, roadside service unit', right: 'Required', tone: 'blue' },
              { title: 'License/insurance upload placeholder', subtitle: 'Upload workflow placeholder for compliance review', right: 'Pending', tone: 'amber' },
              { title: 'Availability', subtitle: 'Operating hours and service readiness', right: 'Pending', tone: 'amber' },
              { title: 'Status: Pending Review', subtitle: 'Admin approval required before jobs', right: 'Review', tone: 'green' },
            ]} />
          </DemoSection>
          <Link href="/provider/dashboard" className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-black text-black">View provider dashboard</Link>
        </div>
        <DemoSection title="Submit application">
          <ProviderOnboardingForm />
        </DemoSection>
      </div>
    </DemoAppShell>
  );
}
