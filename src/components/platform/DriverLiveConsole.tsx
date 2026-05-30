"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type DriverLiveConsoleProps = {
  driverId: string;
};

export function DriverLiveConsole({ driverId }: DriverLiveConsoleProps) {
  const [online, setOnline] = useState(false);
  const [locationStatus, setLocationStatus] = useState("Location standby");

  useEffect(() => {
    if (!online) return;
    let cancelled = false;

    async function sendDriverLocation(position?: GeolocationPosition) {
      const lat = position?.coords.latitude ?? 40.746;
      const lng = position?.coords.longitude ?? -73.985;
      await fetch("/api/driver/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId, lat, lng }),
      });
      if (!cancelled) setLocationStatus(`Live location sending · ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }

    function requestAndSend() {
      if (!("geolocation" in navigator)) {
        void sendDriverLocation();
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => void sendDriverLocation(position),
        () => void sendDriverLocation(),
        { enableHighAccuracy: true, maximumAge: 10_000, timeout: 5_000 },
      );
    }

    requestAndSend();
    const interval = window.setInterval(requestAndSend, 8_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [driverId, online]);

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-black/24 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white/48">Live GPS status</p>
          <p className="mt-1 text-lg font-black">{online ? "Online and broadcasting" : "Offline"}</p>
          <p className="mt-1 text-sm font-bold text-white/50">{locationStatus}</p>
        </div>
        <Button type="button" variant={online ? "danger" : "primary"} onClick={() => setOnline((value) => !value)}>
          {online ? "Go offline" : "Go online"}
        </Button>
      </div>
      <p className="mt-4 text-sm leading-6 text-white/52">
        When enabled, RoadAssistNow requests browser location if available, then posts updates to the driver-location adapter for dispatch tracking.
      </p>
    </div>
  );
}
