import Link from "next/link";
import { AppTabPageShell } from "@/components/app/AppTabPageShell";
import { VehicleProfileManager } from "@/components/app/VehicleProfileManager";

const accountItems = [
  { label: "Saved vehicles", value: "3", copy: "Toyota Camry, Ford F-150, Honda Accord" },
  { label: "Payment methods", value: "1", copy: "Visa ending 4242" },
  { label: "Trip history", value: "6", copy: "Past roadside jobs" },
];

export default function AccountPage() {
  return (
    <AppTabPageShell activeTab="Account" eyebrow="Profile" title="Account" copy="Manage saved vehicles, payments, trip history, support, and roadside preferences.">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white text-2xl font-black text-black">NM</div>
            <div>
              <h2 className="text-2xl font-black tracking-[-0.04em]">Nir Maman</h2>
              <p className="mt-1 text-sm font-bold text-white/52">Demo customer account</p>
            </div>
          </div>
          <Link href="/request" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-blue-500 px-5 text-sm font-black text-white shadow-[0_18px_45px_rgba(59,130,246,.35)]">Request help</Link>
        </section>

        <section className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {accountItems.map((item) => (
            <div key={item.label} className="rounded-[1.6rem] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-white/68">{item.label}</p>
                  <p className="mt-1 text-sm font-bold text-white/44">{item.copy}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-black">{item.value}</span>
              </div>
            </div>
          ))}
        </section>
        <div className="lg:col-span-2"><VehicleProfileManager /></div>
      </div>
    </AppTabPageShell>
  );
}
