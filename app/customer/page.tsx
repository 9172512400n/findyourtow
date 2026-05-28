import Link from "next/link";
import { AppBottomNav } from "@/components/app/AppBottomNav";
import { BackendModePill } from "@/components/platform/BackendModePill";
import { DriverCard } from "@/components/platform/DriverCard";
import { MapExperience } from "@/components/platform/MapExperience";
import { StatusTimeline } from "@/components/platform/StatusTimeline";
import { Card, SectionLabel } from "@/components/ui/card";
import { demoRequestHistory } from "@/features/demo/requests";
import { formatMoney } from "@/features/pricing/pricing-engine";
import { buildMockTrip } from "@/features/tow-requests/mock-data";

const activeTrip = buildMockTrip({
  customerName: "FindYourTow customer",
  phone: "+1 000 0100",
  serviceType: "standard_tow",
  pickupAddress: "Current GPS location · 7148 Pixel Pkwy",
  dropoffAddress: "Certified repair shop · 2200 Mockingbird Ct",
  vehicleMake: "Mercedes-Benz",
  vehicleModel: "GLE",
  vehicleColor: "Black",
  rush: true,
});

const pastRequests = demoRequestHistory;

export default function CustomerDashboardPage() {
  return (
    <main className="min-h-screen bg-[#050608] px-5 pb-28 pt-5 text-white sm:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between pb-5">
        <Link href="/" className="text-lg font-black tracking-tight">FindYourTow</Link>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <BackendModePill />
          <Link href="/request" className="rounded-full bg-white px-4 py-2 text-sm font-black text-black">Request tow</Link>
          <Link href="/driver" className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white/78">Driver</Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <SectionLabel>Customer dashboard</SectionLabel>
                <h1 className="mt-3 text-5xl font-black leading-[0.95] tracking-[-0.055em]">Your tow is active.</h1>
                <p className="mt-4 max-w-xl text-lg leading-8 text-white/64">Track the driver, confirm payment status, call the provider, and review every request from one app dashboard.</p>
              </div>
              <span className="rounded-full bg-emerald-300 px-4 py-2 text-sm font-black text-emerald-950">Payment authorized</span>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              <Metric label="ETA" value={`${activeTrip.driver.etaMinutes} min`} />
              <Metric label="Driver" value={activeTrip.driver.name.split(" ")[0]} />
              <Metric label="Total" value={formatMoney(activeTrip.quote.totalCents)} />
              <Metric label="Status" value="On way" />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/customer/trip/${activeTrip.id}`} className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue-500 px-5 text-sm font-black text-white shadow-[0_18px_45px_rgba(59,130,246,0.35)]">Open live tracking</Link>
              <Link href="/help" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.07] px-5 text-sm font-black text-white transition hover:bg-white/[0.12]">Get support</Link>
            </div>
          </Card>

          <Card>
            <SectionLabel>Past requests</SectionLabel>
            <div className="mt-4 space-y-3">
              {pastRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between rounded-2xl bg-white/[0.055] p-4">
                  <div>
                    <p className="font-black">{request.service}</p>
                    <p className="text-sm font-semibold text-white/44">{request.date} · {request.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black">{formatMoney(request.totalCents)}</p>
                    <p className={request.paymentStatus === "demo_refunded" ? "text-sm font-bold text-amber-200" : "text-sm font-bold text-emerald-200"}>{request.paymentStatus.replace("demo_", "")}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5 lg:sticky lg:top-5 lg:self-start">
          <MapExperience drivers={[activeTrip.driver]} route={activeTrip.route} pickup={activeTrip.pickup} dropoff={activeTrip.dropoff} />
          <DriverCard driver={activeTrip.driver} />
          <Card>
            <SectionLabel>Timeline</SectionLabel>
            <div className="mt-4"><StatusTimeline timeline={activeTrip.timeline} /></div>
          </Card>
        </div>
      </section>
      <AppBottomNav activeTab="Track" />
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/24 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/36">{label}</p>
      <p className="mt-2 text-xl font-black">{value}</p>
    </div>
  );
}
