"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BatteryCharging, Car, CreditCard, Fuel, KeyRound, LifeBuoy, LockKeyhole, LocateFixed, Menu, Phone, Route, ShieldAlert, Star, Truck, UserRound, Wrench } from "lucide-react";
import { AppBottomNav, type AppTabLabel } from "@/components/app/AppBottomNav";
import { DriverCard } from "@/components/platform/DriverCard";
import { MapExperience } from "@/components/platform/MapExperience";
import { StatusTimeline } from "@/components/platform/StatusTimeline";
import { Button } from "@/components/ui/button";
import { Card, SectionLabel } from "@/components/ui/card";
import { BrandHomeLink } from "@/components/app/BrandHomeLink";
import { VehicleRequestStep } from "@/components/app/VehicleRequestStep";
import { calculateQuote, formatMoney } from "@/features/pricing/pricing-engine";
import { useRequestFlowStore } from "@/features/tow-requests/request-flow-store";
import { useDemoPaymentStore } from "@/features/payments/demo-payment-store";
import { createTowRequest } from "@/features/tow-requests/api";
import { availableDrivers, serviceOptions } from "@/features/tow-requests/mock-data";
import { getCurrentPositionAddress, searchUsAddresses, type AddressSuggestion } from "@/lib/addresses/address-service";
import type { AvailableDriver, ServiceTypeId, TowTrip } from "@/features/tow-requests/types";

const towServiceIds: ServiceTypeId[] = ["standard_tow", "flatbed_tow", "winch_out", "accident_tow", "motorcycle_tow", "vehicle_transport", "heavy_duty_tow", "box_truck_tow", "private_property_tow"];
const compactServiceIds: ServiceTypeId[] = ["standard_tow", "jump_start", "flat_tire", "lockout", "fuel_delivery", "winch_out", "battery_help"]; 

type FlowStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

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
  heavy_duty_tow: "Heavy",
  box_truck_tow: "Box Tow",
  private_property_tow: "Property",
  emergency_roadside: "Emergency",
};

const savedPlaces = [
  { label: "Home", address: "Home · 7148 Pixel Pkwy, Demo Springs", distance: 4.2 },
  { label: "Work", address: "Work · 3321 Placeholder Ave", distance: 6.3 },
  { label: "Repair Shop", address: "Trusted repair shop · 2200 Mockingbird Ct", distance: 7.8 },
];

const recentAddresses = ["Current location · 3321 Placeholder Ave", "Mockingbird shopping plaza", "Pixel Pkwy service lane", "Example frontage road"];
const ridePlannerPlaces = [
  { name: "Random Auto Center", address: "2200 Mockingbird Ct, Demo Springs", distance: "2.2 mi" },
  { name: "7148 Pixel Pkwy", address: "Demo Springs", distance: "1.0 mi" },
  { name: "3321 Placeholder Ave", address: "Fiction Falls", distance: "3.4 mi" },
  { name: "8891 Sandbox Plaza", address: "Sampleton", distance: "4.1 mi" },
  { name: "5074 Widget Road", address: "Mockville", distance: "5.6 mi" },
  { name: "4312 Example Drive", address: "Demo Springs", distance: "2.9 mi" },
  { name: "7600 Test Auto Lane", address: "Fiction Falls", distance: "6.3 mi" },
];

export function RoadAssistNowAppFlow({ activeTab = "Home", initialStep = 0 }: { activeTab?: AppTabLabel; initialStep?: FlowStep } = {}) {
  const [step, setStep] = useState<FlowStep>(initialStep);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [selectingService, setSelectingService] = useState<ServiceTypeId | null>(null);
  const [submittedTrip, setSubmittedTrip] = useState<TowTrip | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const data = useRequestFlowStore((state) => state.data);
  const patch = useRequestFlowStore((state) => state.patch);

  const selectedService = useMemo(() => serviceOptions.find((service) => service.id === data.serviceType) ?? serviceOptions[0], [data.serviceType]);
  const isTowService = towServiceIds.includes(data.serviceType);
  const distanceMiles = useMemo(() => estimateDistance(data.pickupAddress, data.dropoffAddress, isTowService), [data.pickupAddress, data.dropoffAddress, isTowService]);
  const quote = useMemo(
    () => calculateQuote({ serviceType: data.serviceType, distanceMiles, rush: data.rush, vehicleType: data.vehicleType }),
    [data.serviceType, distanceMiles, data.rush, data.vehicleType],
  );
  const providers = useMemo(() => availableDrivers.filter((driver) => driver.services.includes(data.serviceType)).slice(0, 3), [data.serviceType]);
  const provider = providers[0] ?? availableDrivers[0];
  const trip = useMemo(() => buildAppTrip(data, provider, quote, distanceMiles), [data, provider, quote, distanceMiles]);

  useEffect(() => {
    if (activeTab !== "Request" || initialStep !== 1) return;
    patch({ serviceType: "standard_tow", dropoffAddress: data.dropoffAddress || "Trusted repair shop · 2200 Mockingbird Ct" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step !== 7) return;
    const ticks = [24, 48, 72, 100];
    const timers = ticks.map((value, index) => window.setTimeout(() => setMatchingProgress(value), 280 * (index + 1)));
    const done = window.setTimeout(() => setStep(8), 1600);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(done);
    };
  }, [step]);

  function nextAfterLocation() {
    setStep(isTowService ? 3 : 4);
  }

  function updateService(serviceType: ServiceTypeId) {
    const tow = towServiceIds.includes(serviceType);
    patch({ serviceType, dropoffAddress: tow ? data.dropoffAddress || "Trusted repair shop · 2200 Mockingbird Ct" : "" });
  }

  function selectService(serviceType: ServiceTypeId) {
    updateService(serviceType);
    setSelectingService(serviceType);
    window.setTimeout(() => {
      setSelectingService(null);
      setStep(1);
    }, 260);
  }

  async function useCurrentLocation() {
    patch({ pickupAddress: "Finding current phone location…" });
    const result = await getCurrentPositionAddress();
    patch({ pickupAddress: result.ok ? result.suggestion.address : "Current location · 3321 Placeholder Ave" });
  }

  function startFlow() {
    setStep(1);
  }

  function startMatching() {
    patch({ paymentStatus: "authorized" });
    setMatchingProgress(8);
    setStep(7);
  }

  async function confirmReservation() {
    setSubmitError(null);
    setSubmittingRequest(true);
    try {
      const created = await createTowRequest({
        customerName: data.customerName.trim() || "Guest customer",
        phone: data.phone.trim() || "+10000000000",
        serviceType: data.serviceType,
        pickupAddress: data.pickupAddress.trim() || "Current location",
        dropoffAddress: data.dropoffAddress.trim() || undefined,
        vehicleId: data.vehicleId,
        vehicleSnapshot: data.vehicleSnapshot ?? undefined,
        vehicleMake: data.vehicleMake || data.vehicleSnapshot?.make || "Vehicle",
        vehicleModel: data.vehicleModel || data.vehicleSnapshot?.model || "Unknown",
        vehicleYear: data.vehicleYear || data.vehicleSnapshot?.year,
        vehicleColor: data.vehicleColor || data.vehicleSnapshot?.color,
        licensePlate: data.licensePlate || data.vehicleSnapshot?.licensePlate,
        vehicleType: data.vehicleType,
        notes: data.notes,
        rush: data.rush,
      });
      setSubmittedTrip(created);
      setStep(10);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not create request");
    } finally {
      setSubmittingRequest(false);
    }
  }

  function chooseDestination(destination: string) {
    if (isTowService) {
      patch({
        pickupAddress: data.pickupAddress.trim() || "Home",
        dropoffAddress: destination,
      });
    } else {
      patch({
        pickupAddress: destination || data.pickupAddress || "Current location · 3321 Placeholder Ave",
        dropoffAddress: "",
      });
    }
    setStep(4);
  }

  const isRidePlannerStep = step === 1;

  return (
    <main className="min-h-screen overflow-hidden bg-[#050608] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_9%,rgba(59,130,246,.28),transparent_24%),radial-gradient(circle_at_18%_42%,rgba(16,185,129,.14),transparent_22%),linear-gradient(180deg,#050608_0%,#07101a_48%,#020306_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-[0.11] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:54px_54px]" />

      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-28 pt-4 sm:px-8 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:pb-10">
        <div className="mx-auto flex w-full max-w-[460px] flex-1 flex-col lg:mx-0">
          <MinimalTopBar />
          <div className="flex flex-1 flex-col justify-center py-8 sm:py-10">
            <div className="relative mb-8 h-72 overflow-hidden rounded-[2.4rem] border border-white/10 bg-white/[0.045] shadow-2xl shadow-blue-950/30 backdrop-blur-xl sm:h-80 lg:hidden">
              <PremiumMapVisual selectedService={selectedService} quoteEta={quote.estimatedEtaMinutes} />
            </div>
            <div className="space-y-4">
              <p className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.26em] text-white/52">Demo mode · live ETA</p>
              <h1 className="text-balance text-6xl font-black leading-[0.88] tracking-[-0.075em] sm:text-7xl">Roadside Assistance in Minutes.</h1>
              <h2 className="sr-only">Roadside help in minutes</h2>
              <p className="max-w-sm text-base font-semibold leading-7 text-white/58">Towing, lockouts, jump starts, tire help, fuel delivery, and more.</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link href="/request-service" className="inline-flex min-h-13 items-center justify-center rounded-full bg-white px-5 text-sm font-black text-black">Get Help Now</Link>
              <Link href="/provider/apply" className="inline-flex min-h-13 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] px-5 text-sm font-black text-white">Become a Provider</Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-black uppercase tracking-[0.16em] text-white/54 sm:grid-cols-4">
              {['24/7', 'Upfront pricing', 'Live tracking', 'Verified providers'].map((badge) => <span key={badge} className="rounded-full border border-white/10 bg-white/[0.055] px-3 py-2 text-center">{badge}</span>)}
            </div>
            <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4">
              <p className="text-sm font-black text-white">Request help in 3 steps</p>
              <p className="mt-1 text-sm font-bold text-white/50">Choose service, open the request flow, and approve your price estimate before confirmation.</p>
            </div>
            <CompactServices selectedService={data.serviceType} selectingService={selectingService} onSelect={selectService} />
            <HelpInputCard selectedService={selectedService} onStart={startFlow} />
          </div>
        </div>

        <aside className="hidden items-center justify-center lg:flex">
          <div className="relative h-[760px] w-full max-w-[660px] overflow-hidden rounded-[3.2rem] border border-white/10 bg-white/[0.045] p-7 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
            <PremiumMapVisual selectedService={selectedService} quoteEta={quote.estimatedEtaMinutes} large />
          </div>
        </aside>
      </section>

      <AppBottomNav activeTab={activeTab} />

      {step > 0 && (
        <div aria-label="Request flow sheet area" className="fixed inset-0 z-50 flex items-end justify-center bg-black/52 px-0 pt-0 pb-[calc(5.75rem+env(safe-area-inset-bottom))] backdrop-blur-sm sm:px-5 sm:pt-5 sm:pb-28 lg:p-5">
          <div className={`flex max-h-[calc(100dvh-5.75rem-env(safe-area-inset-bottom))] w-full max-w-[560px] flex-col overflow-hidden rounded-t-[2.2rem] border p-5 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:max-h-[88vh] sm:rounded-[2.4rem] ${isRidePlannerStep ? "border-blue-400/20 bg-[#07111d]/95 text-white" : "border-white/10 bg-[#080b11]/95 text-white"}`}>
            <div className={`mx-auto mb-3 h-1.5 w-12 shrink-0 rounded-full ${isRidePlannerStep ? "bg-blue-200/24" : "bg-white/18"}`} />
            <FlowHeader step={step} onBack={step > 1 ? () => setStep(previousStep(step, isTowService)) : undefined} onClose={() => setStep(0)} firstStepHref={activeTab === "Request" ? "/" : undefined} />
            <div className="min-h-0 flex-1 overflow-y-auto pb-1">
              {step === 1 && <RidePlannerStep pickupAddress={data.pickupAddress} dropoffAddress={data.dropoffAddress} serviceType={data.serviceType} selectedService={selectedService} isTowService={isTowService} onServiceChange={updateService} onPickupChange={(pickupAddress) => patch({ pickupAddress })} onUseCurrent={useCurrentLocation} onDestinationChange={(dropoffAddress) => patch({ dropoffAddress })} onChooseDestination={chooseDestination} />}
              {step === 2 && <LocationStep pickupAddress={data.pickupAddress} onChange={(pickupAddress) => patch({ pickupAddress })} onUseCurrent={useCurrentLocation} onNext={nextAfterLocation} />}
              {step === 3 && isTowService && <DestinationStep dropoffAddress={data.dropoffAddress} quote={quote} distanceMiles={distanceMiles} onChange={(dropoffAddress) => patch({ dropoffAddress })} onNext={() => setStep(4)} />}
              {step === 4 && <VehicleRequestStep data={data} onChange={patch} onNext={() => setStep(5)} />}
              {step === 5 && <QuoteStep quote={quote} distanceMiles={distanceMiles} selectedService={selectedService} rush={data.rush} vehicleType={data.vehicleType} onRushChange={(rush) => patch({ rush })} onNext={() => setStep(6)} />}
              {step === 6 && <PaymentStep quote={quote} onNext={startMatching} />}
              {step === 7 && <MatchingStep progress={matchingProgress} providers={providers} quote={quote} />}
              {step === 8 && <ProviderStep provider={provider} quote={quote} onNext={() => setStep(9)} />}
              {step === 9 && <ConfirmStep data={data} provider={provider} quote={quote} submitting={submittingRequest} error={submitError} onChange={patch} onNext={confirmReservation} />}
              {step === 10 && <TrackStep trip={submittedTrip ?? trip} />}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function previousStep(step: FlowStep, isTowService: boolean): FlowStep {
  if (step === 4) return 1;
  if (step === 3 && !isTowService) return 1;
  return Math.max(1, step - 1) as FlowStep;
}

function MinimalTopBar() {
  return (
    <nav className="flex items-center justify-between py-2">
      <BrandHomeLink />
      <div className="flex items-center gap-2">
        <a href="tel:+15166664941" aria-label="Call RoadAssistNow" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.055] text-white/78 backdrop-blur-xl"><Phone size={18} /></a>
        <Link href="/account" aria-label="Account" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.055] text-white/78 backdrop-blur-xl"><UserRound size={19} /></Link>
        <button type="button" aria-label="Open menu" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.055] text-white/78 backdrop-blur-xl"><Menu size={21} /></button>
      </div>
    </nav>
  );
}

function PremiumMapVisual({ selectedService, quoteEta, large = false }: { selectedService: { label: string; etaMinutes: number }; quoteEta: number; large?: boolean }) {
  return (
    <div className="relative h-full min-h-full overflow-hidden rounded-[inherit] bg-[#07111d]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(59,130,246,.5),transparent_17%),radial-gradient(circle_at_26%_68%,rgba(16,185,129,.34),transparent_16%),radial-gradient(circle_at_74%_28%,rgba(255,255,255,.16),transparent_16%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:46px_46px]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 620" aria-hidden="true">
        <path d="M58 532 C145 430 185 390 246 332 C326 256 386 198 474 88" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="30" strokeLinecap="round" />
        <path d="M58 532 C145 430 185 390 246 332 C326 256 386 198 474 88" fill="none" stroke="rgba(10,18,30,.9)" strokeWidth="20" strokeLinecap="round" />
        <path d="M58 532 C145 430 185 390 246 332 C326 256 386 198 474 88" fill="none" stroke="rgba(96,165,250,.95)" strokeWidth="7" strokeLinecap="round" strokeDasharray="16 13" />
      </svg>
      <div className="absolute left-[15%] top-[69%] h-8 w-8 rounded-full bg-emerald-300 shadow-[0_0_0_14px_rgba(110,231,183,.12),0_0_70px_rgba(110,231,183,.7)]" />
      <div className="absolute left-[calc(15%+2.2rem)] top-[68%] rounded-full bg-black/55 px-3 py-1.5 text-xs font-black text-white backdrop-blur-xl">Current location</div>
      <div className="truck-marker absolute left-[50%] top-[43%] grid h-14 w-14 place-items-center rounded-2xl border border-white/25 bg-white text-black shadow-[0_25px_80px_rgba(59,130,246,.55)]"><Truck size={25} /></div>
      <div className="absolute right-[8%] top-[14%] rounded-[1.4rem] border border-white/10 bg-black/58 px-4 py-3 text-right shadow-2xl backdrop-blur-xl"><p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-white/44">Live ETA</p><p className="mt-1 text-2xl font-black">{quoteEta} min</p></div>
      <div className="absolute bottom-6 left-6 right-6 rounded-[1.7rem] border border-white/10 bg-black/50 p-4 backdrop-blur-2xl"><p className="text-xs font-black uppercase tracking-[0.2em] text-blue-100/60">Selected service</p><div className="mt-2 flex items-center justify-between gap-3"><p className={`${large ? "text-3xl" : "text-xl"} font-black tracking-[-0.04em]`}>{selectedService.label}</p><span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-emerald-950">available</span></div></div>
    </div>
  );
}

function HelpInputCard({ selectedService, onStart }: { selectedService: { label: string }; onStart: () => void }) {
  return (
    <div aria-label="Start request" className="mt-4 rounded-[2rem] border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl">
      <p className="px-1 text-lg font-black tracking-[-0.02em]">Ready when you are.</p>
      <p className="mt-1 px-1 text-sm font-bold text-white/50">Location is requested inside the booking flow, then you review the price before confirmation.</p>
      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2"><button type="button" aria-label={`Service ${serviceShortNames[selectedServiceIdFromLabel(selectedService.label)] ?? selectedService.label}`} className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-3 text-left text-sm font-black text-white/78">Service · {selectedService.label}</button><button type="button" onClick={onStart} className="rounded-full bg-white px-5 py-3 text-sm font-black text-black">Continue</button></div>
    </div>
  );
}

function selectedServiceIdFromLabel(label: string): ServiceTypeId {
  return serviceOptions.find((service) => service.label === label)?.id ?? "standard_tow";
}

function CompactServices({ selectedService, selectingService, onSelect }: { selectedService: ServiceTypeId; selectingService: ServiceTypeId | null; onSelect: (serviceType: ServiceTypeId) => void }) {
  const services = compactServiceIds.map((id) => serviceOptions.find((service) => service.id === id)).filter(Boolean) as typeof serviceOptions;
  return (
    <section id="services" aria-label="Quick service selector" className="mt-6 space-y-3">
      <div className="px-1">
        <h2 className="text-xl font-black tracking-[-0.035em]">Choose the service you need</h2>
        <p className="mt-1 text-sm font-bold text-white/50">Tap what happened — we’ll get help moving.</p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {services.map((service) => <ServiceCard key={service.id} compact service={service} active={selectedService === service.id} selecting={selectingService === service.id} onClick={() => onSelect(service.id)} />)}
      </div>
    </section>
  );
}

function FlowHeader({ step, onBack, onClose, firstStepHref }: { step: FlowStep; onBack?: () => void; onClose: () => void; firstStepHref?: string }) {
  const labels: Record<FlowStep, string> = { 0: "", 1: "Plan", 2: "Pickup", 3: "Destination", 4: "Vehicle", 5: "Quote", 6: "Payment", 7: "Matching", 8: "Provider", 9: "Confirm", 10: "Track" };
  const backClass = "rounded-full bg-white px-4 py-2 text-xs font-black text-black";
  const closeClass = "rounded-full bg-white/10 px-4 py-2 text-xs font-black text-white/70";
  return (
    <div aria-label="Request step controls" className="sticky top-0 z-20 -mx-5 mb-3 border-b border-white/10 bg-[#080b11]/95 px-5 pb-3 pt-1 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-16 items-center gap-2">{onBack ? <button type="button" onClick={onBack} aria-label="Back" className={backClass}>Back</button> : firstStepHref ? <Link href={firstStepHref} aria-label="Back" className={backClass}>Back</Link> : null}<p className="text-xs font-black uppercase tracking-[0.24em] text-blue-100/62">{labels[step]}</p></div>
        <div className="flex min-w-16 justify-end">{firstStepHref ? <Link href={firstStepHref} className={closeClass}>Close</Link> : <button type="button" onClick={onClose} className={closeClass}>Close</button>}</div>
      </div>
      <BookingProgressRail step={step} />
    </div>
  );
}

function BookingProgressRail({ step }: { step: FlowStep }) {
  const stages = ["Details", "Vehicle", "Quote", "Payment", "Track"];
  const currentStage = step <= 3 ? 1 : step === 4 ? 2 : step === 5 ? 3 : step === 6 ? 4 : 5;
  return (
    <div aria-label="Booking progress" className="mt-3 space-y-2">
      <div className="flex items-center justify-between text-[0.62rem] font-black uppercase tracking-[0.18em] text-white/38">
        <span>Step {currentStage} of 5</span>
        <span>Booking progress</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {stages.map((stage, index) => {
          const stageNumber = index + 1;
          const active = currentStage === stageNumber;
          const done = currentStage > stageNumber;
          return (
            <div key={stage} className="space-y-1">
              <div className={`h-1.5 rounded-full transition-colors ${done || active ? "bg-blue-300" : "bg-white/10"}`} />
              <p className={`truncate text-[0.58rem] font-black uppercase tracking-[0.12em] ${active ? "text-blue-100" : done ? "text-white/56" : "text-white/28"}`}>{stage}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RidePlannerStep({ pickupAddress, dropoffAddress, serviceType, selectedService, isTowService, onServiceChange, onPickupChange, onUseCurrent, onDestinationChange, onChooseDestination }: { pickupAddress: string; dropoffAddress: string; serviceType: ServiceTypeId; selectedService: { label: string }; isTowService: boolean; onServiceChange: (value: ServiceTypeId) => void; onPickupChange: (value: string) => void; onUseCurrent: () => void; onDestinationChange: (value: string) => void; onChooseDestination: (value: string) => void }) {
  const [query, setQuery] = useState("");
  const visiblePlaces = ridePlannerPlaces.filter((place) => {
    const haystack = `${place.name} ${place.address}`.toLowerCase();
    return !query.trim() || haystack.includes(query.toLowerCase());
  });
  function choose(value: string) {
    const cleanValue = value.trim();
    if (!cleanValue) return;
    setQuery(cleanValue);
    if (isTowService) onDestinationChange(cleanValue);
    onChooseDestination(cleanValue);
  }
  const placeholder = isTowService ? "Tow destination" : "Where are you?";
  const pendingDestination = (isTowService ? dropoffAddress || query : query || pickupAddress).trim();
  return (
    <div className="space-y-4 pb-2 text-white">
      <div className="space-y-2">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.26em] text-blue-100/45">Tow details</p>
        <h2 className="text-3xl font-black tracking-[-0.05em]">Request roadside help</h2>
        <p className="text-sm font-bold leading-6 text-white/54">Set the service location, review the price, authorize payment, then we match a verified nearby provider.</p>
      </div>

      <div className="grid gap-2 rounded-[1.25rem] border border-white/10 bg-white/[0.055] p-3">
        <label htmlFor="request-service-needed" className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-white/44">Roadside service needed</label>
        <select id="request-service-needed" aria-label="Roadside service needed" value={serviceType} onChange={(event) => { setQuery(""); onServiceChange(event.target.value as ServiceTypeId); }} className="min-h-12 w-full rounded-2xl border border-white/10 bg-[#0b0d12] px-4 text-base font-black text-white outline-none focus:border-white/40">
          {serviceOptions.map((service) => <option key={service.id} value={service.id}>{service.label}</option>)}
        </select>
        <p className="text-xs font-bold leading-5 text-white/50">Towing is the default. Change this before continuing if the customer needs fuel, jump start, tire help, lockout, winch-out, or another service.</p>
      </div>

      <div className="rounded-[1.45rem] border border-white/10 bg-white/[0.055] p-4">
        <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-white/38">Location permission</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-black tracking-[-0.03em]">Share your location</p>
            <p className="mt-1 text-sm font-bold leading-5 text-white/50">Use your current location for faster matching, or type the pickup address below.</p>
          </div>
          <button type="button" onClick={onUseCurrent} className="min-h-12 shrink-0 rounded-full bg-white px-4 text-sm font-black text-black">Use current location</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-blue-300/20 bg-blue-400/12 px-4 py-2 text-xs font-black text-blue-50">{selectedService.label}</span>
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black text-white/62">Provider matched after payment</span>
      </div>

      {!isTowService && <div className="rounded-[1.25rem] border border-emerald-300/18 bg-emerald-400/10 px-4 py-3 text-sm font-black text-emerald-50/82">{selectedService.label}: add your location, get the price, authorize payment, then we find the closest provider.</div>}

      <div className="rounded-[1.55rem] border border-blue-200/18 bg-black/28 p-4 shadow-[0_22px_70px_rgba(14,116,144,.24)]">
        <div className="grid grid-cols-[2rem_1fr] items-center gap-x-3 gap-y-3">
          <span className="grid h-8 w-8 place-items-center rounded-2xl bg-emerald-300 text-xs font-black text-emerald-950">PIN</span>
          <label className="min-w-0">
            <span className="block text-[0.62rem] font-black uppercase tracking-[0.2em] text-white/36">Service location</span>
            <input value={pickupAddress} onChange={(event) => onPickupChange(event.target.value)} aria-label="Pickup" placeholder="Pickup address or landmark" className="mt-1 w-full min-w-0 border-b border-white/10 bg-transparent py-1 text-base font-black text-white outline-none placeholder:text-white/38 focus:border-white/40" />
          </label>
          <span className="grid h-8 w-8 place-items-center rounded-2xl bg-blue-400 text-xs font-black text-blue-950">SVC</span>
          <label className="min-w-0">
            <span className="block text-[0.62rem] font-black uppercase tracking-[0.2em] text-white/36">{isTowService ? "Drop-off" : "Roadside service"}</span>
            <input autoFocus value={query} onChange={(event) => { setQuery(event.target.value); if (isTowService) onDestinationChange(event.target.value); }} placeholder={placeholder} className="mt-1 w-full min-w-0 bg-transparent py-1 text-base font-semibold text-white outline-none placeholder:text-white/38" />
          </label>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/[0.055]">
        {visiblePlaces.slice(0, 7).map((place) => (
          <button key={`${place.name}-${place.address}`} type="button" onClick={() => choose(isTowService ? place.name : place.address)} className="grid w-full grid-cols-[3rem_1fr] items-center gap-2 border-b border-white/8 px-3 py-3 text-left last:border-b-0 active:bg-blue-400/10">
            <div className="text-center text-[0.72rem] font-bold leading-tight text-white/50"><div className="mx-auto mb-1 grid h-8 w-8 place-items-center rounded-2xl bg-blue-400/14 text-blue-100"><LocateFixed size={15} /></div>{place.distance}</div>
            <div className="min-w-0"><p className="truncate text-base font-black text-white">{place.name}</p><p className="truncate text-sm font-semibold text-white/52">{place.address}</p></div>
          </button>
        ))}
        {visiblePlaces.length === 0 && pendingDestination && <div className="px-4 py-4 text-sm font-bold text-white/54">No saved match — you can still continue with “{pendingDestination}”.</div>}
      </div>

      {pendingDestination && (
        <div className="sticky bottom-0 -mx-1 rounded-[1.6rem] border border-blue-300/20 bg-[#07111d]/95 p-3 shadow-[0_-22px_70px_rgba(2,6,23,.72)] backdrop-blur-2xl">
          <p className="px-1 pb-2 text-xs font-bold text-white/54">Use {pendingDestination} as the {isTowService ? "drop-off" : "service location"}.</p>
          <button type="button" onClick={() => choose(pendingDestination)} className="min-h-14 w-full rounded-[1.25rem] bg-blue-500 px-5 text-base font-black text-white shadow-[0_18px_45px_rgba(59,130,246,.38)] active:scale-[0.99]">Continue booking demo</button>
        </div>
      )}
    </div>
  );
}

function ServiceCard({ service, active, selecting, onClick, compact = false }: { service: (typeof serviceOptions)[number]; active: boolean; selecting: boolean; onClick: () => void; compact?: boolean }) {
  const Icon = serviceIconMap[service.id] ?? LifeBuoy;
  return <button type="button" onClick={onClick} aria-pressed={active} className={`relative overflow-hidden rounded-[1.4rem] border transition duration-200 active:scale-95 ${compact ? "flex min-w-[5.4rem] flex-col items-center gap-2 px-4 py-3" : "p-4 text-left"} ${active ? "border-blue-300 bg-blue-500/18 text-white shadow-[0_0_35px_rgba(59,130,246,.22)]" : "border-white/10 bg-white/[0.055] text-white/64"} ${selecting ? "scale-[1.03] ring-2 ring-blue-300" : ""}`}>{selecting && <span className="absolute inset-0 animate-ping rounded-[inherit] bg-blue-400/20" />}<span className="relative grid h-9 w-9 place-items-center rounded-2xl bg-white/10"><Icon aria-hidden="true" size={20} /></span><span className={`${compact ? "text-xs" : "mt-3 block text-base"} relative font-black`}>{compact ? serviceShortNames[service.id] : service.label}</span>{!compact && <span className="relative mt-1 block text-xs font-bold leading-5 text-white/46">{service.description}</span>}</button>;
}

const serviceIconMap: Partial<Record<ServiceTypeId, typeof Truck>> = {
  standard_tow: Truck,
  flatbed_tow: Truck,
  jump_start: BatteryCharging,
  flat_tire: Wrench,
  lockout: KeyRound,
  fuel_delivery: Fuel,
  winch_out: LockKeyhole,
  accident_tow: ShieldAlert,
  motorcycle_tow: Car,
  battery_help: BatteryCharging,
  vehicle_transport: Route,
  heavy_duty_tow: Truck,
  box_truck_tow: Truck,
  private_property_tow: LockKeyhole,
  emergency_roadside: LifeBuoy,
};

function LocationStep({ pickupAddress, onChange, onUseCurrent, onNext }: { pickupAddress: string; onChange: (value: string) => void; onUseCurrent: () => void; onNext: () => void }) {
  return <div className="space-y-4"><StepTitle title="Set pickup" copy="Use current location, choose a saved place, or search with demo autocomplete." /><AddressInputPanel label="Pickup address" value={pickupAddress} onChange={onChange} onUseCurrent={onUseCurrent} includeCurrent /><MiniMap mode="pickup" /><Button className="w-full" disabled={!pickupAddress.trim()} onClick={onNext}>Continue</Button></div>;
}

function DestinationStep({ dropoffAddress, quote, distanceMiles, onChange, onNext }: { dropoffAddress: string; quote: ReturnType<typeof calculateQuote>; distanceMiles: number; onChange: (value: string) => void; onNext: () => void }) {
  return <div className="space-y-4"><StepTitle title="Add destination" copy="Search the drop-off. Route, ETA, and quote update live while you choose." /><AddressInputPanel label="Drop-off destination" value={dropoffAddress} onChange={onChange} /><MiniMap mode="route" destination={dropoffAddress} distanceMiles={distanceMiles} eta={quote.estimatedEtaMinutes} /><LiveQuoteStrip quote={quote} distanceMiles={distanceMiles} /><Button className="w-full" disabled={!dropoffAddress.trim()} onClick={onNext}>Continue</Button></div>;
}

function AddressInputPanel({ label, value, onChange, onUseCurrent, includeCurrent = false }: { label: string; value: string; onChange: (value: string) => void; onUseCurrent?: () => void; includeCurrent?: boolean }) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  useEffect(() => {
    let cancelled = false;
    searchUsAddresses(value).then((items) => {
      if (!cancelled) setSuggestions(items);
    });
    return () => { cancelled = true; };
  }, [value]);
  return <div className="rounded-[1.6rem] border border-white/10 bg-black/24 p-3"><label className="px-1 text-xs font-black uppercase tracking-[0.2em] text-white/40">{label}</label><div className="mt-2 flex gap-2">{includeCurrent && <button type="button" onClick={onUseCurrent} className="rounded-full bg-white px-3 py-2 text-xs font-black text-black">Use current</button>}<input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search exact USA address or landmark" className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/35 px-4 py-3 text-sm font-bold outline-none focus:border-blue-300" /></div><AddressSuggestionGroup title="Exact US address matches" items={suggestions} onPick={(item) => onChange(item.address)} /><SuggestionGroup title="Saved places" items={savedPlaces.map((place) => `${place.label} · ${place.address.split(" · ").pop()}`)} onPick={(item) => onChange(savedPlaces.find((place) => item.startsWith(place.label))?.address ?? item)} /><SuggestionGroup title="Recent" items={recentAddresses.slice(0, 3)} onPick={onChange} /></div>;
}

function AddressSuggestionGroup({ title, items, onPick }: { title: string; items: AddressSuggestion[]; onPick: (value: AddressSuggestion) => void }) {
  return <div className="mt-3"><p className="px-1 text-[0.62rem] font-black uppercase tracking-[0.2em] text-blue-100/42">{title}</p><div className="mt-2 flex flex-wrap gap-2">{items.map((item) => <button key={`${title}-${item.id}`} type="button" onClick={() => onPick(item)} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-black text-white/70">{item.label}</button>)}</div></div>;
}

function SuggestionGroup({ title, items, onPick }: { title: string; items: string[]; onPick: (value: string) => void }) {
  return <div className="mt-3"><p className="px-1 text-[0.62rem] font-black uppercase tracking-[0.2em] text-blue-100/42">{title}</p><div className="mt-2 flex flex-wrap gap-2">{items.map((item) => <button key={`${title}-${item}`} type="button" onClick={() => onPick(item)} className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-black text-white/70">{item}</button>)}</div></div>;
}

function QuoteStep({ quote, selectedService, distanceMiles, rush, vehicleType, onRushChange, onNext }: { quote: ReturnType<typeof calculateQuote>; selectedService: { label: string }; distanceMiles: number; rush: boolean; vehicleType: string; onRushChange: (value: boolean) => void; onNext: () => void }) {
  return <div className="space-y-4"><StepTitle title="Live quote" copy="Your estimate reacts to service, distance, vehicle type, and rush priority." /><div className="rounded-[1.8rem] bg-white p-5 text-black"><p className="text-sm font-black text-black/45">{selectedService.label} · {vehicleType} · {distanceMiles.toFixed(1)} mi</p><p className="mt-1 text-5xl font-black tracking-[-0.06em]">{formatMoney(quote.totalCents)}</p><div className="mt-4 space-y-2">{quote.lineItems.map((item) => <div key={`${item.code}-${item.label}`} className="flex justify-between rounded-2xl bg-black/[0.045] px-4 py-3 text-sm font-bold"><span>{humanQuoteLabel(item.code, item.label)}</span><span>{formatMoney(item.amountCents)}</span></div>)}</div></div><div className="rounded-[1.35rem] border border-blue-300/18 bg-blue-400/10 px-4 py-3 text-sm font-bold leading-6 text-blue-50/76">Payment is authorized now and charged only after service is completed. The provider receives a ready-to-dispatch job after authorization.</div><label className="flex items-center justify-between rounded-[1.4rem] bg-white/[0.055] px-5 py-4 text-sm font-black text-white/76"><span>Rush priority · faster ETA</span><input type="checkbox" checked={rush} onChange={(event) => onRushChange(event.target.checked)} /></label><div className="grid grid-cols-2 gap-3"><Metric label="ETA" value={`${quote.estimatedEtaMinutes} min`} /><Metric label="Final total" value={formatMoney(quote.totalCents)} /></div><Button className="w-full" onClick={onNext}>Continue to payment</Button></div>;
}

function PaymentStep({ quote, onNext }: { quote: ReturnType<typeof calculateQuote>; onNext: () => void }) {
  const methods = useDemoPaymentStore((state) => state.methods);
  const selectedPaymentMethodId = useDemoPaymentStore((state) => state.selectedPaymentMethodId);
  const selectMethod = useDemoPaymentStore((state) => state.selectMethod);
  const selected = methods.find((method) => method.id === selectedPaymentMethodId) ?? methods[0];
  return <div className="space-y-4"><StepTitle title="Authorize payment" copy="Choose a saved demo method, then authorize before dispatch so providers only receive ready jobs." /><div className="rounded-[1.8rem] bg-white p-5 text-black"><p className="text-sm font-black text-black/45">Amount authorized today</p><p className="mt-1 text-5xl font-black tracking-[-0.06em]">{formatMoney(quote.totalCents)}</p><div className="mt-4 space-y-2">{methods.map((method) => <button key={method.id} type="button" onClick={() => selectMethod(method.id)} className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-bold ${selected.id === method.id ? "bg-blue-100 text-blue-950" : "bg-black/[0.045] text-black/70"}`}><span className="inline-flex items-center gap-2"><CreditCard size={16} />{method.label}</span><span>{method.isDefault ? "Default" : method.type.replace("_", " ")}</span></button>)}</div><p className="mt-3 text-xs font-bold leading-5 text-black/45">Stripe authorization: no demo card is charged. In production this becomes a PaymentIntent hold; the customer is charged only after service is completed.</p></div><div className="rounded-[1.35rem] border border-emerald-300/18 bg-emerald-400/10 px-4 py-3 text-sm font-bold leading-6 text-emerald-50/76">After authorization, RoadAssistNow dispatches the request to nearby verified providers and opens live tracking when one accepts.</div><div className="grid grid-cols-2 gap-3"><Metric label="Payment" value="Authorized" /><Metric label="Dispatch" value="After auth" /></div><Button className="w-full" onClick={onNext}>Authorize & find provider</Button><Link href="/account/payments" className="block text-center text-sm font-black text-white/52">Manage payment methods</Link></div>;
}

function MatchingStep({ progress, providers, quote }: { progress: number; providers: AvailableDriver[]; quote: ReturnType<typeof calculateQuote> }) {
  return <div className="space-y-5 text-center"><div className="mx-auto mt-3 grid h-28 w-28 place-items-center rounded-full bg-blue-500/20"><div className="grid h-20 w-20 animate-pulse place-items-center rounded-full bg-blue-500 shadow-[0_0_70px_rgba(59,130,246,.6)]"><Truck size={34} /></div></div><StepTitle title="Finding nearby providers" copy="Checking verified trucks, route fit, rating, and arrival time." /><div className="rounded-full bg-white/10 p-1"><div className="h-3 rounded-full bg-blue-400 transition-all duration-300" style={{ width: `${progress}%` }} /></div><div className="grid grid-cols-2 gap-3"><Metric label="Nearby providers" value={`${providers.length || 1}`} /><Metric label="Best ETA" value={`${quote.estimatedEtaMinutes} min`} /></div><p className="text-sm font-bold text-white/48">Matching the closest available provider…</p></div>;
}

function ProviderStep({ provider, quote, onNext }: { provider: AvailableDriver; quote: ReturnType<typeof calculateQuote>; onNext: () => void }) {
  return <div className="space-y-4"><StepTitle title="Provider matched" copy="A verified truck accepted your request." /><ProviderSummary provider={provider} /><MiniMap mode="route" destination="Provider route" distanceMiles={provider.distanceMiles} eta={provider.etaMinutes} /><div className="grid grid-cols-3 gap-3"><Metric label="Rating" value={`${provider.rating}`} /><Metric label="Arrival" value={`${provider.etaMinutes} min`} /><Metric label="Total" value={formatMoney(quote.totalCents)} /></div><Button className="w-full" onClick={onNext}>Review reservation</Button></div>;
}

function ConfirmStep({ data, provider, quote, submitting, error, onChange, onNext }: { data: ReturnType<typeof useRequestFlowStore.getState>["data"]; provider: AvailableDriver; quote: ReturnType<typeof calculateQuote>; submitting: boolean; error: string | null; onChange: (next: Partial<ReturnType<typeof useRequestFlowStore.getState>["data"]>) => void; onNext: () => void }) {
  const service = serviceOptions.find((option) => option.id === data.serviceType)?.label ?? "Roadside service";
  return <div className="space-y-4"><StepTitle title="Confirm reservation" copy="No account required. Add contact info so dispatch and the provider can reach you." /><div className="grid gap-3 rounded-[1.45rem] border border-blue-300/16 bg-blue-400/10 p-4"><label className="text-xs font-black uppercase tracking-[0.18em] text-blue-100/54">Name<input value={data.customerName} onChange={(event) => onChange({ customerName: event.target.value })} placeholder="Your name" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-base font-black text-white outline-none focus:border-blue-300" /></label><label className="text-xs font-black uppercase tracking-[0.18em] text-blue-100/54">Phone<input value={data.phone} onChange={(event) => onChange({ phone: event.target.value })} placeholder="Mobile phone" inputMode="tel" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-base font-black text-white outline-none focus:border-blue-300" /></label></div><div className="rounded-[1.6rem] bg-white/[0.065] p-5 text-sm font-bold text-white/70"><p className="text-xl font-black text-white">{service}</p><p className="mt-3">Pickup: {data.pickupAddress || "Current location"}</p>{data.dropoffAddress && <p className="mt-2">Destination: {data.dropoffAddress}</p>}<p className="mt-2">Vehicle: {[data.vehicleYear, data.vehicleColor, data.vehicleMake, data.vehicleModel].filter(Boolean).join(" ") || data.vehicleType}</p><p className="mt-2">Provider search: {provider.name} · {provider.truckType} is the closest current match</p><p className="mt-2">Payment status: Authorized · {formatMoney(quote.totalCents)}</p><p className="mt-2">Estimated arrival: {provider.etaMinutes} minutes</p></div>{error && <div className="rounded-[1.25rem] border border-red-300/20 bg-red-500/10 px-4 py-3 text-sm font-black text-red-100">{error}</div>}<Button className="w-full" onClick={onNext} disabled={submitting}>{submitting ? "Saving request…" : "Confirm reservation"}</Button></div>;
}

function TrackStep({ trip }: { trip: TowTrip }) {
  const [progress, setProgress] = useState(18);
  useEffect(() => {
    const interval = window.setInterval(() => setProgress((current) => (current >= 92 ? 92 : current + 7)), 1400);
    return () => window.clearInterval(interval);
  }, []);
  const eta = Math.max(2, trip.driver.etaMinutes - Math.floor(progress / 18));
  const timeline = trip.timeline.map((item, index) => ({ ...item, complete: index <= Math.floor(progress / 24) }));
  return <div className="space-y-4"><StepTitle title={`Provider arrives in ${eta} minutes`} copy="Live route, moving ETA, and status updates are simulated in demo mode." /><MapExperience drivers={[trip.driver]} route={trip.route} pickup={trip.pickup} dropoff={trip.dropoff} focus="customer" title="Live tracking" progress={progress} /><DriverCard driver={{ ...trip.driver, etaMinutes: eta }} /><Card><SectionLabel>Status timeline</SectionLabel><div className="mt-4"><StatusTimeline timeline={timeline} /></div></Card><Link href="/track" className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-black text-black">Open tracking page</Link></div>;
}

function LiveQuoteStrip({ quote, distanceMiles }: { quote: ReturnType<typeof calculateQuote>; distanceMiles: number }) {
  return <div className="grid grid-cols-3 gap-2"><Metric label="Distance" value={`${distanceMiles.toFixed(1)} mi`} /><Metric label="ETA" value={`${quote.estimatedEtaMinutes} min`} /><Metric label="Quote" value={formatMoney(quote.totalCents)} /></div>;
}

function humanQuoteLabel(code: string, fallback: string) {
  if (code === "base_fee") return "Base price";
  if (code === "distance_fee") return "Mileage fee";
  if (code === "admin_service_fee") return "Service fee";
  return fallback;
}

function ProviderSummary({ provider }: { provider: AvailableDriver }) {
  return <div className="rounded-[1.4rem] bg-white/[0.065] p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xl font-black">{provider.name}</p><p className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-white/56"><Star size={14} className="fill-white/60" /> {provider.rating} · {provider.truckType} · {provider.truckNumber}</p></div><span className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-emerald-950">Verified</span></div><div className="mt-4 grid grid-cols-2 gap-2"><a href="tel:+15166664941" className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-black text-black">Call driver</a><div className="rounded-2xl bg-black/28 px-4 py-3 text-center text-sm font-black text-white/72">ETA {provider.etaMinutes}m</div></div></div>;
}

function StepTitle({ title, copy }: { title: string; copy: string }) {
  return <div><h2 className="text-3xl font-black tracking-[-0.045em]">{title}</h2><p className="mt-2 text-sm font-bold leading-6 text-white/58">{copy}</p></div>;
}

function MiniMap({ mode, destination, distanceMiles = 5.5, eta }: { mode: "pickup" | "route"; destination?: string; distanceMiles?: number; eta?: number }) {
  const routeWidth = Math.min(72, Math.max(28, distanceMiles * 6));
  return <div className="relative h-48 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#07111d]"><div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.13)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.13)_1px,transparent_1px)] [background-size:36px_36px]" /><div className="absolute left-[18%] top-[58%] rounded-full bg-white px-3 py-1 text-xs font-black text-black">Pickup</div>{mode === "route" && <><div className="absolute right-[10%] top-[18%] max-w-[9rem] truncate rounded-full bg-blue-300 px-3 py-1 text-xs font-black text-blue-950">{destination ? destination.split(" · ")[0] : "Destination"}</div><div className="absolute left-[30%] top-[45%] h-2 rotate-[-25deg] rounded-full bg-blue-400 transition-all" style={{ width: `${routeWidth}%` }} />{eta && <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-black text-white">ETA {eta} min</div>}</>}<div className="truck-marker absolute left-[45%] top-[42%] grid h-11 w-11 place-items-center rounded-2xl bg-white text-black shadow-2xl"><Truck size={21} /></div></div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-black/24 p-3"><p className="text-xs font-bold uppercase tracking-[0.18em] text-white/36">{label}</p><p className="mt-1 font-black">{value}</p></div>;
}

function estimateDistance(pickupAddress: string, dropoffAddress: string, isTowService: boolean): number {
  if (!isTowService) return pickupAddress ? 1.6 : 2.4;
  const address = dropoffAddress.toLowerCase();
  const saved = savedPlaces.find((place) => dropoffAddress.startsWith(place.label) || dropoffAddress === place.address);
  if (saved) return saved.distance;
  if (address.includes("jfk")) return 16.8;
  if (address.includes("brooklyn")) return 10.6;
  if (address.includes("long island city") || address.includes("repair")) return 7.8;
  if (address.includes("queens")) return 5.4;
  if (!dropoffAddress.trim()) return 3.2;
  return Math.round((5.2 + (dropoffAddress.length % 8) * 0.8) * 10) / 10;
}

function buildAppTrip(data: ReturnType<typeof useRequestFlowStore.getState>["data"], provider: AvailableDriver, quote: ReturnType<typeof calculateQuote>, distanceMiles: number): TowTrip {
  const now = new Date();
  return { id: "demo", status: "driver_on_the_way", quote, pickupAddress: data.pickupAddress || "Current location", dropoffAddress: data.dropoffAddress, driver: { ...provider, status: "assigned" }, pickup: { lat: 40.7484, lng: -73.9857 }, dropoff: { lat: 40.7614, lng: -73.9776 }, route: [{ lat: 40.746, lng: -73.985 }, { lat: 40.7484, lng: -73.9857 }, { lat: 40.752, lng: -73.982 }, { lat: 40.757, lng: -73.98 }, { lat: 40.7614, lng: -73.9776 }], timeline: [{ status: "quote_created", label: "Request confirmed", timestamp: now.toISOString(), complete: true }, { status: "driver_assigned", label: "Provider assigned", timestamp: now.toISOString(), complete: true }, { status: "driver_on_the_way", label: `${distanceMiles.toFixed(1)} mile route started`, timestamp: now.toISOString(), complete: true }, { status: "driver_arrived", label: "Provider arrived", timestamp: new Date(now.getTime() + provider.etaMinutes * 60_000).toISOString(), complete: false }, { status: "vehicle_picked_up", label: data.dropoffAddress ? "Vehicle picked up" : "Service started", timestamp: new Date(now.getTime() + (provider.etaMinutes + 8) * 60_000).toISOString(), complete: false }, { status: "completed", label: "Completed", timestamp: new Date(now.getTime() + 45 * 60_000).toISOString(), complete: false }] };
}
