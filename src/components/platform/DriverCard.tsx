import type { AvailableDriver } from "@/features/tow-requests/types";

export function DriverCard({ driver }: { driver: AvailableDriver }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-black/24 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white/48">Assigned driver</p>
          <h3 className="mt-1 text-2xl font-black tracking-tight">{driver.name}</h3>
          <p className="mt-1 text-sm font-bold text-white/58">{driver.truckType} · {driver.truckNumber} · ★ {driver.rating}</p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500 text-2xl shadow-[0_14px_40px_rgba(59,130,246,.35)]">🚚</div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-black">
        <a href="tel:+15166664941" className="rounded-full bg-white px-4 py-3 text-center text-black">Call driver</a>
        <button className="rounded-full border border-white/12 bg-white/[0.07] px-4 py-3 text-white">Share trip</button>
      </div>
    </div>
  );
}
