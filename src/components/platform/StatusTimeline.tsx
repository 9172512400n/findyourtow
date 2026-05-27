import type { TowTrip } from "@/features/tow-requests/types";

export function StatusTimeline({ timeline }: { timeline: TowTrip["timeline"] }) {
  return (
    <div className="space-y-3">
      {timeline.map((item) => (
        <div key={`${item.status}-${item.label}`} className="flex items-center gap-3 rounded-2xl bg-white/[0.055] p-3">
          <span className={`h-3 w-3 rounded-full ${item.complete ? "bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,.9)]" : "bg-white/24"}`} />
          <div>
            <p className="text-sm font-black text-white">{item.label}</p>
            <p className="text-xs font-semibold text-white/42">{new Date(item.timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
