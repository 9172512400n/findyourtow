import Link from "next/link";
import { AppBottomNav } from "@/components/app/AppBottomNav";
import { BackendModePill } from "@/components/platform/BackendModePill";
import { MapExperience } from "@/components/platform/MapExperience";
import { StatusTimeline } from "@/components/platform/StatusTimeline";
import { Card, SectionLabel } from "@/components/ui/card";
import { formatMoney } from "@/features/pricing/pricing-engine";
import { availableDrivers, buildMockTrip, serviceOptions } from "@/features/tow-requests/mock-data";

const activeRequests = [
  { id: "FYT-9021", customer: "Demo Rider A", service: "Flatbed tow", area: "Central Demo Zone", status: "Paid · matching", total: 22440 },
  { id: "FYT-9018", customer: "Demo Rider B", service: "Jump start", area: "West Demo Zone", status: "Driver en route", total: 9350 },
  { id: "FYT-9011", customer: "Demo Rider C", service: "Lockout", area: "East Demo Zone", status: "Arrived", total: 8800 },
];
const approvalQueue = ["North Shore Towing", "Elite Flatbed NYC", "Metro Recovery 24/7"];
const serviceAreas = ["Central Demo Zone · 12 active", "East Demo Zone · 5 active", "West Demo Zone · 7 active", "South Demo Zone · 3 active"];
const demoTrip = buildMockTrip({ customerName: "Demo Rider A", phone: "+1", serviceType: "flatbed_tow", pickupAddress: "7148 Pixel Pkwy", dropoffAddress: "Sample Repair Center", vehicleMake: "BMW", vehicleModel: "X5", rush: true });

export default function DispatchPage() {
  return (
    <main className="min-h-screen bg-[#050608] px-5 pb-28 pt-5 text-white sm:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 pb-5">
        <Link href="/" className="text-lg font-black">FindYourTow Dispatch</Link>
        <div className="flex flex-wrap items-center justify-end gap-2"><BackendModePill /><Link href="/request" className="rounded-full bg-white px-4 py-2 text-sm font-black text-black">Create request</Link></div>
      </nav>
      <section className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <MapExperience drivers={availableDrivers} focus="dispatch" title="Command center live map" progress={71} />
          <Card>
            <SectionLabel>Active requests</SectionLabel>
            <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-white/10"><div className="grid grid-cols-5 bg-white/[0.055] px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-white/36"><span>Job</span><span>Customer</span><span>Service</span><span>Status</span><span className="text-right">Total</span></div>{activeRequests.map((request) => <div key={request.id} className="grid grid-cols-5 items-center border-t border-white/10 px-4 py-4 text-sm font-bold text-white/72"><span className="text-white">{request.id}</span><span>{request.customer}</span><span>{request.service}</span><span>{request.status}</span><span className="text-right text-emerald-200">{formatMoney(request.total)}</span></div>)}</div>
          </Card>
          <Card>
            <SectionLabel>Job status timeline</SectionLabel>
            <div className="mt-4"><StatusTimeline timeline={demoTrip.timeline} /></div>
          </Card>
        </div>
        <div className="space-y-5">
          <Card className="premium-card">
            <SectionLabel>Operations command</SectionLabel>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.045em]">Live dispatch dashboard.</h1>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center"><Metric value="18" label="Active" /><Metric value="42" label="Drivers" /><Metric value="7m" label="Avg ETA" /></div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center"><Metric value="$18.4k" label="Today revenue" /><Metric value="94%" label="SLA hit rate" /></div>
          </Card>
          <Card>
            <SectionLabel>Driver assignment panel</SectionLabel>
            <div className="mt-4 space-y-3">{availableDrivers.map((driver, index) => <div key={driver.id} className="flex items-center justify-between rounded-2xl bg-white/[0.055] p-4"><div><p className="font-black">{driver.name}</p><p className="text-sm font-bold text-white/48">{driver.truckType} · {driver.distanceMiles} mi · match {98 - index * 4}%</p></div><Link href="/admin/jobs" className="rounded-full bg-blue-500 px-4 py-2 text-sm font-black">Assign {driver.name}</Link></div>)}</div>
          </Card>
          <Card>
            <SectionLabel>Service areas</SectionLabel>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold text-white/70">{serviceAreas.map((area) => <div key={area} className="rounded-2xl bg-black/24 p-3">{area}</div>)}</div>
          </Card>
          <Card>
            <SectionLabel>Driver approval queue</SectionLabel>
            <div className="mt-4 space-y-2">{approvalQueue.map((name) => <div key={name} className="flex items-center justify-between rounded-2xl bg-black/24 p-3"><span className="text-sm font-black">{name}</span><span className="rounded-full bg-amber-300/16 px-3 py-1 text-xs font-black text-amber-100">Review</span></div>)}</div>
          </Card>
          <Card>
            <SectionLabel>Pricing + services</SectionLabel>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold text-white/70">{serviceOptions.slice(0, 6).map((service) => <div key={service.id} className="rounded-2xl bg-black/24 p-3">{service.label}</div>)}</div>
          </Card>
        </div>
      </section>
      <AppBottomNav activeTab="Account" />
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="rounded-2xl bg-black/24 p-4"><p className="text-2xl font-black">{value}</p><p className="text-xs font-bold text-white/44">{label}</p></div>;
}
