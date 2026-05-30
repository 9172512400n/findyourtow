import Link from "next/link";
import { AppBottomNav } from "@/components/app/AppBottomNav";
import { ActiveRequestsPanel } from "@/components/platform/ActiveRequestsPanel";
import { BackendModePill } from "@/components/platform/BackendModePill";
import { MapExperience } from "@/components/platform/MapExperience";
import { DispatchMarketplacePanel } from "@/components/marketplace/DispatchMarketplacePanel";
import { Card, SectionLabel } from "@/components/ui/card";
import { availableDrivers } from "@/features/tow-requests/mock-data";

const demoActiveRequests = [
  { id: "FYT-9021", customer: "Demo Rider A", service: "Flatbed tow", area: "Central Demo Zone", status: "Paid · matching", total: 22440 },
  { id: "FYT-9018", customer: "Demo Rider B", service: "Jump start", area: "West Demo Zone", status: "Driver en route", total: 9350 },
  { id: "FYT-9011", customer: "Demo Rider C", service: "Lockout", area: "East Demo Zone", status: "Arrived", total: 8800 },
];

export default function DispatchPage() {
  return (
    <main className="min-h-screen bg-[#050608] px-5 pb-28 pt-5 text-white sm:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 pb-5" aria-label="Main app navigation">
        <Link href="/" className="text-lg font-black">RoadAssistNow Dispatch</Link>
        <div className="flex flex-wrap items-center justify-end gap-2"><BackendModePill /><Link href="/admin/users" className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white">Users</Link><Link href="/request" className="rounded-full bg-white px-4 py-2 text-sm font-black text-black">Create request</Link></div>
      </nav>
      <section className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <MapExperience drivers={availableDrivers} focus="dispatch" title="Command center live map" progress={71} />
          <Card>
            <SectionLabel>Existing request feed</SectionLabel>
            <ActiveRequestsPanel fallbackRequests={demoActiveRequests} />
          </Card>
        </div>
        <div className="space-y-5">
          <Card className="premium-card">
            <SectionLabel>Operations command</SectionLabel>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.045em]">Live dispatch dashboard.</h1>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center"><Metric value="18" label="Requests" /><Metric value="42" label="Providers" /><Metric value="Manual" label="Dispatch" /></div>
            <Link href="/admin/jobs" className="mt-4 inline-flex rounded-full bg-blue-500 px-4 py-2 text-sm font-black text-white">Assign Marcus Reed</Link>
          </Card>
          <DispatchMarketplacePanel initialRequests={[]} initialDrivers={[]} />
        </div>
      </section>
      <AppBottomNav activeTab="Account" />
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="rounded-2xl bg-black/24 p-4"><p className="text-2xl font-black">{value}</p><p className="text-xs font-bold text-white/44">{label}</p></div>;
}
