import Link from "next/link";
import { ArrowRight, BatteryCharging, Fuel, KeyRound, LifeBuoy, Route, ShieldAlert, Truck, Wrench } from "lucide-react";
import { AppTabPageShell } from "@/components/app/AppTabPageShell";
import { serviceOptions } from "@/features/tow-requests/mock-data";
import type { ServiceTypeId } from "@/features/tow-requests/types";

const iconMap: Partial<Record<ServiceTypeId, typeof Truck>> = {
  standard_tow: Truck,
  flatbed_tow: Truck,
  jump_start: BatteryCharging,
  flat_tire: Wrench,
  lockout: KeyRound,
  fuel_delivery: Fuel,
  winch_out: Wrench,
  accident_tow: ShieldAlert,
  motorcycle_tow: Truck,
  battery_help: BatteryCharging,
  vehicle_transport: Route,
  heavy_duty_tow: Truck,
  box_truck_tow: Truck,
  private_property_tow: Wrench,
  emergency_roadside: LifeBuoy,
};

export default function ServicesPage() {
  return (
    <AppTabPageShell activeTab="Services" eyebrow="Roadside menu" title="Services" copy="Choose exactly what you need before requesting help. Every service is ready for demo dispatch and future real backend wiring.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {serviceOptions.map((service) => {
          const Icon = iconMap[service.id] ?? LifeBuoy;
          return (
            <Link key={service.id} href="/request" className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/[0.09]">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-black"><Icon size={23} /></span>
              <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">{service.label}</h2>
              <p className="mt-2 text-sm font-bold leading-6 text-white/58">{service.description}</p>
              <div className="mt-5 flex items-center justify-between rounded-full bg-black/28 px-4 py-3 text-sm font-black text-white/72">
                <span>ETA {service.etaMinutes} min</span>
                <span className="inline-flex items-center gap-2">Request <ArrowRight size={15} /></span>
              </div>
            </Link>
          );
        })}
      </div>
    </AppTabPageShell>
  );
}
