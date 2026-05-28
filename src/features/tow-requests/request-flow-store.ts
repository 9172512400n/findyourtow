"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { VehicleSnapshot } from "@/features/vehicles/types";
import type { ServiceTypeId } from "./types";

export type RequestFlowData = {
  serviceType: ServiceTypeId;
  pickupAddress: string;
  dropoffAddress: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor: string;
  licensePlate: string;
  vehicleType: string;
  vehicleId: string | null;
  vehicleNickname: string;
  vehicleVin: string;
  vehiclePhotoUrl: string;
  vehicleSnapshot: VehicleSnapshot | null;
  saveVehicleToProfile: boolean;
  notes: string;
  rush: boolean;
  photoAttached: boolean;
  paymentStatus: "authorized" | "demo_paid";
};

type RequestFlowStore = {
  data: RequestFlowData;
  patch: (next: Partial<RequestFlowData>) => void;
  reset: () => void;
};

export const initialRequestFlowData: RequestFlowData = {
  serviceType: "standard_tow",
  pickupAddress: "",
  dropoffAddress: "Trusted repair shop · Long Island City",
  vehicleMake: "",
  vehicleModel: "",
  vehicleYear: "",
  vehicleColor: "",
  licensePlate: "",
  vehicleType: "Sedan",
  vehicleId: null,
  vehicleNickname: "",
  vehicleVin: "",
  vehiclePhotoUrl: "",
  vehicleSnapshot: null,
  saveVehicleToProfile: false,
  notes: "",
  rush: false,
  photoAttached: false,
  paymentStatus: "authorized",
};

const memoryStorage = (() => {
  const values = new Map<string, string>();
  return {
    getItem: (name: string) => values.get(name) ?? null,
    setItem: (name: string, value: string) => {
      values.set(name, value);
    },
    removeItem: (name: string) => {
      values.delete(name);
    },
  };
})();

function safeStorage() {
  if (typeof window === "undefined") return memoryStorage;
  if (!window.localStorage || typeof window.localStorage.setItem !== "function") return memoryStorage;
  return window.localStorage;
}

export const useRequestFlowStore = create<RequestFlowStore>()(
  persist(
    (set) => ({
      data: initialRequestFlowData,
      patch: (next) => set((state) => ({ data: { ...state.data, ...next } })),
      reset: () => set({ data: initialRequestFlowData }),
    }),
    {
      name: "findyourtow-request-flow-v1",
      storage: createJSONStorage(safeStorage),
    },
  ),
);
