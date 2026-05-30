import Link from "next/link";
import { ActionCard, DemoList, MetricCard } from "@/components/app/DemoCards";
import { DemoAppShell, DemoSection } from "@/components/app/DemoAppShell";
import { VehicleProfileManager } from "@/components/app/VehicleProfileManager";

export default function CustomerAccountPage() {
  return (
    <DemoAppShell activeTab="Account" eyebrow="Customer access" title="Customer Account" copy="Save your profile, vehicles, service preferences, and tracking shortcuts before requesting roadside help.">
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Saved vehicles" value="3" tone="blue" />
            <MetricCard label="Avg ETA" value="8m" tone="green" />
          </div>
          <DemoSection title="Customer setup">
            <DemoList items={[
              { title: 'Save user profile', subtitle: 'Name, phone, email, home area', right: 'Ready', tone: 'green' },
              { title: 'Save vehicle details', subtitle: 'Make, model, color, plate, type', right: 'Ready', tone: 'green' },
              { title: 'Choose service type', subtitle: 'Tow, flat tire, lockout, fuel, jump start', right: '3 steps', tone: 'blue' },
              { title: 'Use current location or enter address', subtitle: 'GPS shortcut plus manual address entry', right: 'Live', tone: 'blue' },
            ]} />
          </DemoSection>
          <div className="grid gap-3">
            <ActionCard title="Request help" copy="Choose service, location, vehicle, and approve price." href="/request-service" />
            <ActionCard title="Track active request" copy="See ETA, provider name, rating, route, and call button." href="/track" />
            <Link href="/login" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-black text-black">Sign up / login</Link>
          </div>
        </div>
        <VehicleProfileManager />
      </div>
    </DemoAppShell>
  );
}
