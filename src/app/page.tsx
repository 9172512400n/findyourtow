import Link from "next/link";

const stats = [
  { value: "4 min", label: "average match target" },
  { value: "24/7", label: "verified roadside coverage" },
  { value: "$0", label: "surprise dispatch fees" },
];

const roles = [
  {
    title: "Customer app",
    eyebrow: "Request",
    description:
      "Book a tow in seconds, see a clear quote, track the driver live, and share trip status with one tap.",
  },
  {
    title: "Driver network",
    eyebrow: "Earn",
    description:
      "Accept nearby jobs, follow clean pickup details, and keep every payout and customer handoff organized.",
  },
  {
    title: "Dispatch command",
    eyebrow: "Operate",
    description:
      "Monitor demand, assign the best truck, resolve edge cases, and keep service quality visible in real time.",
  },
];

const checkpoints = ["Request received", "Live driver matching", "ETA locked", "Driver en route"];

const serviceTypes = ["Tow", "Jump start", "Lockout", "Flat tire"];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] text-white">
      <section className="relative isolate min-h-screen px-5 py-6 sm:px-8 lg:px-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(67,141,255,0.38),transparent_32%),radial-gradient(circle_at_78%_8%,rgba(35,255,185,0.2),transparent_28%),linear-gradient(180deg,#06080c_0%,#080b10_45%,#020304_100%)]" />
        <div className="absolute left-1/2 top-24 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl lg:h-[34rem] lg:w-[34rem]" />
        <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-white/[0.06] px-4 py-3 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          <Link href="/" className="flex items-center gap-3" aria-label="FindYourTow home">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-black text-black shadow-[0_0_40px_rgba(255,255,255,0.18)]">
              FYT
            </span>
            <span className="text-base font-semibold tracking-tight">FindYourTow</span>
          </Link>
          <div className="hidden items-center gap-7 text-sm font-medium text-white/68 md:flex">
            <a href="#platform" className="transition hover:text-white">
              Platform
            </a>
            <a href="#network" className="transition hover:text-white">
              Network
            </a>
            <a href="#safety" className="transition hover:text-white">
              Safety
            </a>
          </div>
          <Link
            href="/request"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black transition hover:scale-[1.02] hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          >
            Request now
          </Link>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-12 pb-16 pt-16 lg:min-h-[calc(100vh-5.5rem)] lg:grid-cols-[1.02fr_0.98fr] lg:pt-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-3 py-2 text-sm font-semibold text-blue-100 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
              Premium roadside dispatch for modern drivers
            </div>

            <h1 className="text-balance text-5xl font-black leading-[0.92] tracking-[-0.065em] text-white sm:text-7xl lg:text-8xl">
              Premium tow dispatch in minutes.
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-white/76 sm:text-xl">
              FindYourTow gives customers instant help, drivers better jobs, and operators a command center that feels fast, calm, and premium.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/request"
                className="inline-flex h-14 items-center justify-center rounded-full bg-blue-500 px-7 text-base font-extrabold text-white shadow-[0_18px_60px_rgba(59,130,246,0.36)] transition hover:-translate-y-0.5 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 focus:ring-offset-black"
              >
                Request a tow now
              </Link>
              <Link
                href="/driver"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/14 bg-white/[0.06] px-7 text-base font-bold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
              >
                Join as a driver
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl">
                  <div className="text-3xl font-black tracking-tight text-white">{item.value}</div>
                  <div className="mt-1 text-sm font-medium text-white/52">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[31rem] lg:mr-0">
            <div className="absolute -inset-6 rounded-[3rem] bg-blue-500/15 blur-3xl" />
            <div className="relative rounded-[2.25rem] border border-white/12 bg-[#0b0f15]/90 p-4 shadow-2xl shadow-black/60 backdrop-blur-2xl">
              <div className="rounded-[1.85rem] border border-white/10 bg-gradient-to-b from-white/[0.10] to-white/[0.035] p-4">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.32em] text-blue-200/70">Live request</p>
                    <h2 className="mt-1 text-2xl font-black tracking-tight">Roadside rescue</h2>
                  </div>
                  <span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-emerald-950">ETA locked</span>
                </div>

                <div className="rounded-[1.5rem] bg-black/38 p-4 ring-1 ring-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white/48">Pickup</p>
                      <p className="mt-1 text-lg font-bold">I-95 North, Exit 16</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white/48">Arrival</p>
                      <p className="mt-1 text-lg font-black text-blue-200">8 min</p>
                    </div>
                  </div>

                  <div className="my-5 h-36 rounded-[1.25rem] border border-white/10 bg-[radial-gradient(circle_at_30%_35%,rgba(59,130,246,0.55),transparent_18%),radial-gradient(circle_at_70%_66%,rgba(110,231,183,0.45),transparent_15%),linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))] p-4">
                    <div className="flex h-full flex-col justify-between">
                      <div className="h-2 w-2 rounded-full bg-blue-200 shadow-[0_0_18px_rgba(191,219,254,1)]" />
                      <div className="relative h-px bg-white/24">
                        <span className="absolute left-1/3 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white" />
                        <span className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_20px_rgba(110,231,183,0.9)]" />
                      </div>
                      <div className="self-end rounded-full bg-white px-3 py-1 text-xs font-black text-black">Truck 204</div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    {checkpoints.map((checkpoint, index) => (
                      <div key={checkpoint} className="flex items-center gap-3 rounded-2xl bg-white/[0.055] px-3 py-2.5">
                        <span className={`h-2.5 w-2.5 rounded-full ${index < 3 ? "bg-emerald-300" : "bg-white/28"}`} />
                        <span className="text-sm font-semibold text-white/82">{checkpoint}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {serviceTypes.map((service) => (
                    <div key={service} className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-bold text-white/78">
                      {service}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-300">Built for every side</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-6xl">One premium platform from request to recovery.</h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {roles.map((role) => (
              <article key={role.title} className="group rounded-[2rem] border border-white/10 bg-white/[0.055] p-7 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.085]">
                <p className="text-sm font-black uppercase tracking-[0.28em] text-white/38">{role.eyebrow}</p>
                <h3 className="mt-5 text-2xl font-black tracking-tight">{role.title}</h3>
                <p className="mt-4 text-base leading-7 text-white/68">{role.description}</p>
                <div className="mt-7 h-px bg-gradient-to-r from-blue-300/70 via-white/15 to-transparent" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="network" className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2.25rem] border border-white/10 bg-white/[0.055] p-8 lg:p-10">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-300">Network intelligence</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.045em]">Match the right truck, not just the closest truck.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Vehicle type and tow capacity",
              "Distance, traffic, and zone demand",
              "Driver acceptance and completion quality",
              "Transparent quote before dispatch",
            ].map((item) => (
              <div key={item} className="rounded-[1.75rem] border border-white/10 bg-[#0b0f15] p-6 text-lg font-bold text-white/82">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="safety" className="px-5 pb-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.2),rgba(255,255,255,0.075)_38%,rgba(5,6,8,0.96))] p-8 shadow-2xl shadow-blue-950/30 sm:p-12 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-blue-200">Safety first</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.045em] text-white sm:text-6xl">
                Professional enough for roadside emergencies. Simple enough for one thumb.
              </h2>
            </div>
            <div className="space-y-4 text-lg leading-8 text-white/72">
              <p>
                Verified drivers, live trip sharing, clear job details, and real-time status updates keep every tow calm and accountable.
              </p>
              <Link href="/customer" className="inline-flex rounded-full bg-white px-6 py-3 text-base font-black text-black transition hover:bg-blue-100">
                View customer dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
