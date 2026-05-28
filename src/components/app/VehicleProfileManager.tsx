"use client";

import { useMemo, useState } from "react";
import { CarFront } from "lucide-react";
import { useDemoVehicleStore } from "@/features/vehicles/demo-vehicle-store";
import { type VehicleProfile, type VehicleType, sortVehiclesDefaultFirst, vehicleTypes } from "@/features/vehicles/types";
import { Button } from "@/components/ui/button";

type VehicleFormState = {
  nickname: string;
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  vehicleType: VehicleType;
  vin: string;
  photoUrl: string;
  isDefault: boolean;
};

const blankForm: VehicleFormState = { nickname: "", make: "", model: "", year: "", color: "", licensePlate: "", vehicleType: "Sedan", vin: "", photoUrl: "", isDefault: false };

function formFromVehicle(vehicle?: VehicleProfile): VehicleFormState {
  if (!vehicle) return blankForm;
  return { nickname: vehicle.nickname, make: vehicle.make, model: vehicle.model, year: vehicle.year, color: vehicle.color, licensePlate: vehicle.licensePlate, vehicleType: vehicle.vehicleType, vin: vehicle.vin ?? "", photoUrl: vehicle.photoUrl ?? "", isDefault: vehicle.isDefault };
}

export function VehicleProfileManager() {
  const rawVehicles = useDemoVehicleStore((state) => state.vehicles);
  const vehicles = useMemo(() => sortVehiclesDefaultFirst(rawVehicles), [rawVehicles]);
  const addVehicle = useDemoVehicleStore((state) => state.addVehicle);
  const updateVehicle = useDemoVehicleStore((state) => state.updateVehicle);
  const deleteVehicle = useDemoVehicleStore((state) => state.deleteVehicle);
  const setDefaultVehicle = useDemoVehicleStore((state) => state.setDefaultVehicle);
  const [editing, setEditing] = useState<VehicleProfile | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState<VehicleFormState>(blankForm);
  const valid = form.make.trim() && form.model.trim() && form.year.trim() && form.color.trim() && form.licensePlate.trim();
  const vehicleCount = useMemo(() => vehicles.length, [vehicles]);

  function openAdd() {
    setEditing(null);
    setForm(blankForm);
    setSheetOpen(true);
  }

  function openEdit(vehicle: VehicleProfile) {
    setEditing(vehicle);
    setForm(formFromVehicle(vehicle));
    setSheetOpen(true);
  }

  function save() {
    if (!valid) return;
    const payload = { ...form, nickname: form.nickname.trim() || `${form.year} ${form.make}`, vin: form.vin.trim() || undefined, photoUrl: form.photoUrl.trim() || undefined };
    if (editing) updateVehicle(editing.id, payload);
    else addVehicle(payload);
    setSheetOpen(false);
  }

  return (
    <section aria-label="My Vehicles" className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-100/48">Customer profile</p>
          <h2 className="mt-1 text-3xl font-black tracking-[-0.05em]">My Vehicles</h2>
          <p className="mt-1 text-sm font-bold text-white/50">{vehicleCount} saved vehicles for faster dispatch.</p>
        </div>
        <button type="button" onClick={openAdd} className="min-h-12 rounded-full bg-blue-500 px-5 text-sm font-black text-white shadow-[0_18px_45px_rgba(59,130,246,.35)]">Add vehicle</button>
      </div>

      <div className="mt-5 grid gap-3">
        {vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} onEdit={() => openEdit(vehicle)} onDelete={() => { if (window.confirm(`Delete ${vehicle.nickname}?`)) deleteVehicle(vehicle.id); }} onDefault={() => setDefaultVehicle(vehicle.id)} />)}
        {!vehicles.length && <button type="button" onClick={openAdd} className="rounded-[1.5rem] border border-dashed border-white/18 bg-white/[0.04] px-5 py-8 text-center font-black text-white/66">Add your first vehicle</button>}
      </div>

      {sheetOpen && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 px-4 pb-4 backdrop-blur-sm" onClick={() => setSheetOpen(false)}>
          <div role="dialog" aria-label={editing ? "Edit vehicle" : "Add vehicle"} className="w-full max-w-[520px] rounded-[2rem] border border-white/10 bg-[#080b11] p-5 text-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20" />
            <h3 className="text-2xl font-black tracking-[-0.04em]">{editing ? "Edit vehicle" : "Add vehicle"}</h3>
            <VehicleFields form={form} setForm={setForm} />
            <div className="sticky bottom-0 mt-5 grid grid-cols-2 gap-3 bg-[#080b11] pt-3">
              <button type="button" onClick={() => setSheetOpen(false)} className="min-h-13 rounded-full bg-white/10 px-5 text-sm font-black text-white/72">Cancel</button>
              <Button disabled={!valid} onClick={save}>Save vehicle</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function VehicleCard({ vehicle, onEdit, onDelete, onDefault }: { vehicle: VehicleProfile; onEdit: () => void; onDelete: () => void; onDefault: () => void }) {
  return (
    <div aria-label="Saved vehicle card" className={`rounded-[1.6rem] border p-4 ${vehicle.isDefault ? "border-blue-300/36 bg-blue-500/12" : "border-white/10 bg-white/[0.045]"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2"><p className="font-black text-white">{vehicle.nickname}</p>{vehicle.isDefault && <span className="rounded-full bg-emerald-300 px-2.5 py-1 text-[0.65rem] font-black text-emerald-950">Default</span>}</div>
          <p className="mt-1 text-lg font-black tracking-[-0.03em]">{vehicle.year} {vehicle.make} {vehicle.model}</p>
          <p className="mt-1 text-sm font-bold text-white/50">{vehicle.color} · {vehicle.vehicleType} · Plate {vehicle.licensePlate}</p>
        </div>
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-black"><CarFront size={25} /></div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button type="button" onClick={onEdit} className="min-h-11 rounded-full bg-white px-3 text-xs font-black text-black">Edit</button>
        <button type="button" aria-label="Set default" onClick={onDefault} disabled={vehicle.isDefault} className="min-h-11 rounded-full bg-white/10 px-3 text-xs font-black text-white/72 disabled:opacity-45">Make primary</button>
        <button type="button" onClick={onDelete} className="min-h-11 rounded-full bg-red-500/18 px-3 text-xs font-black text-red-100">Delete</button>
      </div>
    </div>
  );
}

export function VehicleFields({ form, setForm }: { form: VehicleFormState; setForm: (next: VehicleFormState) => void }) {
  const update = (patch: Partial<VehicleFormState>) => setForm({ ...form, ...patch });
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <Field label="Vehicle nickname" value={form.nickname} onChange={(nickname) => update({ nickname })} placeholder="Daily driver" />
      <Field label="Make" value={form.make} onChange={(make) => update({ make })} placeholder="Toyota" />
      <Field label="Model" value={form.model} onChange={(model) => update({ model })} placeholder="Camry" />
      <Field label="Year" value={form.year} onChange={(year) => update({ year })} placeholder="2021" />
      <Field label="Color" value={form.color} onChange={(color) => update({ color })} placeholder="Black" />
      <Field label="License plate" value={form.licensePlate} onChange={(licensePlate) => update({ licensePlate })} placeholder="ABC123" />
      <label className="text-sm font-black text-white/64">Vehicle type<select value={form.vehicleType} onChange={(event) => update({ vehicleType: event.target.value as VehicleType })} className="mt-2 w-full rounded-[1.15rem] border border-white/10 bg-black/35 px-4 py-3 font-bold text-white outline-none">{vehicleTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
      <Field label="VIN optional" value={form.vin} onChange={(vin) => update({ vin })} placeholder="Optional" />
      <Field label="Photo optional" value={form.photoUrl} onChange={(photoUrl) => update({ photoUrl })} placeholder="Photo URL optional" />
      <label className="flex min-h-12 items-center justify-between rounded-[1.15rem] border border-white/10 bg-white/[0.045] px-4 text-sm font-black text-white/72">Default vehicle<input type="checkbox" checked={form.isDefault} onChange={(event) => update({ isDefault: event.target.checked })} /></label>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="text-sm font-black text-white/64">{label}<input aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-[1.15rem] border border-white/10 bg-black/35 px-4 py-3 font-bold text-white outline-none placeholder:text-white/28 focus:border-blue-300" /></label>;
}
