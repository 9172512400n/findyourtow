import type { AvailableDriver, Coordinate } from "@/features/tow-requests/types";

type MapExperienceProps = {
  drivers?: AvailableDriver[];
  route?: Coordinate[];
  pickup?: Coordinate;
  dropoff?: Coordinate;
  focus?: "customer" | "driver" | "dispatch";
  title?: string;
  progress?: number;
};

export function MapExperience({ drivers = [], route = [], focus = "customer", title, progress = 58 }: MapExperienceProps) {
  const label = title ?? (focus === "dispatch" ? "Live driver map" : focus === "driver" ? "Active route preview" : "Live trip tracking");
  const primaryDriver = drivers[0];

  return (
    <div className="map-card relative min-h-[30rem] overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#07111d] p-4 shadow-2xl shadow-blue-950/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_22%,rgba(59,130,246,0.42),transparent_14%),radial-gradient(circle_at_76%_72%,rgba(16,185,129,0.36),transparent_16%),linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.025))]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle,rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:28px_28px]" />

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 440" aria-hidden="true">
        <path d="M48 374 C110 310 151 282 214 250 C290 212 327 150 455 82" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="26" strokeLinecap="round" />
        <path d="M48 374 C110 310 151 282 214 250 C290 212 327 150 455 82" fill="none" stroke="rgba(15,23,42,.85)" strokeWidth="18" strokeLinecap="round" />
        <path d="M48 374 C110 310 151 282 214 250 C290 212 327 150 455 82" fill="none" stroke="rgba(59,130,246,.96)" strokeWidth="7" strokeLinecap="round" strokeDasharray="14 11" />
        <path d="M62 86 C136 122 182 119 236 92 C316 52 367 52 452 132" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="12" strokeLinecap="round" />
        <path d="M92 196 C143 182 177 196 226 181 C277 166 299 123 352 113" fill="none" stroke="rgba(255,255,255,.11)" strokeWidth="10" strokeLinecap="round" />
        {route.length > 0 && <circle cx="226" cy="242" r="9" fill="#fff" />}
      </svg>

      <div className="relative z-10 flex h-full min-h-[28rem] flex-col justify-between">
        <div className="flex items-center justify-between gap-3">
          <div className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-sm font-black text-white/86 backdrop-blur-xl">{label}</div>
          <div className="rounded-full bg-emerald-300 px-4 py-2 text-sm font-black text-emerald-950">{focus === "dispatch" ? `${drivers.filter((driver) => driver.status !== "busy").length} online` : "ETA live"}</div>
        </div>

        <div className="relative h-80">
          <div className="absolute left-[8%] top-[72%] rounded-full bg-white px-3 py-1 text-xs font-black text-black shadow-xl">Pickup</div>
          <div className="absolute right-[5%] top-[9%] rounded-full bg-blue-300 px-3 py-1 text-xs font-black text-blue-950 shadow-xl">Drop-off</div>
          <div className="truck-marker absolute left-[46%] top-[45%] flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white text-xl shadow-[0_22px_70px_rgba(59,130,246,0.42)]">🚚</div>
          {drivers.map((driver, index) => (
            <div
              key={driver.id}
              className="absolute rounded-2xl border border-white/10 bg-black/60 px-3 py-2 text-xs font-black text-white shadow-2xl backdrop-blur-xl"
              style={{ left: `${13 + index * 19}%`, top: `${26 + index * 11}%` }}
            >
              {driver.truckNumber} · {driver.etaMinutes}m
            </div>
          ))}
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-black/38 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/42">Route progress</p>
              <p className="mt-1 font-black text-white">{primaryDriver ? `${primaryDriver.name} · ${primaryDriver.truckNumber}` : "Closest trucks scanning"}</p>
            </div>
            <p className="text-2xl font-black text-emerald-200">{progress}%</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-emerald-300" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold text-white/68">
            <div className="rounded-2xl bg-white/[0.055] p-3">Geocoding ready</div>
            <div className="rounded-2xl bg-white/[0.055] p-3">Route ETA</div>
            <div className="rounded-2xl bg-white/[0.055] p-3">Live GPS sim</div>
          </div>
        </div>
      </div>
    </div>
  );
}
