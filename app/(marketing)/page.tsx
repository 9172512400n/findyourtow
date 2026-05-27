import Link from "next/link";
import { BackendModePill } from "@/components/platform/BackendModePill";

const stats = [
  { value: "7m", label: "demo avg ETA" },
  { value: "42", label: "sample vetted drivers" },
  { value: "100%", label: "transparent demo quotes" },
];

const appPreviews = [
  {
    title: "Customer app",
    eyebrow: "Request + track",
    href: "/request",
    description: "A one-thumb roadside flow: pick service, confirm pickup, authorize payment, and watch the tow truck move live.",
    points: ["Instant quote", "Driver ETA", "Safety actions"],
  },
  {
    title: "Driver app",
    eyebrow: "Accept + earn",
    href: "/driver",
    description: "Drivers get clean job offers, route context, status controls, and daily earnings without dispatcher chaos.",
    points: ["Online toggle", "Job offers", "Earnings view"],
  },
  {
    title: "Dispatch command",
    eyebrow: "Operate + scale",
    href: "/admin/dispatch",
    description: "Operators see active requests, driver availability, match quality, revenue, approvals, and service-area health.",
    points: ["Live map", "Auto-match", "Approvals"],
  },
];

const howItWorks = [
  "Customer requests help and gets a clear quote",
  "Payment is authorized before dispatch",
  "Closest qualified driver gets the offer",
  "Customer tracks ETA, route, driver, and status",
];

const trustItems = ["Vetted driver profiles", "Payment-before-dispatch workflow", "Live status history", "Refund-ready payment structure"];
const areas = ["New York City", "Long Island", "Westchester", "New Jersey", "Airport corridors", "Fleet accounts"];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] text-white">
      <section className="relative isolate px-5 py-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(67,141,255,0.42),transparent_30%),radial-gradient(circle_at_78%_8%,rgba(35,255,185,0.22),transparent_26%),linear-gradient(180deg,#06080c_0%,#080b10_46%,#020304_100%)]" />
        <div className="absolute left-1/2 top-24 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl lg:h-[38rem] lg:w-[38rem]" />

        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <Link href="/" className="flex items-center gap-3" aria-label="FindYourTow home">
            <img
              src="/brand/findyourtow-logo-transparent.png"
              alt="FindYourTow logo"
              className="h-12 w-auto rounded-2xl object-contain shadow-[0_0_40px_rgba(56,189,248,0.22)] sm:h-14"
            />
          </Link>
          <div className="hidden items-center gap-7 text-sm font-bold text-white/62 lg:flex">
            <a href="#apps" className="transition hover:text-white">Apps</a>
            <a href="#trust" className="transition hover:text-white">Trust</a>
            <a href="#pricing" className="transition hover:text-white">Pricing</a>
            <a href="#areas" className="transition hover:text-white">Areas</a>
          </div>
          <div className="flex items-center gap-2">
            <BackendModePill />
            <Link href="/request" className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-black transition hover:scale-[1.02] hover:bg-blue-100">Request tow</Link>
          </div>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-12 pb-20 pt-16 lg:min-h-[calc(100vh-5.5rem)] lg:grid-cols-[1.02fr_0.98fr] lg:pt-12">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-3 py-2 text-sm font-bold text-blue-100 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
              Advanced demo · no real accounts or payments
            </div>
            <h1 className="text-balance text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-7xl lg:text-8xl">
              Smart towing platform for real roadside operators.
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-white/74 sm:text-xl">
              FindYourTow connects customers, drivers, and dispatchers in a live roadside assistance network with real-time requests, clear pricing, and a calm command center.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/request" className="inline-flex h-14 items-center justify-center rounded-full bg-blue-500 px-7 text-base font-black text-white shadow-[0_18px_60px_rgba(59,130,246,0.38)] transition hover:-translate-y-0.5 hover:bg-blue-400">Try customer app</Link>
              <Link href="/admin/dispatch" className="inline-flex h-14 items-center justify-center rounded-full border border-white/14 bg-white/[0.06] px-7 text-base font-black text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/12">View dispatch demo</Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="premium-card rounded-3xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl">
                  <div className="text-3xl font-black tracking-tight">{item.value}</div>
                  <div className="mt-1 text-sm font-bold text-white/50">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[32rem] lg:mr-0">
            <div className="absolute -inset-6 rounded-[3rem] bg-blue-500/15 blur-3xl" />
            <div className="float-card relative rounded-[2.25rem] border border-white/12 bg-[#0b0f15]/90 p-4 shadow-2xl shadow-black/60 backdrop-blur-2xl">
              <div className="rounded-[1.85rem] border border-white/10 bg-gradient-to-b from-white/[0.11] to-white/[0.035] p-4">
                <div className="mb-5 flex items-center justify-between">
                  <div><p className="text-xs font-black uppercase tracking-[0.32em] text-blue-200/70">Live request</p><h2 className="mt-1 text-2xl font-black tracking-tight">Flatbed rescue</h2></div>
                  <span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-emerald-950">Paid</span>
                </div>
                <div className="rounded-[1.5rem] bg-black/38 p-4 ring-1 ring-white/10">
                  <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-white/48">Pickup</p><p className="mt-1 text-lg font-black">FDR Drive · Exit 10</p></div><div className="text-right"><p className="text-sm font-bold text-white/48">Arrival</p><p className="mt-1 text-lg font-black text-blue-200">6 min</p></div></div>
                  <div className="my-5 h-44 rounded-[1.25rem] border border-white/10 bg-[radial-gradient(circle_at_30%_35%,rgba(59,130,246,0.55),transparent_18%),radial-gradient(circle_at_70%_66%,rgba(110,231,183,0.45),transparent_15%),linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))] p-4">
                    <div className="flex h-full flex-col justify-between"><div className="h-3 w-3 rounded-full bg-blue-200 shadow-[0_0_18px_rgba(191,219,254,1)]" /><div className="relative h-px bg-white/24"><span className="absolute left-1/3 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white" /><span className="truck-marker absolute right-12 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-2xl bg-white text-lg shadow-xl">🚚</span></div><div className="self-end rounded-full bg-white px-3 py-1 text-xs font-black text-black">Truck 204</div></div>
                  </div>
                  <div className="grid gap-2">
                    {howItWorks.map((checkpoint, index) => <div key={checkpoint} className="flex items-center gap-3 rounded-2xl bg-white/[0.055] px-3 py-2.5"><span className={`h-2.5 w-2.5 rounded-full ${index < 3 ? "bg-emerald-300" : "bg-white/28"}`} /><span className="text-sm font-bold text-white/82">{checkpoint}</span></div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="apps" className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl"><p className="text-sm font-black uppercase tracking-[0.35em] text-blue-300">Complete prototype</p><h2 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-6xl">Three polished apps, one connected dispatch system.</h2></div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {appPreviews.map((app) => <Link key={app.title} href={app.href} className="group rounded-[2rem] border border-white/10 bg-white/[0.055] p-7 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.085]"><p className="text-sm font-black uppercase tracking-[0.28em] text-white/38">{app.eyebrow}</p><h3 className="mt-5 text-2xl font-black tracking-tight">{app.title}</h3><p className="mt-4 text-base leading-7 text-white/66">{app.description}</p><div className="mt-6 flex flex-wrap gap-2">{app.points.map((point) => <span key={point} className="rounded-full bg-black/28 px-3 py-2 text-xs font-black text-white/62">{point}</span>)}</div><div className="mt-7 h-px bg-gradient-to-r from-blue-300/70 via-white/15 to-transparent" /></Link>)}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
          <div id="trust" className="rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(255,255,255,0.065)_38%,rgba(5,6,8,0.96))] p-8 sm:p-10"><p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-300">Trust + safety</p><h2 className="mt-4 text-4xl font-black tracking-[-0.045em]">Built for vulnerable roadside moments.</h2><div className="mt-7 grid gap-3 sm:grid-cols-2">{trustItems.map((item) => <div key={item} className="rounded-2xl bg-black/28 p-4 font-bold text-white/76">{item}</div>)}</div></div>
          <div id="pricing" className="rounded-[2.5rem] border border-white/10 bg-white/[0.055] p-8 sm:p-10"><p className="text-sm font-black uppercase tracking-[0.35em] text-blue-300">Pricing transparency</p><h2 className="mt-4 text-4xl font-black tracking-[-0.045em]">Quote first. Dispatch second.</h2><p className="mt-5 text-lg leading-8 text-white/66">The demo pricing engine shows base service, mileage, rush, heavy vehicle, platform fee, payment status, and refund-ready structure before the driver is assigned.</p><Link href="/request" className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-black text-black">See quote flow</Link></div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-[#0b0f15] p-8 sm:p-10">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-300">How it works</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-4">{howItWorks.map((item, index) => <div key={item} className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6"><div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-black">{index + 1}</div><p className="text-lg font-black leading-7">{item}</p></div>)}</div>
        </div>
      </section>

      <footer id="areas" className="px-5 pb-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2.25rem] border border-white/10 bg-white/[0.045] p-8 text-white/68 sm:p-10 lg:grid-cols-[1fr_1.1fr]">
          <div><h2 className="text-2xl font-black text-white">FindYourTow</h2><p className="mt-3 max-w-lg leading-7">Investor-ready advanced demo for a modern towing marketplace. Ready for Supabase, Stripe, Mapbox, and live dispatch when credentials are intentionally connected.</p><p className="mt-5 font-bold text-white">Contact: demo@findyourtow.com · (516) 555-TOWS</p></div>
          <div><p className="text-sm font-black uppercase tracking-[0.28em] text-white/42">Demo service areas</p><div className="mt-4 flex flex-wrap gap-2">{areas.map((area) => <span key={area} className="rounded-full bg-black/28 px-4 py-2 text-sm font-bold text-white/70">{area}</span>)}</div></div>
        </div>
      </footer>
    </main>
  );
}
