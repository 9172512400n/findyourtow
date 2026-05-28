"use client";

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { demoPaymentMethods, type DemoPaymentMethod } from '@/features/demo/platform-data';

export type PaymentMethodInput = Omit<DemoPaymentMethod, 'id'> & { id?: string };

type DemoPaymentStore = {
  methods: DemoPaymentMethod[];
  selectedPaymentMethodId: string;
  applePayReady: boolean;
  addMethod: (input: PaymentMethodInput) => DemoPaymentMethod;
  setDefault: (id: string) => void;
  selectMethod: (id: string) => void;
  enableApplePayDemo: () => void;
  resetDemoPayments: () => void;
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

export const useDemoPaymentStore = create<DemoPaymentStore>()(
  persist(
    (set, get) => ({
      methods: demoPaymentMethods,
      selectedPaymentMethodId: demoPaymentMethods.find((method) => method.isDefault)?.id ?? demoPaymentMethods[0].id,
      applePayReady: true,
      addMethod: (input) => {
        const method: DemoPaymentMethod = {
          ...input,
          id: input.id ?? `pay_demo_${input.last4}_${Date.now()}`,
        };
        set((state) => ({
          methods: method.isDefault ? [...state.methods.map((item) => ({ ...item, isDefault: false })), method] : [...state.methods, method],
          selectedPaymentMethodId: method.isDefault ? method.id : state.selectedPaymentMethodId,
        }));
        return method;
      },
      setDefault: (id) => set((state) => ({ methods: state.methods.map((method) => ({ ...method, isDefault: method.id === id })), selectedPaymentMethodId: id })),
      selectMethod: (id) => set({ selectedPaymentMethodId: id }),
      enableApplePayDemo: () => {
        const existing = get().methods.find((method) => method.type === 'apple_pay');
        if (existing) {
          get().setDefault(existing.id);
          set({ applePayReady: true });
          return;
        }
        get().addMethod({ type: 'apple_pay', label: 'Apple Pay demo', holder: 'Wallet demo', last4: '0000', expiration: 'Wallet', billingZip: '90000', isDefault: true });
        set({ applePayReady: true });
      },
      resetDemoPayments: () => set({ methods: demoPaymentMethods, selectedPaymentMethodId: demoPaymentMethods[0].id, applePayReady: true }),
    }),
    { name: 'findyourtow-demo-payments-v1', storage: createJSONStorage(safeStorage) },
  ),
);
