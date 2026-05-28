import Link from "next/link";
import { AppTabPageShell } from "@/components/app/AppTabPageShell";
import { DriverCard } from "@/components/platform/DriverCard";
import { MapExperience } from "@/components/platform/MapExperience";
import { availableDrivers } from "@/features/tow-requests/mock-data";

export default function TrackPage() {
  const driver = availableDrivers[0];

  return (
    <AppTabPageShell activeTab="Track" eyebrow="Live tracking" title="Track your tow" copy="Follow the provider, ETA, route progress, and trip status from one clean tracking screen.">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <MapExperience drivers={[driver]} focus="customer" title="Active tow tracking" progress={72} />
        <div className="space-y-4">
          <DriverCard driver={driver} />
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-100/55">Current trip</p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.04em]">Driver en route</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-white/66">
              <p>Pickup · Current location</p>
              <p>Drop-off · Trusted repair shop</p>
              <p>ETA · {driver.etaMinutes} minutes</p>
            </div>
            <Link href="/customer/trip/demo" className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-black text-black">Open full trip view</Link>
          </div>
        </div>
      </div>
    </AppTabPageShell>
  );
}
