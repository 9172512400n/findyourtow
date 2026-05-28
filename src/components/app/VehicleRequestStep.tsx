"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDemoVehicleStore } from "@/features/vehicles/demo-vehicle-store";
import { manualVehicleToSnapshot, sortVehiclesDefaultFirst, type VehicleSnapshot, type VehicleType, vehicleToSnapshot, vehicleTypes } from "@/features/vehicles/types";
import type { RequestFlowData } from "@/features/tow-requests/request-flow-store";

type Props = {
  data: RequestFlowData;
  onChange: (next: Partial<RequestFlowData>) => void;
  onNext: () => void;
};

type Mode = "saved" | "manual";

export function VehicleRequestStep({ data, onChange, onNext }: Props) {
  const rawVehicles = useDemoVehicleStore((state) => state.vehicles);
  const vehicles = sortVehiclesDefaultFirst(rawVehicles);
  const addVehicle = useDemoVehicleStore((state) => state.addVehicle);
  const [mode, setMode] = useState<Mode>(vehicles.length ? "saved" : "manual");
  const selectedSaved = vehicles.find((vehicle) => vehicle.id === data.vehicleId) ?? (data.vehicleId ? undefined : vehicles[0]);
  const snapshot = data.vehicleSnapshot;
  const canContinue = mode === "saved" ? Boolean(selectedSaved) : Boolean(data.vehicleMake.trim() && data.vehicleModel.trim() && data.vehicleYear.trim() && data.vehicleColor.trim());

  function selectSaved(vehicleId: string) {
    const vehicle = vehicles.find((candidate) => candidate.id === vehicleId);
    if (!vehicle) return;
    const nextSnapshot = vehicleToSnapshot(vehicle);
    onChange({
      vehicleId: vehicle.id,
      vehicleSnapshot: nextSnapshot,
      vehicleNickname: vehicle.nickname,
      vehicleMake: vehicle.make,
      vehicleModel: vehicle.model,
      vehicleYear: vehicle.year,
      vehicleColor: vehicle.color,
      licensePlate: vehicle.licensePlate,
      vehicleType: vehicle.vehicleType,
      vehicleVin: vehicle.vin ?? "",
      vehiclePhotoUrl: vehicle.photoUrl ?? "",
      saveVehicleToProfile: false,
    });
  }

  function continueFlow() {
    let nextSnapshot: VehicleSnapshot;
    let vehicleId = data.vehicleId;
    if (mode === "saved" && selectedSaved) {
      nextSnapshot = vehicleToSnapshot(selectedSaved);
      vehicleId = selectedSaved.id;
    } else {
      if (data.saveVehicleToProfile) {
        const saved = addVehicle({
          nickname: data.vehicleNickname.trim() || `${data.vehicleYear} ${data.vehicleMake}`,
          make: data.vehicleMake,
          model: data.vehicleModel,
          year: data.vehicleYear,
          color: data.vehicleColor,
          licensePlate: data.licensePlate,
          vehicleType: data.vehicleType as VehicleType,
          vin: data.vehicleVin || undefined,
          photoUrl: data.vehiclePhotoUrl || undefined,
          isDefault: vehicles.length === 0,
        });
        vehicleId = saved.id;
        nextSnapshot = vehicleToSnapshot(saved);
      } else {
        vehicleId = null;
        nextSnapshot = manualVehicleToSnapshot({
          vehicleId: null,
          nickname: data.vehicleNickname,
          make: data.vehicleMake,
          model: data.vehicleModel,
          year: data.vehicleYear,
          color: data.vehicleColor,
          licensePlate: data.licensePlate,
          vehicleType: data.vehicleType,
          vin: data.vehicleVin,
          photoUrl: data.vehiclePhotoUrl,
        });
      }
    }
    onChange({ vehicleId, vehicleSnapshot: nextSnapshot, saveVehicleToProfile: mode === "manual" ? data.saveVehicleToProfile : false });
    onNext();
  }

  return (
    <div className="space-y-4 pb-1">
      <div>
        <h2 className="text-3xl font-black tracking-[-0.045em]">Vehicle details</h2>
        <p className="mt-2 text-sm font-bold leading-6 text-white/58">Use a saved vehicle or enter a different one for a friend, rental, company car, or family member.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-[1.4rem] bg-white/[0.055] p-1">
        <button type="button" onClick={() => { setMode("saved"); if (vehicles[0]) selectSaved(vehicles[0].id); }} className={`min-h-12 rounded-[1.1rem] text-sm font-black ${mode === "saved" ? "bg-white text-black" : "text-white/62"}`}>Use saved vehicle</button>
        <button type="button" onClick={() => { setMode("manual"); onChange({ vehicleId: null, vehicleSnapshot: null }); }} className={`min-h-12 rounded-[1.1rem] text-sm font-black ${mode === "manual" ? "bg-white text-black" : "text-white/62"}`}>Service for another vehicle</button>
      </div>

      {mode === "saved" && (
        <div className="space-y-3">
          {vehicles.length ? vehicles.map((vehicle) => (
            <button key={vehicle.id} type="button" aria-label={`${vehicle.nickname} saved vehicle`} onClick={() => selectSaved(vehicle.id)} className={`w-full rounded-[1.55rem] border p-4 text-left transition active:scale-[0.99] ${data.vehicleId === vehicle.id || (!data.vehicleId && vehicle.id === selectedSaved?.id) ? "border-blue-300 bg-blue-500/16" : "border-white/10 bg-white/[0.045]"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2"><p className="font-black">{vehicle.nickname}</p>{vehicle.isDefault && <span className="rounded-full bg-emerald-300 px-2.5 py-1 text-[0.65rem] font-black text-emerald-950">Default</span>}</div>
                  <p className="mt-1 text-lg font-black tracking-[-0.03em]">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                  <p className="mt-1 text-sm font-bold text-white/50">{vehicle.color} · {vehicle.vehicleType} · {vehicle.licensePlate}</p>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-xl">🚗</span>
              </div>
            </button>
          )) : <div className="rounded-[1.4rem] border border-dashed border-white/16 p-5 text-sm font-bold text-white/56">No saved vehicles yet. Use manual entry below.</div>}
          {snapshot && <p className="rounded-[1.2rem] bg-emerald-300/12 px-4 py-3 text-xs font-black text-emerald-50">Selected vehicle info will auto-fill this request and be saved as a job snapshot.</p>}
        </div>
      )}

      {mode === "manual" && <ManualVehicleFields data={data} onChange={onChange} />}

      <div className="sticky bottom-0 -mx-1 bg-[#080b11]/95 pt-2 backdrop-blur-xl">
        <Button className="w-full" disabled={!canContinue} onClick={continueFlow}>Get instant quote</Button>
      </div>
    </div>
  );
}

function ManualVehicleFields({ data, onChange }: { data: RequestFlowData; onChange: (next: Partial<RequestFlowData>) => void }) {
  const fields: Array<[keyof RequestFlowData, string, string]> = [
    ["vehicleNickname", "Vehicle nickname", "Optional nickname"],
    ["vehicleMake", "Make", "Toyota"],
    ["vehicleModel", "Model", "Camry"],
    ["vehicleYear", "Year", "2021"],
    ["vehicleColor", "Color", "Black"],
    ["licensePlate", "License plate", "ABC123"],
    ["vehicleVin", "VIN optional", "Optional"],
  ];
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map(([key, label, placeholder]) => (
          <label key={key} className="text-sm font-black text-white/64">{label}<input aria-label={label} value={String(data[key] ?? "")} onChange={(event) => onChange({ [key]: event.target.value })} placeholder={placeholder} className="mt-2 w-full rounded-[1.25rem] border border-white/10 bg-black/35 px-4 py-4 font-bold outline-none placeholder:text-white/28 focus:border-blue-300" /></label>
        ))}
        <label className="text-sm font-black text-white/64">Vehicle type<select value={data.vehicleType} onChange={(event) => onChange({ vehicleType: event.target.value })} className="mt-2 w-full rounded-[1.25rem] border border-white/10 bg-black/35 px-4 py-4 font-bold outline-none focus:border-blue-300">{vehicleTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
      </div>
      <button type="button" onClick={() => onChange({ photoAttached: true, vehiclePhotoUrl: data.vehiclePhotoUrl || "demo-photo-attached" })} className="w-full rounded-[1.3rem] border border-dashed border-white/18 bg-white/[0.045] px-5 py-4 text-left font-black text-white/72">{data.photoAttached ? "Photo attached" : "Upload vehicle photo optional"}</button>
      <label className="flex items-center justify-between gap-4 rounded-[1.4rem] bg-white/[0.055] px-5 py-4 text-sm font-black text-white/76"><span>Save this vehicle to my account</span><input type="checkbox" checked={data.saveVehicleToProfile} onChange={(event) => onChange({ saveVehicleToProfile: event.target.checked })} /></label>
      <textarea value={data.notes} onChange={(event) => onChange({ notes: event.target.value })} placeholder="Optional notes" className="min-h-20 w-full rounded-[1.25rem] border border-white/10 bg-black/35 px-4 py-4 font-bold outline-none placeholder:text-white/30 focus:border-blue-300" />
    </div>
  );
}
