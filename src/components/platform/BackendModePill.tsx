import { getBackendModeLabel } from "@/lib/runtime/backend-mode";

export function BackendModePill() {
  const label = getBackendModeLabel();
  const realMarketplace = label.startsWith("Real marketplace");
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.18em] shadow-[0_0_30px_rgba(59,130,246,0.08)] ${realMarketplace ? "border-emerald-300/25 bg-emerald-300/12 text-emerald-100" : "border-amber-300/25 bg-amber-300/12 text-amber-100"}`}>
      <span className={`h-2 w-2 rounded-full ${realMarketplace ? "bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" : "bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.9)]"}`} />
      {label}
    </div>
  );
}
