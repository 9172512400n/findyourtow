"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { BackendModePill } from "@/components/platform/BackendModePill";
import { MapExperience } from "@/components/platform/MapExperience";
import { Button } from "@/components/ui/button";
import { Card, SectionLabel } from "@/components/ui/card";
import { formatMoney } from "@/features/pricing/pricing-engine";
import { createTowRequest } from "@/features/tow-requests/api";
import { availableDrivers, serviceOptions } from "@/features/tow-requests/mock-data";
import type { ServiceTypeId, TowRequestPayload, TowTrip } from "@/features/tow-requests/types";

type FormValues = TowRequestPayload & { serviceType: ServiceTypeId };

const defaultValues: FormValues = {
  customerName: "",
  phone: "",
  serviceType: "standard_tow",
  pickupAddress: "Current GPS location · Midtown Manhattan",
  dropoffAddress: "",
  vehicleMake: "",
  vehicleModel: "",
  vehicleYear: "",
  vehicleColor: "",
  notes: "",
  heavyVehicle: false,
  rush: false,
};

const steps = ["Service", "Location", "Vehicle", "Payment"];
const trustedSignals = ["Vetted drivers", "Quote before dispatch", "Payment authorized only", "Live ETA + route"];

export default function RequestTowPage() {
  const [trip, setTrip] = useState<TowTrip | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, control, setValue } = useForm<FormValues>({ defaultValues });
  const selectedService = useWatch({ control, name: "serviceType" });
  const rush = useWatch({ control, name: "rush" });
  const heavyVehicle = useWatch({ control, name: "heavyVehicle" });
  const selectedOption = useMemo(() => serviceOptions.find((option) => option.id === selectedService) ?? serviceOptions[0], [selectedService]);
  const displayedEstimate = selectedOption.basePriceCents + (rush ? 4000 : 0) + (heavyVehicle ? 5000 : 0);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setError(null);
    try {
      const created = await createTowRequest(values);
      setTrip(created);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create tow request");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050608] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_10%,rgba(59,130,246,.34),transparent_30%),radial-gradient(circle_at_86%_20%,rgba(16,185,129,.16),transparent_26%)]" />
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-5 sm:px-8">
        <Link href="/" className="text-lg font-black tracking-tight">FindYourTow</Link>
        <div className="flex flex-wrap items-center justify-end gap-2"><BackendModePill /><Link href="/driver" className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white/78">Driver</Link><Link href="/admin/dispatch" className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-white/78">Dispatch</Link></div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-16 pt-4 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <SectionLabel>Customer app demo</SectionLabel>
          <h1 className="mt-4 text-5xl font-black leading-[0.95] tracking-[-0.055em] sm:text-7xl">Request a tow like ordering a ride.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">Choose service, confirm pickup, add vehicle details, authorize a simulated payment, and track the closest qualified truck.</p>
          <div className="mt-7 grid grid-cols-4 gap-2">
            {steps.map((step, index) => <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.055] p-3 text-center"><p className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-black">{index + 1}</p><p className="text-xs font-black text-white/62">{step}</p></div>)}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <Card className="premium-card">
              <SectionLabel>1 · Select service</SectionLabel>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {serviceOptions.map((service) => (
                  <button type="button" key={service.id} onClick={() => setValue("serviceType", service.id)} className={`rounded-[1.5rem] border p-4 text-left transition ${selectedService === service.id ? "border-blue-300 bg-blue-500/18 shadow-[0_18px_60px_rgba(59,130,246,0.18)]" : "border-white/10 bg-white/[0.045] hover:bg-white/[0.08]"}`}>
                    <div className="flex items-start justify-between gap-3"><div><p className="font-black">{service.label}</p><p className="mt-1 text-sm leading-6 text-white/56">{service.description}</p></div><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-black">{formatMoney(service.basePriceCents)}+</span></div>
                    <div className="mt-4 flex items-center justify-between text-xs font-black text-white/42"><span>Qualified provider</span><span>{service.etaMinutes} min ETA</span></div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="space-y-4">
              <SectionLabel>2 · Location + vehicle</SectionLabel>
              <div className="grid gap-3 sm:grid-cols-2"><input {...register("customerName", { required: true })} placeholder="Your name" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold outline-none focus:border-blue-300" /><input {...register("phone", { required: true })} placeholder="Phone number" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold outline-none focus:border-blue-300" /></div>
              <input {...register("pickupAddress", { required: true })} placeholder="Current GPS location or enter address" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold outline-none focus:border-blue-300" />
              <input {...register("dropoffAddress")} placeholder="Optional drop-off address for towing" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold outline-none focus:border-blue-300" />
              <div className="grid gap-3 sm:grid-cols-4"><input {...register("vehicleMake", { required: true })} placeholder="Make" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold outline-none focus:border-blue-300" /><input {...register("vehicleModel", { required: true })} placeholder="Model" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold outline-none focus:border-blue-300" /><input {...register("vehicleYear")} placeholder="Year" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold outline-none focus:border-blue-300" /><input {...register("vehicleColor")} placeholder="Color" className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 font-bold outline-none focus:border-blue-300" /></div>
              <div className="grid gap-3 sm:grid-cols-2"><label className="flex items-center gap-3 rounded-2xl bg-black/28 px-4 py-4 text-sm font-bold text-white/72"><input type="checkbox" {...register("heavyVehicle")} /> Heavy vehicle · +$50</label><label className="flex items-center gap-3 rounded-2xl bg-black/28 px-4 py-4 text-sm font-bold text-white/72"><input type="checkbox" {...register("rush")} /> Rush priority · +$40</label></div>
              {error && <p className="rounded-2xl bg-rose-500/15 px-4 py-3 text-sm font-bold text-rose-100">{error}</p>}
              <Button className="w-full" disabled={submitting}>{submitting ? "Authorizing demo payment…" : `Authorize demo payment · ${formatMoney(displayedEstimate)}+`}</Button>
            </Card>
          </form>
        </div>

        <div className="space-y-4 lg:sticky lg:top-5 lg:self-start">
          <MapExperience drivers={availableDrivers} focus="customer" progress={34} />
          <Card>
            <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-bold text-white/48">Instant transparent estimate</p><p className="mt-1 text-4xl font-black">{formatMoney(displayedEstimate)}+</p></div><div className="rounded-full bg-emerald-300 px-4 py-2 text-sm font-black text-emerald-950">ETA {selectedOption.etaMinutes} min</div></div>
            <div className="mt-5 grid gap-2">{trustedSignals.map((signal) => <div key={signal} className="flex items-center gap-3 rounded-2xl bg-black/24 p-3 text-sm font-bold text-white/68"><span className="h-2 w-2 rounded-full bg-emerald-300" />{signal}</div>)}</div>
            <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/24 p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-bold text-white/48">Simulated payment</p><p className="mt-1 text-lg font-black">Stripe PaymentIntent placeholder</p></div><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-black">Secure demo</span></div><p className="mt-3 text-sm leading-6 text-white/56">No real card is charged. The production structure is ready for payment status, refunds, and future driver payouts.</p></div>
            {submitting && <div className="mt-5 rounded-[1.5rem] bg-blue-500/12 p-4 text-sm font-black text-blue-100">Matching your request with nearby qualified trucks…</div>}
            {trip && <div className="mt-5 rounded-[1.5rem] bg-blue-500/16 p-4"><p className="text-sm font-bold text-blue-100">Confirmed · Demo payment authorized · Driver matching started</p><p className="mt-1 text-2xl font-black">{formatMoney(trip.quote.totalCents)}</p><Link href={`/customer/trip/${trip.id}`} className="mt-4 inline-flex rounded-full bg-white px-5 py-3 text-sm font-black text-black">Track live trip</Link></div>}
          </Card>
        </div>
      </section>
    </main>
  );
}
