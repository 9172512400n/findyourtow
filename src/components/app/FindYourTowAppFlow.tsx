"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppBottomNav, type AppTabLabel } from "@/components/app/AppBottomNav";
import { DriverCard } from "@/components/platform/DriverCard";
import { MapExperience } from "@/components/platform/MapExperience";
import { StatusTimeline } from "@/components/platform/StatusTimeline";
import { Button } from "@/components/ui/button";
import { Card, SectionLabel } from "@/components/ui/card";
import { calculateQuote, formatMoney } from "@/features/pricing/pricing-engine";
import { availableDrivers, serviceOptions } from "@/features/tow-requests/mock-data";
import type { AvailableDriver, ServiceTypeId, TowTrip } from "@/features/tow-requests/types";

const towServiceIds: ServiceTypeId[] = ["standard_tow", "flatbed_tow", "winch_out", "accident_tow", "motorcycle_tow", "vehicle_transport"];
const compactServiceIds: ServiceTypeId[] = ["standard_tow", "flatbed_tow", "jump_start", "flat_tire", "lockout", "fuel_delivery", "winch_out", "battery_help"];

const serviceShortNames: Record<ServiceTypeId, string> = {
  standard_tow: "Tow",
  flatbed_tow: "Flatbed",
  jump_start: "Jump",
  flat_tire: "Flat Tire",
  lockout: "Lockout",
  fuel_delivery: "Fuel",
  winch_out: "Winch",
  accident_tow: "Accident",
  motorcycle_tow: "Moto",
  battery_help: "Battery",
  vehicle_transport: "Transport",
};

type FlowData = {
  serviceType: ServiceTypeId;
  pickupAddress: string;
  dropoffAddress: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor: string;
  licensePlate: string;
  vehicleType: string;
  notes: string;
  rush: boolean;
  photoAttached: boolean;
  paymentMethod: "card" | "cash_demo";
};

const initialData: FlowData = {
  serviceType: "standard_tow",
  pickupAddress: "",
  dropoffAddress: "Trusted repair shop · Long Island City",
  vehicleMake: "",
  vehicleModel: "",
  vehicleYear: "",
  vehicleColor: "",
  licensePlate: "",
  vehicleType: "Sedan / small SUV",
  notes: "",
  rush: false,
  photoAttached: false,
  paymentMethod: "card",
};

export function FindYourTowAppFlow({ activeTab = "Home", initialStep = 0 }: { activeTab?: AppTabLabel; initialStep?: number } = {}) {
  const [step, setStep] = useState(initialStep);
  const [data, setData] = useState<FlowData>(initialData);
  const selectedService = useMemo(() => serviceOptions.find((service) => service.id === data.serviceType) ?? serviceOptions[0], [data.serviceType]);
  const isTowService = towServiceIds.includes(data.serviceType);
  const quote = useMemo(
    () => calculateQuote({ serviceType: data.serviceType, distanceMiles: isTowService ? 7.8 : 1.6, rush: data.rush }),
    [data.serviceType, data.rush, isTowService],
  );
  const providers = useMemo(() => availableDrivers.filter((driver) => driver.services.includes(data.serviceType)).slice(0, 3), [data.serviceType]);
  const provider = providers[0] ?? availableDrivers[0];
  const trip = useMemo(() => buildAppTrip(data, provider, quote), [data, provider, quote]);

  function patch(next: Partial<FlowData>) {
    setData((current) => ({ ...current, ...next }));
  }

  function selectService(serviceType: ServiceTypeId) {
    patch({ serviceType, dropoffAddress: towServiceIds.includes(serviceType) ? data.dropoffAddress || initialData.dropoffAddress : "" });
    setStep(towServiceIds.includes(serviceType) ? 1 : 2);
  }

  function startFlow() {
    if (!data.pickupAddress.trim()) {
      patch({ pickupAddress: "Current location · 5th Ave & W 34th St" });
    }
    setStep(isTowService ? 1 : 2);
  }

  const canContinueFromVehicle = Boolean(data.vehicleMake.trim() && data.vehicleModel.trim() && data.vehicleYear.trim() && data.vehicleColor.trim());

  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_9%,rgba(59,130,246,.28),transparent_24%),radial-gradient(circle_at_18%_42%,rgba(16,185,129,.14),transparent_22%),linear-gradient(180deg,#050608_0%,#07101a_48%,#020306_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-[0.11] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:54px_54px]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-28 pt-4 sm:px-8 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:pb-10">
        <div className="mx-auto flex w-full max-w-[460px] flex-1 flex-col lg:mx-0">
          <MinimalTopBar />

          <div className="flex flex-1 flex-col justify-center py-8 sm:py-10">
            <div className="relative mb-8 h-72 overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.045] shadow-2xl shadow-blue-950/30 backdrop-blur-xl sm:h-80 lg:hidden">
              <PremiumMapVisual selectedService={selectedService} />
            </div>

            <div className="space-y-4">
              <p className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.26em] text-white/52">Demo mode · live ETA</p>
              <h1 className="text-balance text-6xl font-black leading-[0.88] tracking-[-0.075em] sm:text-7xl">Roadside help in minutes.</h1>
              <p className="max-w-sm text-base font-semibold leading-7 text-white/58">Towing, lockouts, jump starts, tire help, fuel delivery, and more.</p>
            </div>

            <HelpInputCard
              pickupAddress={data.pickupAddress}
              selectedService={selectedService}
              onPickupChange={(pickupAddress) => patch({ pickupAddress })}
              onUseCurrent={() => patch({ pickupAddress: "Current location · 5th Ave & W 34th St" })}
              onStart={startFlow}
            />

            <CompactServices selectedService={data.serviceType} onSelect={selectService} />
          </div>
        </div>

        <aside className="hidden items-center justify-center lg:flex">
          <div className="relative h-[760px] w-full max-w-[660px] overflow-hidden rounded-[3.2rem] border border-white/10 bg-white/[0.045] p-7 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
            <PremiumMapVisual selectedService={selectedService} large />
          </div>
        </aside>
      </section>

      <AppBottomNav activeTab={activeTab} />

      {step > 0 && (
        <div aria-label="Request flow sheet area" className="fixed inset-0 z-50 flex items-end justify-center bg-black/52 px-0 pt-0 pb-[calc(5.75rem+env(safe-area-inset-bottom))] backdrop-blur-sm sm:px-5 sm:pt-5 sm:pb-28 lg:p-5">
          <div className="max-h-[88vh] w-full max-w-[560px] overflow-y-auto rounded-t-[2.2rem] border border-white/10 bg-[#080b11]/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:rounded-[2.4rem]">
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-white/18" />
            <FlowHeader step={step} onClose={() => setStep(0)} />
            {step === 1 && <DestinationStep dropoffAddress={data.dropoffAddress} serviceLabel={selectedService.label} onChange={(dropoffAddress) => patch({ dropoffAddress })} onNext={() => setStep(2)} />}
            {step === 2 && <VehicleStep data={data} onChange={patch} onNext={() => setStep(3)} canContinue={canContinueFromVehicle} />}
            {step === 3 && <QuoteStep quote={quote} selectedService={selectedService} providers={providers} rush={data.rush} onRushChange={(rush) => patch({ rush })} onNext={() => setStep(4)} />}
            {step === 4 && <PaymentStep method={data.paymentMethod} onMethodChange={(paymentMethod) => patch({ paymentMethod })} total={quote.totalCents} onNext={() => setStep(5)} />}
            {step === 5 && <MatchStep provider={provider} onNext={() => setStep(6)} />}
            {step === 6 && <ConfirmStep data={data} provider={provider} quote={quote} onNext={() => setStep(7)} />}
            {step === 7 && <TrackStep trip={trip} />}
          </div>
        </div>
      )}
    </main>
  );
}

function MinimalTopBar() {
  return (
    <nav className="flex items-center justify-between py-2">
      <Link href="/" aria-label="FindYourTow home" className="flex items-center gap-2.5">
        <span className="grid h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.055] shadow-[0_0_28px_rgba(56,189,248,0.18)] backdrop-blur-xl">
          <img src="/brand/findyourtow-logo-transparent.png" alt="FindYourTow logo mark" className="h-full w-full scale-[1.55] object-cover drop-shadow-[0_0_18px_rgba(56,189,248,0.42)]" />
        </span>
        <span className="text-lg font-black tracking-[-0.045em] text-white drop-shadow-[0_0_18px_rgba(255,255,255,0.16)]">FindYourTow</span>
      </Link>
      <div className="flex items-center gap-2">
        <Link href="/account" aria-label="Account" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.055] text-lg text-white/78 backdrop-blur-xl">◌</Link>
        <button type="button" aria-label="Open menu" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.055] text-xl text-white/78 backdrop-blur-xl">☰</button>
      </div>
    </nav>
  );
}

function PremiumMapVisual({ selectedService, large = false }: { selectedService: { label: string; etaMinutes: number }; large?: boolean }) {
  return (
    <div className="relative h-full min-h-full overflow-hidden rounded-[inherit] bg-[#07111d]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(59,130,246,.5),transparent_17%),radial-gradient(circle_at_26%_68%,rgba(16,185,129,.34),transparent_16%),radial-gradient(circle_at_74%_28%,rgba(255,255,255,.16),transparent_16%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:46px_46px]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 620" aria-hidden="true">
        <path d="M58 532 C145 430 185 390 246 332 C326 256 386 198 474 88" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="30" strokeLinecap="round" />
        <path d="M58 532 C145 430 185 390 246 332 C326 256 386 198 474 88" fill="none" stroke="rgba(10,18,30,.9)" strokeWidth="20" strokeLinecap="round" />
        <path d="M58 532 C145 430 185 390 246 332 C326 256 386 198 474 88" fill="none" stroke="rgba(96,165,250,.95)" strokeWidth="7" strokeLinecap="round" strokeDasharray="16 13" />
        <path d="M56 148 C132 200 210 178 268 132 C336 78 408 94 468 160" fill="none" stroke="rgba(255,255,255,.13)" strokeWidth="13" strokeLinecap="round" />
        <path d="M72 304 C155 280 214 306 282 268 C326 244 368 214 440 224" fill="none" stroke="rgba(255,255,255,.10)" strokeWidth="12" strokeLinecap="round" />
      </svg>
      <div className="absolute left-[15%] top-[69%] h-8 w-8 rounded-full bg-emerald-300 shadow-[0_0_0_14px_rgba(110,231,183,.12),0_0_70px_rgba(110,231,183,.7)]" />
      <div className="absolute left-[calc(15%+2.2rem)] top-[68%] rounded-full bg-black/55 px-3 py-1.5 text-xs font-black text-white backdrop-blur-xl">Current location</div>
      <div className="truck-marker absolute left-[50%] top-[43%] grid h-14 w-14 place-items-center rounded-2xl border border-white/25 bg-white text-2xl shadow-[0_25px_80px_rgba(59,130,246,.55)]">🚚</div>
      <div className="absolute right-[8%] top-[14%] rounded-[1.4rem] border border-white/10 bg-black/58 px-4 py-3 text-right shadow-2xl backdrop-blur-xl">
        <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-white/44">Live ETA</p>
        <p className="mt-1 text-2xl font-black">{selectedService.etaMinutes} min</p>
      </div>
      <div className="absolute bottom-6 left-6 right-6 rounded-[1.7rem] border border-white/10 bg-black/50 p-4 backdrop-blur-2xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-100/60">Selected service</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className={`${large ? "text-3xl" : "text-xl"} font-black tracking-[-0.04em]`}>{selectedService.label}</p>
          <span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-emerald-950">available</span>
        </div>
      </div>
    </div>
  );
}

function HelpInputCard({ pickupAddress, selectedService, onPickupChange, onUseCurrent, onStart }: { pickupAddress: string; selectedService: { label: string }; onPickupChange: (value: string) => void; onUseCurrent: () => void; onStart: () => void }) {
  return (
    <div aria-label="Where do you need help" className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl">
      <p className="px-1 text-lg font-black tracking-[-0.02em]">Where do you need help?</p>
      <div className="mt-4 flex items-center gap-2 rounded-[1.35rem] bg-black/32 p-2">
        <button type="button" onClick={onUseCurrent} className="shrink-0 rounded-full bg-white px-4 py-3 text-xs font-black text-black">Use current location</button>
        <input value={pickupAddress} onChange={(event) => onPickupChange(event.target.value)} placeholder="Enter address or landmark" className="min-w-0 flex-1 bg-transparent px-2 text-sm font-bold text-white outline-none placeholder:text-white/34" />
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <button type="button" aria-label={`Service ${serviceShortNames[selectedServiceIdFromLabel(selectedService.label)] ?? selectedService.label}`} className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-3 text-left text-sm font-black text-white/78">Service · {selectedService.label}</button>
        <button type="button" onClick={onStart} className="rounded-full bg-blue-500 px-5 py-3 text-sm font-black text-white shadow-[0_18px_45px_rgba(59,130,246,.35)]">Continue</button>
      </div>
    </div>
  );
}

function selectedServiceIdFromLabel(label: string): ServiceTypeId {
  return serviceOptions.find((service) => service.label === label)?.id ?? "standard_tow";
}

function CompactServices({ selectedService, onSelect }: { selectedService: ServiceTypeId; onSelect: (serviceType: ServiceTypeId) => void }) {
  const services = compactServiceIds.map((id) => serviceOptions.find((service) => service.id === id)).filter(Boolean) as typeof serviceOptions;
  return (
    <div id="services" aria-label="Quick service selector" className="mt-6 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {services.map((service) => (
        <button key={service.id} type="button" onClick={() => onSelect(service.id)} className={`flex min-w-[5.4rem] flex-col items-center gap-2 rounded-[1.4rem] border px-4 py-3 transition active:scale-95 ${selectedService === service.id ? "border-blue-300 bg-blue-500/18 text-white" : "border-white/10 bg-white/[0.055] text-white/60"}`}>
          <span className="text-2xl leading-none">{service.icon}</span>
          <span className="text-xs font-black">{serviceShortNames[service.id]}</span>
        </button>
      ))}
    </div>
  );
}

function FlowHeader({ step, onClose }: { step: number; onClose: () => void }) {
  const labels = ["", "Destination", "Vehicle", "Quote", "Payment", "Provider", "Confirm", "Track"];
  return <div className="mb-5 flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[0.24em] text-blue-100/62">{labels[step]}</p><button type="button" onClick={onClose} className="rounded-full bg-white/10 px-4 py-2 text-xs font-black text-white/70">Close</button></div>;
}

function DestinationStep({ serviceLabel, dropoffAddress, onChange, onNext }: { serviceLabel: string; dropoffAddress: string; onChange: (value: string) => void; onNext: () => void }) {
  return <div className="space-y-4"><StepTitle title="Add destination" copy={`${serviceLabel} needs a drop-off so the estimate includes distance.`} /><input value={dropoffAddress} onChange={(event) => onChange(event.target.value)} placeholder="Repair shop, home, or destination" className="w-full rounded-[1.4rem] border border-white/10 bg-black/35 px-4 py-4 font-bold outline-none focus:border-blue-300" /><MiniMap mode="route" /><Button className="w-full" disabled={!dropoffAddress.trim()} onClick={onNext}>Continue</Button></div>;
}

function VehicleStep({ data, onChange, onNext, canContinue }: { data: FlowData; onChange: (next: Partial<FlowData>) => void; onNext: () => void; canContinue: boolean }) {
  const fields: Array<[keyof FlowData, string]> = [["vehicleMake", "Make"], ["vehicleModel", "Model"], ["vehicleYear", "Year"], ["vehicleColor", "Color"], ["licensePlate", "Plate"]];
  return <div className="space-y-4"><StepTitle title="Vehicle details" copy="Just enough for the provider to identify your vehicle quickly." /><div className="grid gap-3 sm:grid-cols-2">{fields.map(([key, placeholder]) => <input key={key} value={String(data[key] ?? "")} onChange={(event) => onChange({ [key]: event.target.value })} placeholder={placeholder} className="rounded-[1.25rem] border border-white/10 bg-black/35 px-4 py-4 font-bold outline-none focus:border-blue-300" />)}</div><select value={data.vehicleType} onChange={(event) => onChange({ vehicleType: event.target.value })} className="w-full rounded-[1.25rem] border border-white/10 bg-black/35 px-4 py-4 font-bold outline-none focus:border-blue-300">{["Sedan / small SUV", "Large SUV", "Pickup truck", "Van", "Motorcycle", "Commercial vehicle"].map((type) => <option key={type}>{type}</option>)}</select><textarea value={data.notes} onChange={(event) => onChange({ notes: event.target.value })} placeholder="Optional notes" className="min-h-20 w-full rounded-[1.25rem] border border-white/10 bg-black/35 px-4 py-4 font-bold outline-none focus:border-blue-300" /><button type="button" onClick={() => onChange({ photoAttached: true })} className="w-full rounded-[1.3rem] border border-dashed border-white/18 bg-white/[0.045] px-5 py-4 text-left font-black text-white/72">{data.photoAttached ? "Photo attached" : "Upload vehicle photo"}</button><Button className="w-full" disabled={!canContinue} onClick={onNext}>Get instant quote</Button></div>;
}

function QuoteStep({ quote, selectedService, providers, rush, onRushChange, onNext }: { quote: ReturnType<typeof calculateQuote>; selectedService: { label: string }; providers: AvailableDriver[]; rush: boolean; onRushChange: (value: boolean) => void; onNext: () => void }) {
  return <div className="space-y-4"><StepTitle title="Instant quote" copy="Clear estimate before you confirm." /><div className="rounded-[1.8rem] bg-white p-5 text-black"><p className="text-sm font-black text-black/45">{selectedService.label}</p><p className="mt-1 text-5xl font-black tracking-[-0.06em]">{formatMoney(quote.totalCents)}</p><div className="mt-4 space-y-2">{quote.lineItems.map((item) => <div key={`${item.code}-${item.label}`} className="flex justify-between rounded-2xl bg-black/[0.045] px-4 py-3 text-sm font-bold"><span>{item.label}</span><span>{formatMoney(item.amountCents)}</span></div>)}</div></div><label className="flex items-center justify-between rounded-[1.4rem] bg-white/[0.055] px-5 py-4 text-sm font-black text-white/76"><span>Rush priority</span><input type="checkbox" checked={rush} onChange={(event) => onRushChange(event.target.checked)} /></label><div className="grid grid-cols-2 gap-3"><Metric label="ETA" value={`${quote.estimatedEtaMinutes} min`} /><Metric label="Nearby" value={`${providers.length || 1} available`} /></div><Button className="w-full" onClick={onNext}>Continue to payment</Button></div>;
}

function PaymentStep({ method, total, onMethodChange, onNext }: { method: FlowData["paymentMethod"]; total: number; onMethodChange: (method: FlowData["paymentMethod"]) => void; onNext: () => void }) {
  return <div className="space-y-4"><StepTitle title="Payment demo" copy="Authorize before dispatch. Manual payment is demo-only." />{[["card", "Card payment demo", "Visa •••• 4242 · Authorized"], ["cash_demo", "Cash/manual demo", "Demo-only option"]].map(([value, title, copy]) => <button key={value} type="button" onClick={() => onMethodChange(value as FlowData["paymentMethod"])} className={`w-full rounded-[1.4rem] border p-5 text-left ${method === value ? "border-blue-300 bg-blue-500/18" : "border-white/10 bg-white/[0.055]"}`}><p className="font-black">{title}</p><p className="mt-1 text-sm text-white/56">{copy}</p></button>)}<div className="rounded-[1.4rem] bg-emerald-300 px-5 py-4 font-black text-emerald-950">Payment status: {method === "card" ? "Authorized" : "Demo paid"} · {formatMoney(total)}</div><Button className="w-full" onClick={onNext}>Find provider</Button></div>;
}

function MatchStep({ provider, onNext }: { provider: AvailableDriver; onNext: () => void }) {
  return <div className="space-y-4"><StepTitle title="Provider found" copy="Closest verified service provider matched." /><ProviderSummary provider={provider} /><Button className="w-full" onClick={onNext}>Continue</Button></div>;
}

function ConfirmStep({ data, provider, quote, onNext }: { data: FlowData; provider: AvailableDriver; quote: ReturnType<typeof calculateQuote>; onNext: () => void }) {
  return <div className="space-y-4"><StepTitle title="Confirm reservation" copy="Review and open live tracking." /><ProviderSummary provider={provider} /><div className="rounded-[1.4rem] bg-white/[0.055] p-4 text-sm font-bold text-white/70"><p>Pickup: {data.pickupAddress || "Current location"}</p>{data.dropoffAddress && <p className="mt-2">Destination: {data.dropoffAddress}</p>}<p className="mt-2">Total estimate: {formatMoney(quote.totalCents)}</p></div><Button className="w-full" onClick={onNext}>Confirm booking / reservation</Button></div>;
}

function TrackStep({ trip }: { trip: TowTrip }) {
  return <div className="space-y-4"><StepTitle title={`Provider arrives in ${trip.driver.etaMinutes} minutes`} copy="Live route, ETA, and status timeline." /><MapExperience drivers={[trip.driver]} route={trip.route} pickup={trip.pickup} dropoff={trip.dropoff} focus="customer" title="Live tracking" progress={72} /><DriverCard driver={trip.driver} /><Card><SectionLabel>Status timeline</SectionLabel><div className="mt-4"><StatusTimeline timeline={trip.timeline} /></div></Card><Link href="/customer/trip/demo" className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-black text-black">Open full-screen tracking</Link></div>;
}

function ProviderSummary({ provider }: { provider: AvailableDriver }) {
  return <div className="rounded-[1.4rem] bg-white/[0.065] p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xl font-black">{provider.name}</p><p className="mt-1 text-sm font-bold text-white/56">⭐ {provider.rating} · {provider.truckType} · {provider.truckNumber}</p></div><span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-emerald-950">Verified</span></div><div className="mt-4 grid grid-cols-2 gap-2"><a href="tel:+15165551234" className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-black text-black">Phone</a><div className="rounded-2xl bg-black/28 px-4 py-3 text-center text-sm font-black text-white/72">ETA {provider.etaMinutes}m</div></div></div>;
}

function StepTitle({ title, copy }: { title: string; copy: string }) {
  return <div><h2 className="text-3xl font-black tracking-[-0.045em]">{title}</h2><p className="mt-2 text-sm font-bold leading-6 text-white/58">{copy}</p></div>;
}

function MiniMap({ mode }: { mode: "pickup" | "route" }) {
  return <div className="relative h-48 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#07111d]"><div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.13)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.13)_1px,transparent_1px)] [background-size:36px_36px]" /><div className="absolute left-[18%] top-[58%] rounded-full bg-white px-3 py-1 text-xs font-black text-black">Pickup</div>{mode === "route" && <><div className="absolute right-[12%] top-[18%] rounded-full bg-blue-300 px-3 py-1 text-xs font-black text-blue-950">Destination</div><div className="absolute left-[30%] top-[45%] h-2 w-40 rotate-[-25deg] rounded-full bg-blue-400" /></>}<div className="truck-marker absolute left-[45%] top-[42%] grid h-11 w-11 place-items-center rounded-2xl bg-white text-xl shadow-2xl">🚚</div></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-black/24 p-3"><p className="text-xs font-bold uppercase tracking-[0.18em] text-white/36">{label}</p><p className="mt-1 font-black">{value}</p></div>;
}

function buildAppTrip(data: FlowData, provider: AvailableDriver, quote: ReturnType<typeof calculateQuote>): TowTrip {
  const now = new Date();
  return {
    id: "demo",
    status: "driver_on_the_way",
    quote,
    pickupAddress: data.pickupAddress || "Current location",
    dropoffAddress: data.dropoffAddress,
    driver: { ...provider, status: "assigned" },
    pickup: { lat: 40.7484, lng: -73.9857 },
    dropoff: { lat: 40.7614, lng: -73.9776 },
    route: [{ lat: 40.746, lng: -73.985 }, { lat: 40.7484, lng: -73.9857 }, { lat: 40.752, lng: -73.982 }, { lat: 40.757, lng: -73.98 }, { lat: 40.7614, lng: -73.9776 }],
    timeline: [
      { status: "quote_created", label: "Request confirmed", timestamp: now.toISOString(), complete: true },
      { status: "driver_assigned", label: "Provider assigned", timestamp: now.toISOString(), complete: true },
      { status: "driver_on_the_way", label: "Provider on the way", timestamp: now.toISOString(), complete: true },
      { status: "driver_arrived", label: "Provider arrived", timestamp: new Date(now.getTime() + 9 * 60_000).toISOString(), complete: false },
      { status: "vehicle_picked_up", label: data.dropoffAddress ? "Vehicle picked up" : "Service started", timestamp: new Date(now.getTime() + 13 * 60_000).toISOString(), complete: false },
      { status: "completed", label: "Completed", timestamp: new Date(now.getTime() + 38 * 60_000).toISOString(), complete: false },
    ],
  };
}
