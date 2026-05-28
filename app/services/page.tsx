import Link from "next/link";
import { AppTabPageShell } from "@/components/app/AppTabPageShell";
import { serviceOptions } from "@/features/tow-requests/mock-data";

export default function ServicesPage() {
  return (
    <AppTabPageShell activeTab="Services" eyebrow="Roadside menu" title="Services" copy="Choose exactly what you need before requesting help. Every service keeps the fixed bottom bar available.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {serviceOptions.map((service) => (
          <Link key={service.id} href="/request" className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/[0.09]">
            <div className="text-4xl">{service.icon}</div>
            <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">{service.label}</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-white/58">{service.description}</p>
            <div className="mt-5 flex items-center justify-between rounded-full bg-black/28 px-4 py-3 text-sm font-black text-white/72">
              <span>ETA {service.etaMinutes} min</span>
              <span>Request</span>
            </div>
          </Link>
        ))}
      </div>
    </AppTabPageShell>
  );
}
