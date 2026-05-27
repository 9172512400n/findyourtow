import Link from "next/link";
import { BackendModePill } from "@/components/platform/BackendModePill";
import { DriverLiveConsole } from "@/components/platform/DriverLiveConsole";
import { MapExperience } from "@/components/platform/MapExperience";
import { Button } from "@/components/ui/button";
import { Card, SectionLabel } from "@/components/ui/card";
import { formatMoney } from "@/features/pricing/pricing-engine";
import { availableDrivers } from "@/features/tow-requests/mock-data";

const completedJobs = [
  { id: "FYT-2041", service: "Jump start", area: "Chelsea", payout: 6200 },
  { id: "FYT-2038", service: "Flatbed tow", area: "Long Island City", payout: 14800 },
  { id: "FYT-2032", service: "Lockout", area: "Upper West Side", payout: 7400 },
];

export default function DriverPage() {
  const driver = availableDrivers[0];

  return (
    <main className="min-h-screen bg-[#050608] px-5 py-5 text-white sm:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 pb-8">
        <Link href="/" className="text-lg font-black">FindYourTow Driver</Link>
        <div className="flex flex-wrap items-center justify-end gap-2"><BackendModePill /><Link href="/request" className="rounded-full bg-white px-4 py-2 text-sm font-black text-black">Customer app</Link></div>
      </nav>
      <section className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="space-y-5">
          <Card className="premium-card">
            <SectionLabel>Driver network</SectionLabel>
            <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.055em] sm:text-7xl">Earn with premium tow jobs.</h1>
            <p className="mt-5 text-lg leading-8 text-white/68">A professional driver app for clean job offers, paid requests, route context, safety status, and daily earnings.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">{["License verified", "Insurance active", "Truck photos", "Admin approved"].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 font-black">{item}</div>)}</div>
          </Card>
          <Card>
            <SectionLabel>Today’s earnings</SectionLabel>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center"><Metric value="$482" label="Today" /><Metric value="7" label="Jobs" /><Metric value="98%" label="Accept" /></div>
            <div className="mt-4 rounded-2xl bg-emerald-300/12 p-4 text-sm font-bold text-emerald-100">Payout estimate includes platform fees, tips, and completed demo jobs.</div>
          </Card>
          <Card>
            <SectionLabel>Completed jobs</SectionLabel>
            <div className="mt-4 space-y-3">{completedJobs.map((job) => <div key={job.id} className="flex items-center justify-between rounded-2xl bg-white/[0.055] p-4"><div><p className="font-black">{job.service}</p><p className="text-sm font-bold text-white/42">{job.area} · {job.id}</p></div><p className="font-black text-emerald-200">{formatMoney(job.payout)}</p></div>)}</div>
          </Card>
        </div>
        <div className="space-y-5">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4"><div><SectionLabel>Online console</SectionLabel><h2 className="mt-3 text-3xl font-black">{driver.name}</h2><p className="text-white/56">{driver.truckType} · {driver.truckNumber} · ★ {driver.rating}</p></div><span className="rounded-full bg-emerald-300 px-4 py-2 text-sm font-black text-emerald-950">Online</span></div>
          </Card>
          <DriverLiveConsole driverId={driver.id} />
          <Card className="premium-card">
            <SectionLabel>New paid job offer</SectionLabel>
            <div className="mt-4 flex flex-wrap items-start justify-between gap-4"><div><h3 className="text-3xl font-black">Flatbed tow · 1.4 miles away</h3><p className="mt-2 text-white/62">Pickup: FDR Drive, Exit 10 · Customer authorized · ETA target 6 minutes.</p></div><div className="rounded-2xl bg-blue-500/16 px-4 py-3 text-right"><p className="text-xs font-black text-white/42">Estimated payout</p><p className="text-2xl font-black">$148</p></div></div>
            <div className="mt-5 grid grid-cols-2 gap-3"><Button>Accept job</Button><Button variant="secondary">Decline</Button></div>
          </Card>
          <MapExperience drivers={[driver]} focus="driver" title="Active job route" progress={44} />
          <Card>
            <SectionLabel>Status update</SectionLabel>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{["On my way", "Arrived", "Loaded", "Delivered"].map((status) => <button key={status} className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-4 text-sm font-black text-white/74 transition hover:bg-blue-500/18">{status}</button>)}</div>
          </Card>
        </div>
      </section>
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="rounded-2xl bg-black/24 p-4"><p className="text-2xl font-black">{value}</p><p className="text-xs font-bold text-white/44">{label}</p></div>;
}
