"use client";

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { demoProviders, demoRequests, type DemoRequestSummary } from '@/features/demo/platform-data';

type DriverJobStatus = 'offered' | 'accepted' | 'declined' | 'on_my_way' | 'arrived' | 'loaded' | 'delivered';

type DemoPlatformStore = {
  activeRequestId: string;
  matchedProviderId: string;
  requestStatus: DemoRequestSummary['status'];
  driverOnline: boolean;
  driverJobStatus: DriverJobStatus;
  requests: DemoRequestSummary[];
  assignProvider: (requestId: string, providerId: string) => void;
  confirmDemoReservation: () => void;
  setDriverOnline: (online: boolean) => void;
  acceptJob: () => void;
  declineJob: () => void;
  updateDriverJobStatus: (status: DriverJobStatus) => void;
  resetDemoPlatform: () => void;
};

const memoryStorage = (() => {
  const values = new Map<string, string>();
  return {
    getItem: (name: string) => values.get(name) ?? null,
    setItem: (name: string, value: string) => values.set(name, value),
    removeItem: (name: string) => values.delete(name),
  };
})();

function safeStorage() {
  if (typeof window === 'undefined') return memoryStorage;
  return window.localStorage ?? memoryStorage;
}

export const useDemoPlatformStore = create<DemoPlatformStore>()(
  persist(
    (set) => ({
      activeRequestId: demoRequests[0].id,
      matchedProviderId: demoProviders[0].id,
      requestStatus: 'assigned',
      driverOnline: true,
      driverJobStatus: 'offered',
      requests: demoRequests,
      assignProvider: (requestId, providerId) => set((state) => ({
        activeRequestId: requestId,
        matchedProviderId: providerId,
        requestStatus: 'assigned',
        requests: state.requests.map((request) => request.id === requestId ? { ...request, providerId, status: 'assigned' } : request),
      })),
      confirmDemoReservation: () => set({ requestStatus: 'assigned' }),
      setDriverOnline: (online) => set({ driverOnline: online }),
      acceptJob: () => set({ driverJobStatus: 'accepted', requestStatus: 'assigned' }),
      declineJob: () => set({ driverJobStatus: 'declined' }),
      updateDriverJobStatus: (status) => set({ driverJobStatus: status }),
      resetDemoPlatform: () => set({ activeRequestId: demoRequests[0].id, matchedProviderId: demoProviders[0].id, requestStatus: 'assigned', driverOnline: true, driverJobStatus: 'offered', requests: demoRequests }),
    }),
    { name: 'findyourtow-demo-platform-v1', storage: createJSONStorage(safeStorage) },
  ),
);
