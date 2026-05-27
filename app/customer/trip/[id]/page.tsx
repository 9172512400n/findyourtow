import Link from "next/link";
import { BackendModePill } from "@/components/platform/BackendModePill";
import { DriverCard } from "@/components/platform/DriverCard";
import { MapExperience } from "@/components/platform/MapExperience";
import { StatusTimeline } from "@/components/platform/StatusTimeline";
import { Card, SectionLabel } from "@/components/ui/card";
import { formatMoney } from "@/features/pricing/pricing-engine";
import { buildMockTrip } from "@/features/tow-requests/mock-data";

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = buildMockTrip({
    customerName: "FindYourTow customer",
    phone: "+1 917 251 2400",
    serviceType: "flatbed_tow",
    pickupAddress: "Current location · Midtown Manhattan",
    dropoffAddress: "Trusted repair shop · Long Island City",
    vehicleMake: "BMW",
    vehicleModel: "X5",
    vehicleColor: "Black",
    rush: true,
  });

  return (
    <main className="min-h-screen bg-[#050608] px-5 py-5 text-white sm:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 pb-5">
        <Link href="/request" className="text-sm font-black text-white/72">← Request another service</Link>
        <div className="flex items-center gap-2"><BackendModePill /><span className="rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-100">{id.slice(0, 14)}</span></div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-5">
          <MapExperience drivers={[trip.driver]} route={trip.route} pickup={trip.pickup} dropoff={trip.dropoff} focus="customer" title="Live route simulation" progress={62} />
          <Card>
            <SectionLabel>Customer safety</SectionLabel>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {["Call driver", "Call support", "Share trip", "Cancel safely"].map((action) => <button key={action} className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-4 text-sm font-black text-white/76 transition hover:bg-white/10">{action}</button>)}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="premium-card">
            <SectionLabel>Live tow status</SectionLabel>
            <div className="mt-4 flex items-start justify-between gap-5">
              <div><h1 className="text-4xl font-black tracking-[-0.045em] sm:text-5xl">Truck arrives in {trip.driver.etaMinutes} minutes.</h1><p className="mt-3 leading-7 text-white/62">{trip.pickupAddress}</p></div>
              <span className="rounded-full bg-emerald-300 px-4 py-2 text-sm font-black text-emerald-950">Paid</span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric label="Total" value={formatMoney(trip.quote.totalCents)} />
              <Metric label="Distance" value={`${trip.quote.distanceMiles} mi`} />
              <Metric label="Status" value="On way" />
              <Metric label="Progress" value="62%" />
            </div>
          </Card>
          <DriverCard driver={trip.driver} />
          <Card>
            <SectionLabel>Route progress</SectionLabel>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center"><div className="rounded-2xl bg-blue-500/16 p-4"><p className="text-xl font-black">2.1 mi</p><p className="text-xs font-bold text-white/44">to pickup</p></div><div className="rounded-2xl bg-black/24 p-4"><p className="text-xl font-black">21 mph</p><p className="text-xs font-bold text-white/44">driver speed</p></div><div className="rounded-2xl bg-black/24 p-4"><p className="text-xl font-black">4 stops</p><p className="text-xs font-bold text-white/44">status checks</p></div></div>
          </Card>
          <Card>
            <SectionLabel>Status timeline</SectionLabel>
            <div className="mt-4"><StatusTimeline timeline={trip.timeline} /></div>
          </Card>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-black/24 p-3"><p className="text-xs font-bold uppercase tracking-[0.2em] text-white/36">{label}</p><p className="mt-2 font-black">{value}</p></div>;
}
