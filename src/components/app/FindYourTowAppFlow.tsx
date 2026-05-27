"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BackendModePill } from "@/components/platform/BackendModePill";
import { DriverCard } from "@/components/platform/DriverCard";
import { MapExperience } from "@/components/platform/MapExperience";
import { StatusTimeline } from "@/components/platform/StatusTimeline";
import { Button } from "@/components/ui/button";
import { Card, SectionLabel } from "@/components/ui/card";
import { availableDrivers, serviceOptions } from "@/features/tow-requests/mock-data";
import { calculateQuote, formatMoney } from "@/features/pricing/pricing-engine";
import type { AvailableDriver, ServiceTypeId, TowTrip } from "@/features/tow-requests/types";

const towServiceIds: ServiceTypeId[] = ["standard_tow", "flatbed_tow", "winch_out", "accident_tow", "motorcycle_tow", "vehicle_transport"];
const appTabs = [
  { label: "Home", href: "/", icon: "⌂" },
  { label: "Request", href: "/request", icon: "+" },
  { label: "Track", href: "/customer/trip/demo", icon: "◉" },
  { label: "Services", href: "#services", icon: "▦" },
  { label: "Account", href: "/customer", icon: "☻" },
];

const stepLabels = ["Service", "Pickup", "Destination", "Vehicle", "Quote", "Payment", "Match", "Confirm", "Track"];

type FlowData = {
  serviceType: ServiceTypeId | null;
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
  serviceType: null,
  pickupAddress: "Current location · Midtown Manhattan",
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

export function FindYourTowAppFlow() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FlowData>(initialData);
  const selectedService = useMemo(() => serviceOptions.find((service) => service.id === data.serviceType) ?? null, [data.serviceType]);
  const isTowService = selectedService ? towServiceIds.includes(selectedService.id) : false;
  const quote = useMemo(
    () => calculateQuote({ serviceType: data.serviceType ?? "standard_tow", distanceMiles: isTowService ? 7.8 : 1.6, rush: data.rush }),
    [data.serviceType, data.rush, isTowService],
  );
  const nearbyProviders = useMemo(() => {
    const service = data.serviceType ?? "standard_tow";
    return availableDrivers.filter((driver) => driver.services.includes(service)).slice(0, 3);
  }, [data.serviceType]);
  const matchedProvider = nearbyProviders[0] ?? availableDrivers[0];
  const trip = useMemo(() => buildAppTrip(data, matchedProvider, quote), [data, matchedProvider, quote]);
  const progress = Math.round(((step + 1) / stepLabels.length) * 100);

  function patch(next: Partial<FlowData>) {
    setData((current) => ({ ...current, ...next }));
  }

  function go(nextStep: number) {
    setStep(Math.max(0, Math.min(stepLabels.length - 1, nextStep)));
  }

  function selectService(serviceType: ServiceTypeId) {
    const serviceIsTow = towServiceIds.includes(serviceType);
    patch({ serviceType, dropoffAddress: serviceIsTow ? data.dropoffAddress || initialData.dropoffAddress : "" });
    setStep(1);
  }

  const canContinueFromVehicle = data.vehicleMake.trim() && data.vehicleModel.trim() && data.vehicleYear.trim() && data.vehicleColor.trim();

  return (
    <main className="min-h-screen bg-[#050608] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_0%,rgba(59,130,246,.34),transparent_28%),radial-gradient(circle_at_86%_20%,rgba(16,185,129,.18),transparent_26%),linear-gradient(180deg,#050608_0%,#07101c_52%,#030407_100%)]" />
      <AppTopBar />

      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-28 pt-4 sm:px-6 lg:grid-cols-[minmax(390px,0.92fr)_1.08fr] lg:px-8 lg:pb-12">
        <div className="mx-auto w-full max-w-[460px] lg:mx-0">
          <div className="overflow-hidden rounded-[2.6rem] border border-white/10 bg-black/55 shadow-2xl shadow-blue-950/30 backdrop-blur-2xl">
            <div className="border-b border-white/10 px-5 pb-4 pt-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-200/70">FindYourTow app</p>
                  <h1 className="mt-2 text-3xl font-black tracking-[-0.045em]">What rescue do you need?</h1>
                </div>
                <BackendModePill />
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10" aria-label="Request progress">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-emerald-300 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-[0.68rem] font-black uppercase tracking-[0.18em] text-white/42">
                <span>{stepLabels[step]}</span>
                <span>{step + 1}/{stepLabels.length}</span>
              </div>
            </div>

            <div className="min-h-[640px] px-5 py-5">
              {step === 0 && <ServiceStep onSelect={selectService} selectedService={data.serviceType} />}
              {step === 1 && <PickupStep pickupAddress={data.pickupAddress} onChange={(pickupAddress) => patch({ pickupAddress })} onUseCurrent={() => patch({ pickupAddress: "Current GPS location · 5th Ave & W 34th St" })} onNext={() => go(isTowService ? 2 : 3)} />}
              {step === 2 && <DestinationStep dropoffAddress={data.dropoffAddress} serviceLabel={selectedService?.label ?? "Tow service"} onChange={(dropoffAddress) => patch({ dropoffAddress })} onNext={() => go(3)} />}
              {step === 3 && <VehicleStep data={data} onChange={patch} onNext={() => go(4)} canContinue={Boolean(canContinueFromVehicle)} />}
              {step === 4 && <QuoteStep quote={quote} selectedService={selectedService} providers={nearbyProviders} rush={data.rush} onRushChange={(rush) => patch({ rush })} onNext={() => go(5)} />}
              {step === 5 && <PaymentStep method={data.paymentMethod} onMethodChange={(paymentMethod) => patch({ paymentMethod })} total={quote.totalCents} onNext={() => go(6)} />}
              {step === 6 && <MatchStep provider={matchedProvider} onNext={() => go(7)} />}
              {step === 7 && <ConfirmStep data={data} provider={matchedProvider} quote={quote} onNext={() => go(8)} />}
              {step === 8 && <TrackStep trip={trip} />}
            </div>

            <div className="sticky bottom-0 border-t border-white/10 bg-black/80 px-5 py-4 backdrop-blur-2xl">
              <div className="grid grid-cols-5 gap-1">
                {appTabs.map((tab) => (
                  <Link key={tab.label} href={tab.href} className={`flex min-h-14 flex-col items-center justify-center rounded-2xl text-xs font-black transition ${tab.label === "Home" || (step > 0 && tab.label === "Request") ? "bg-white text-black" : "text-white/55 hover:bg-white/10 hover:text-white"}`}>
                    <span className="text-lg leading-none">{tab.icon}</span>
                    <span className="mt-1">{tab.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="hidden space-y-5 lg:block lg:sticky lg:top-5 lg:self-start">
          <MapExperience drivers={step >= 6 ? [matchedProvider] : nearbyProviders.length ? nearbyProviders : availableDrivers.slice(0, 3)} route={step >= 8 ? trip.route : []} pickup={trip.pickup} dropoff={isTowService ? trip.dropoff : undefined} focus="customer" title={step >= 8 ? "Full-screen live tracking demo" : step >= 1 ? "Pickup + provider map" : "Nearby roadside providers"} progress={step >= 8 ? 72 : Math.max(18, progress - 10)} />
          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <SectionLabel>Current request</SectionLabel>
              <p className="mt-3 text-2xl font-black tracking-[-0.03em]">{selectedService?.label ?? "Choose a service"}</p>
              <p className="mt-2 text-sm leading-6 text-white/58">{selectedService?.description ?? "The customer starts by choosing rescue help immediately on the app home screen."}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold text-white/70">
                <Metric label="ETA" value={`${quote.estimatedEtaMinutes} min`} />
                <Metric label="Quote" value={formatMoney(quote.totalCents)} />
              </div>
            </Card>
            <Card>
              <SectionLabel>Mobile-first PWA</SectionLabel>
              <div className="mt-4 space-y-2 text-sm font-bold text-white/68">
                {['Installed-app shell', 'Bottom navigation', 'Demo payment mode', 'Live tracking route'].map((item) => <div key={item} className="rounded-2xl bg-white/[0.055] px-4 py-3">✓ {item}</div>)}
              </div>
            </Card>
          </div>
        </aside>
      </section>
    </main>
  );
}

function AppTopBar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/82 px-4 py-3 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center" aria-label="FindYourTow home">
          <img src="/brand/findyourtow-logo-transparent.png" alt="FindYourTow logo" className="h-14 w-auto object-contain drop-shadow-[0_0_24px_rgba(56,189,248,0.34)] sm:h-16" />
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/driver" className="hidden rounded-full border border-white/10 px-4 py-2 text-sm font-black text-white/72 sm:inline-flex">Driver</Link>
          <Link href="/admin/dispatch" className="hidden rounded-full border border-white/10 px-4 py-2 text-sm font-black text-white/72 sm:inline-flex">Dispatch</Link>
          <Link href="/request" className="rounded-full bg-white px-5 py-2.5 text-sm font-black text-black">Start</Link>
        </div>
      </div>
    </nav>
  );
}

function ServiceStep({ selectedService, onSelect }: { selectedService: ServiceTypeId | null; onSelect: (serviceType: ServiceTypeId) => void }) {
  return (
    <div id="services" className="space-y-4">
      <p className="text-sm font-bold leading-6 text-white/62">Choose the roadside rescue you need. No landing-page detour — this is the app start screen.</p>
      <div className="grid gap-3">
        {serviceOptions.map((service) => (
          <button key={service.id} type="button" onClick={() => onSelect(service.id)} className={`min-h-28 rounded-[1.65rem] border p-4 text-left transition active:scale-[0.99] ${selectedService === service.id ? "border-blue-300 bg-blue-500/18" : "border-white/10 bg-white/[0.055] hover:bg-white/[0.09]"}`}>
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl text-black shadow-lg">{service.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-3">
                  <span className="text-lg font-black tracking-[-0.02em]">{service.label}</span>
                  <span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-emerald-950">{formatMoney(service.basePriceCents)}+</span>
                </span>
                <span className="mt-1 block text-sm leading-5 text-white/58">{service.description}</span>
                <span className="mt-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-black text-white">Select</span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function PickupStep({ pickupAddress, onChange, onUseCurrent, onNext }: { pickupAddress: string; onChange: (value: string) => void; onUseCurrent: () => void; onNext: () => void }) {
  return (
    <div className="space-y-4">
      <StepTitle eyebrow="Step 2" title="Confirm pickup location" copy="Use current location or type where the provider should meet you." />
      <button type="button" onClick={onUseCurrent} className="flex w-full items-center justify-between rounded-[1.5rem] bg-blue-500 px-5 py-4 text-left font-black text-white shadow-[0_18px_45px_rgba(59,130,246,0.35)]"><span>Use my current location</span><span>⌖</span></button>
      <label className="block text-sm font-black text-white/64">Address search</label>
      <input value={pickupAddress} onChange={(event) => onChange(event.target.value)} placeholder="Search pickup address or landmark" className="w-full rounded-[1.5rem] border border-white/10 bg-black/35 px-4 py-4 font-bold outline-none focus:border-blue-300" />
      <MiniMap mode="pickup" />
      <Button className="w-full" onClick={onNext}>Continue</Button>
    </div>
  );
}

function DestinationStep({ serviceLabel, dropoffAddress, onChange, onNext }: { serviceLabel: string; dropoffAddress: string; onChange: (value: string) => void; onNext: () => void }) {
  return (
    <div className="space-y-4">
      <StepTitle eyebrow="Step 3" title="Where should we take it?" copy={`${serviceLabel} needs a destination so the quote can include distance.`} />
      <label className="block text-sm font-black text-white/64">Destination / drop-off</label>
      <input value={dropoffAddress} onChange={(event) => onChange(event.target.value)} placeholder="Search repair shop, home, or destination" className="w-full rounded-[1.5rem] border border-white/10 bg-black/35 px-4 py-4 font-bold outline-none focus:border-blue-300" />
      <MiniMap mode="route" />
      <Button className="w-full" disabled={!dropoffAddress.trim()} onClick={onNext}>Continue</Button>
    </div>
  );
}

function VehicleStep({ data, onChange, onNext, canContinue }: { data: FlowData; onChange: (next: Partial<FlowData>) => void; onNext: () => void; canContinue: boolean }) {
  const fields: Array<[keyof FlowData, string]> = [
    ["vehicleMake", "Vehicle make"],
    ["vehicleModel", "Model"],
    ["vehicleYear", "Year"],
    ["vehicleColor", "Color"],
    ["licensePlate", "License plate"],
  ];

  return (
    <div className="space-y-4">
      <StepTitle eyebrow="Step 4" title="Vehicle details" copy="Provider gets the exact car, plate, notes, and photo context before they arrive." />
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map(([key, placeholder]) => (
          <input key={key} value={String(data[key] ?? "")} onChange={(event) => onChange({ [key]: event.target.value })} placeholder={placeholder} className="rounded-[1.35rem] border border-white/10 bg-black/35 px-4 py-4 font-bold outline-none focus:border-blue-300" />
        ))}
      </div>
      <select value={data.vehicleType} onChange={(event) => onChange({ vehicleType: event.target.value })} className="w-full rounded-[1.35rem] border border-white/10 bg-black/35 px-4 py-4 font-bold outline-none focus:border-blue-300">
        {['Sedan / small SUV', 'Large SUV', 'Pickup truck', 'Van', 'Motorcycle', 'Commercial vehicle'].map((type) => <option key={type}>{type}</option>)}
      </select>
      <textarea value={data.notes} onChange={(event) => onChange({ notes: event.target.value })} placeholder="Notes: parking level, damage, special instructions" className="min-h-24 w-full rounded-[1.35rem] border border-white/10 bg-black/35 px-4 py-4 font-bold outline-none focus:border-blue-300" />
      <button type="button" onClick={() => onChange({ photoAttached: true })} className="flex w-full items-center justify-between rounded-[1.5rem] border border-dashed border-white/20 bg-white/[0.045] px-5 py-5 text-left font-black text-white/78"><span>{data.photoAttached ? "Photo attached for demo" : "Upload vehicle photo"}</span><span>＋</span></button>
      <Button className="w-full" disabled={!canContinue} onClick={onNext}>Get instant quote</Button>
    </div>
  );
}

function QuoteStep({ quote, selectedService, providers, rush, onRushChange, onNext }: { quote: ReturnType<typeof calculateQuote>; selectedService: { label: string } | null; providers: AvailableDriver[]; rush: boolean; onRushChange: (value: boolean) => void; onNext: () => void }) {
  return (
    <div className="space-y-4">
      <StepTitle eyebrow="Step 5" title="Instant quote" copy="Clear price before confirmation, with ETA and nearby available providers." />
      <div className="rounded-[1.8rem] bg-white p-5 text-black">
        <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-black text-black/45">{selectedService?.label ?? "Roadside service"}</p><p className="mt-1 text-4xl font-black tracking-[-0.05em]">{formatMoney(quote.totalCents)}</p></div><span className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-black text-emerald-950">ETA {quote.estimatedEtaMinutes}m</span></div>
        <div className="mt-4 space-y-2">{quote.lineItems.map((item) => <div key={`${item.code}-${item.label}`} className="flex justify-between rounded-2xl bg-black/[0.045] px-4 py-3 text-sm font-bold"><span>{item.label}</span><span>{formatMoney(item.amountCents)}</span></div>)}</div>
      </div>
      <label className="flex items-center justify-between rounded-[1.5rem] bg-white/[0.055] px-5 py-4 text-sm font-black text-white/76"><span>Rush priority if needed</span><input type="checkbox" checked={rush} onChange={(event) => onRushChange(event.target.checked)} /></label>
      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4"><p className="font-black">Nearby providers</p><div className="mt-3 space-y-2">{providers.map((provider) => <div key={provider.id} className="flex items-center justify-between rounded-2xl bg-black/28 px-4 py-3 text-sm font-bold text-white/72"><span>{provider.name} · ⭐ {provider.rating}</span><span>{provider.etaMinutes}m</span></div>)}</div></div>
      <Button className="w-full" onClick={onNext}>Continue to payment</Button>
    </div>
  );
}

function PaymentStep({ method, total, onMethodChange, onNext }: { method: FlowData['paymentMethod']; total: number; onMethodChange: (method: FlowData['paymentMethod']) => void; onNext: () => void }) {
  return (
    <div className="space-y-4">
      <StepTitle eyebrow="Step 6" title="Payment demo" copy="Authorize payment before matching. Cash/manual is available only because demo mode is active." />
      {[['card', 'Card payment demo', 'Visa •••• 4242 · Authorized instantly'], ['cash_demo', 'Cash/manual demo', 'Demo-only manual payment option']].map(([value, title, copy]) => (
        <button key={value} type="button" onClick={() => onMethodChange(value as FlowData['paymentMethod'])} className={`w-full rounded-[1.5rem] border p-5 text-left ${method === value ? 'border-blue-300 bg-blue-500/18' : 'border-white/10 bg-white/[0.055]'}`}><p className="font-black">{title}</p><p className="mt-1 text-sm text-white/56">{copy}</p></button>
      ))}
      <div className="rounded-[1.5rem] bg-emerald-300 px-5 py-4 font-black text-emerald-950">Payment status: {method === 'card' ? 'Authorized' : 'Demo paid'} · {formatMoney(total)}</div>
      <Button className="w-full" onClick={onNext}>Find provider</Button>
    </div>
  );
}

function MatchStep({ provider, onNext }: { provider: AvailableDriver; onNext: () => void }) {
  return (
    <div className="space-y-4">
      <StepTitle eyebrow="Step 7" title="Finding nearby service provider" copy="Matching the closest available verified provider for this service." />
      <div className="rounded-[1.8rem] border border-blue-300/30 bg-blue-500/14 p-5 text-center"><div className="mx-auto mb-4 h-14 w-14 animate-pulse rounded-full bg-blue-300" /><p className="text-xl font-black">Closest provider found</p><p className="mt-2 text-sm font-bold text-white/58">Verified, licensed, and available now.</p></div>
      <ProviderSummary provider={provider} />
      <Button className="w-full" onClick={onNext}>Continue</Button>
    </div>
  );
}

function ConfirmStep({ data, provider, quote, onNext }: { data: FlowData; provider: AvailableDriver; quote: ReturnType<typeof calculateQuote>; onNext: () => void }) {
  return (
    <div className="space-y-4">
      <StepTitle eyebrow="Step 8" title="Confirm reservation" copy="Review the provider, pickup, quote, and payment before opening live tracking." />
      <ProviderSummary provider={provider} />
      <div className="rounded-[1.5rem] bg-white/[0.055] p-4 text-sm font-bold text-white/70"><p>Pickup: {data.pickupAddress}</p>{data.dropoffAddress && <p className="mt-2">Destination: {data.dropoffAddress}</p>}<p className="mt-2">Total estimate: {formatMoney(quote.totalCents)}</p></div>
      <Button className="w-full" onClick={onNext}>Confirm booking / reservation</Button>
    </div>
  );
}

function TrackStep({ trip }: { trip: TowTrip }) {
  return (
    <div className="space-y-4">
      <StepTitle eyebrow="Step 9" title={`Provider arrives in ${trip.driver.etaMinutes} minutes`} copy="Live app tracking with route, pickup pin, destination pin, ETA, and status timeline." />
      <div className="lg:hidden"><MapExperience drivers={[trip.driver]} route={trip.route} pickup={trip.pickup} dropoff={trip.dropoff} focus="customer" title="Live tracking" progress={72} /></div>
      <DriverCard driver={trip.driver} />
      <Card><SectionLabel>Status timeline</SectionLabel><div className="mt-4"><StatusTimeline timeline={trip.timeline} /></div></Card>
      <Link href="/customer/trip/demo" className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-black text-black">Open full-screen tracking</Link>
    </div>
  );
}

function ProviderSummary({ provider }: { provider: AvailableDriver }) {
  return <div className="rounded-[1.5rem] bg-white/[0.065] p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xl font-black">{provider.name}</p><p className="mt-1 text-sm font-bold text-white/56">⭐ {provider.rating} · {provider.truckType} · {provider.truckNumber}</p></div><span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-emerald-950">Verified</span></div><div className="mt-4 grid grid-cols-2 gap-2"><a href="tel:+15165551234" className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-black text-black">Phone</a><div className="rounded-2xl bg-black/28 px-4 py-3 text-center text-sm font-black text-white/72">ETA {provider.etaMinutes}m</div></div></div>;
}

function StepTitle({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return <div><SectionLabel>{eyebrow}</SectionLabel><h2 className="mt-2 text-3xl font-black tracking-[-0.045em]">{title}</h2><p className="mt-2 text-sm font-bold leading-6 text-white/58">{copy}</p></div>;
}

function MiniMap({ mode }: { mode: 'pickup' | 'route' }) {
  return <div className="relative h-52 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#07111d]"><div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.13)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.13)_1px,transparent_1px)] [background-size:36px_36px]" /><div className="absolute left-[18%] top-[58%] rounded-full bg-white px-3 py-1 text-xs font-black text-black">Pickup pin</div>{mode === 'route' && <><div className="absolute right-[12%] top-[18%] rounded-full bg-blue-300 px-3 py-1 text-xs font-black text-blue-950">Destination</div><div className="absolute left-[30%] top-[45%] h-2 w-40 rotate-[-25deg] rounded-full bg-blue-400" /></>}<div className="truck-marker absolute left-[45%] top-[42%] flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-2xl">🚚</div></div>;
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
    pickupAddress: data.pickupAddress,
    dropoffAddress: data.dropoffAddress,
    driver: { ...provider, status: "assigned" },
    pickup: { lat: 40.7484, lng: -73.9857 },
    dropoff: { lat: 40.7614, lng: -73.9776 },
    route: [
      { lat: 40.746, lng: -73.985 },
      { lat: 40.7484, lng: -73.9857 },
      { lat: 40.752, lng: -73.982 },
      { lat: 40.757, lng: -73.98 },
      { lat: 40.7614, lng: -73.9776 },
    ],
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
