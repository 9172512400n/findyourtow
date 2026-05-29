"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { VehicleSnapshot } from "@/features/vehicles/types";
import type { ServiceTypeId } from "./types";

export type RequestFlowData = {
  serviceType: ServiceTypeId;
  customerName: string;
  phone: string;
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
  customerName: "",
  phone: "",
  pickupAddress: "",
  dropoffAddress: "Trusted repair shop · 2200 Mockingbird Ct",
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

const forbiddenDemoSamplePattern = /new york|\bny\b|queens|brooklyn|manhattan|nassau|long island|piermont|hewlett|oceanside|reina|lincoln|healy|waverly|far rockaway|cedar loop|harbor point|blue ridge|maple ridge|willow creek|meadowbrook|riverton|brookfield|stonebridge|jfk|airport|fdr|chelsea|upper west|midtown|atlantic ave|northern blvd|5th ave|350 5th|142-20|84th drive/i;

function sanitizePersistedAddress(value: unknown, replacement: string) {
  if (typeof value !== "string") return replacement;
  if (!value.trim()) return value;
  return forbiddenDemoSamplePattern.test(value) ? replacement : value;
}

function sanitizeRequestFlowData(data: RequestFlowData): RequestFlowData {
  return {
    ...data,
    pickupAddress: sanitizePersistedAddress(data.pickupAddress, "Current location · Demo Springs"),
    dropoffAddress: sanitizePersistedAddress(data.dropoffAddress, initialRequestFlowData.dropoffAddress),
  };
}

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
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<RequestFlowStore> | undefined;
        return {
          ...currentState,
          ...persisted,
          data: sanitizeRequestFlowData({ ...currentState.data, ...persisted?.data }),
        };
      },
    },
  ),
);
