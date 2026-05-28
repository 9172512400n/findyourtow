"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppTabPageShell } from "@/components/app/AppTabPageShell";
import { DriverCard } from "@/components/platform/DriverCard";
import { MapExperience } from "@/components/platform/MapExperience";
import { StatusTimeline } from "@/components/platform/StatusTimeline";
import { Card, SectionLabel } from "@/components/ui/card";
import { availableDrivers } from "@/features/tow-requests/mock-data";
import type { TowStatus } from "@/features/tow-requests/types";

export default function TrackPage() {
  const driver = availableDrivers[0];
  const [progress, setProgress] = useState(36);

  useEffect(() => {
    const interval = window.setInterval(() => setProgress((current) => (current >= 94 ? 38 : current + 4)), 1800);
    return () => window.clearInterval(interval);
  }, []);

  const eta = Math.max(2, driver.etaMinutes - Math.floor(progress / 18));
  const liveDriver = useMemo(() => ({ ...driver, etaMinutes: eta, status: "assigned" as const }), [driver, eta]);
  const timeline = buildLiveTimeline(progress);

  return (
    <AppTabPageShell activeTab="Track" eyebrow="Live tracking" title="Track your tow" copy="Follow the provider, ETA, route progress, and trip status from one clean tracking screen.">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <MapExperience drivers={[liveDriver]} focus="customer" title="Active tow tracking" progress={progress} />
        <div className="space-y-4">
          <DriverCard driver={liveDriver} />
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-100/55">Current trip</p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.04em]">Driver en route</h2>
            <div className="mt-4 space-y-3 text-sm font-bold text-white/66">
              <p>Pickup · Current location</p>
              <p>Drop-off · Trusted repair shop</p>
              <p>ETA · {eta} minutes</p>
              <p>Route progress · {progress}%</p>
            </div>
            <div className="mt-5 rounded-full bg-white/10 p-1">
              <div className="h-3 rounded-full bg-blue-400 transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
            <Link href="/customer/trip/demo" className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-black text-black">Open full trip view</Link>
          </div>
          <Card>
            <SectionLabel>Live status</SectionLabel>
            <div className="mt-4"><StatusTimeline timeline={timeline} /></div>
          </Card>
        </div>
      </div>
    </AppTabPageShell>
  );
}

function buildLiveTimeline(progress: number) {
  const now = new Date();
  const steps: Array<{ status: TowStatus; label: string }> = [
    { status: "quote_created", label: "Request confirmed" },
    { status: "driver_assigned", label: "Provider assigned" },
    { status: "driver_on_the_way", label: "Provider on the way" },
    { status: "driver_arrived", label: "Provider arriving soon" },
    { status: "vehicle_picked_up", label: "Service in progress" },
    { status: "completed", label: "Completed" },
  ];

  return steps.map((step, index) => ({
    ...step,
    timestamp: new Date(now.getTime() + index * 4 * 60_000).toISOString(),
    complete: index <= Math.floor(progress / 24),
  }));
}
