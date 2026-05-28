"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { VehicleProfile, VehicleProfileInput } from "./types";
import { sortVehiclesDefaultFirst } from "./types";

const now = "2026-05-28T00:00:00.000Z";

export const demoVehicleSeed: VehicleProfile[] = [
  {
    id: "veh_demo_toyota_camry",
    nickname: "Daily driver",
    make: "Toyota",
    model: "Camry",
    year: "2021",
    color: "Black",
    licensePlate: "NYC-2145",
    vehicleType: "Sedan",
    isDefault: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "veh_demo_ford_f150",
    nickname: "Work truck",
    make: "Ford",
    model: "F-150",
    year: "2023",
    color: "White",
    licensePlate: "F150-23",
    vehicleType: "Pickup truck",
    isDefault: false,
    createdAt: "2026-05-28T00:01:00.000Z",
    updatedAt: "2026-05-28T00:01:00.000Z",
  },
  {
    id: "veh_demo_honda_accord",
    nickname: "Family car",
    make: "Honda",
    model: "Accord",
    year: "2020",
    color: "Gray",
    licensePlate: "ACC-2020",
    vehicleType: "Sedan",
    isDefault: false,
    createdAt: "2026-05-28T00:02:00.000Z",
    updatedAt: "2026-05-28T00:02:00.000Z",
  },
];

type DemoVehicleStoreState = {
  vehicles: VehicleProfile[];
  getVehicles: () => VehicleProfile[];
  getVehicle: (id: string) => VehicleProfile | undefined;
  addVehicle: (input: Omit<VehicleProfileInput, "customerId">) => VehicleProfile;
  updateVehicle: (id: string, patch: Partial<Omit<VehicleProfile, "id" | "createdAt">>) => VehicleProfile | undefined;
  deleteVehicle: (id: string) => void;
  setDefaultVehicle: (id: string) => void;
  resetDemoVehicles: () => void;
};

function normalizeDefaults(vehicles: VehicleProfile[]): VehicleProfile[] {
  if (!vehicles.length) return [];
  const firstDefault = vehicles.find((vehicle) => vehicle.isDefault)?.id ?? vehicles[0].id;
  return sortVehiclesDefaultFirst(vehicles.map((vehicle) => ({ ...vehicle, isDefault: vehicle.id === firstDefault })));
}

function createVehicle(input: Omit<VehicleProfileInput, "customerId">): VehicleProfile {
  const stamp = new Date().toISOString();
  return {
    id: input.id ?? `veh_demo_${input.make.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${input.model.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${Date.now()}`,
    nickname: input.nickname,
    make: input.make,
    model: input.model,
    year: input.year,
    color: input.color,
    licensePlate: input.licensePlate,
    vehicleType: input.vehicleType,
    vin: input.vin,
    photoUrl: input.photoUrl,
    isDefault: Boolean(input.isDefault),
    createdAt: input.createdAt ?? stamp,
    updatedAt: input.updatedAt ?? stamp,
  };
}

export function createDemoVehicleStore(initialVehicles: VehicleProfile[] = demoVehicleSeed) {
  let vehicles = normalizeDefaults(initialVehicles.map((vehicle) => ({ ...vehicle })));
  return {
    getVehicles: () => sortVehiclesDefaultFirst(vehicles),
    getVehicle: (id: string) => vehicles.find((vehicle) => vehicle.id === id),
    addVehicle: (input: Omit<VehicleProfileInput, "customerId">) => {
      const vehicle = createVehicle(input);
      vehicles = normalizeDefaults(vehicle.isDefault ? [...vehicles.map((item) => ({ ...item, isDefault: false })), vehicle] : [...vehicles, vehicle]);
      return vehicle;
    },
    updateVehicle: (id: string, patch: Partial<Omit<VehicleProfile, "id" | "createdAt">>) => {
      let updated: VehicleProfile | undefined;
      vehicles = normalizeDefaults(vehicles.map((vehicle) => {
        if (vehicle.id !== id) return patch.isDefault ? { ...vehicle, isDefault: false } : vehicle;
        updated = { ...vehicle, ...patch, updatedAt: new Date().toISOString() };
        return updated;
      }));
      return updated;
    },
    deleteVehicle: (id: string) => {
      vehicles = normalizeDefaults(vehicles.filter((vehicle) => vehicle.id !== id));
    },
    setDefaultVehicle: (id: string) => {
      vehicles = normalizeDefaults(vehicles.map((vehicle) => ({ ...vehicle, isDefault: vehicle.id === id })));
    },
  };
}

const memoryStorage = (() => {
  const values = new Map<string, string>();
  return {
    getItem: (name: string) => values.get(name) ?? null,
    setItem: (name: string, value: string) => values.set(name, value),
    removeItem: (name: string) => values.delete(name),
  };
})();

function safeStorage() {
  if (typeof window === "undefined") return memoryStorage;
  const storage = window.localStorage;
  if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function" || typeof storage.removeItem !== "function") return memoryStorage;
  return storage;
}

export const useDemoVehicleStore = create<DemoVehicleStoreState>()(
  persist(
    (set, get) => ({
      vehicles: demoVehicleSeed,
      getVehicles: () => sortVehiclesDefaultFirst(get().vehicles),
      getVehicle: (id) => get().vehicles.find((vehicle) => vehicle.id === id),
      addVehicle: (input) => {
        const vehicle = createVehicle(input);
        set((state) => ({ vehicles: normalizeDefaults(vehicle.isDefault ? [...state.vehicles.map((item) => ({ ...item, isDefault: false })), vehicle] : [...state.vehicles, vehicle]) }));
        return vehicle;
      },
      updateVehicle: (id, patch) => {
        const current = get().vehicles.find((vehicle) => vehicle.id === id);
        if (!current) return undefined;
        const updated = { ...current, ...patch, updatedAt: new Date().toISOString() };
        set((state) => ({ vehicles: normalizeDefaults(state.vehicles.map((vehicle) => vehicle.id === id ? updated : patch.isDefault ? { ...vehicle, isDefault: false } : vehicle)) }));
        return updated;
      },
      deleteVehicle: (id) => set((state) => ({ vehicles: normalizeDefaults(state.vehicles.filter((vehicle) => vehicle.id !== id)) })),
      setDefaultVehicle: (id) => set((state) => ({ vehicles: normalizeDefaults(state.vehicles.map((vehicle) => ({ ...vehicle, isDefault: vehicle.id === id }))) })),
      resetDemoVehicles: () => set({ vehicles: demoVehicleSeed.map((vehicle) => ({ ...vehicle })) }),
    }),
    { name: "findyourtow-demo-vehicles-v1", storage: createJSONStorage(() => safeStorage()) },
  ),
);
