"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CurrencyCode, CurrencyRates } from "@/lib/currencies";

type CurrencyState = {
  selectedCurrency: CurrencyCode;
  rates: CurrencyRates;
  setSelectedCurrency: (code: CurrencyCode) => void;
  setRates: (rates: CurrencyRates) => void;
};

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      selectedCurrency: "NGN",
      rates: {},
      setSelectedCurrency: (selectedCurrency) => set({ selectedCurrency }),
      setRates: (rates) => set({ rates }),
    }),
    {
      name: "currency-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ selectedCurrency: state.selectedCurrency }),
    },
  ),
);

// useSyncExternalStore bridge to zustand persist. Stable module-level fns
// so React doesn't re-subscribe every render.
const subscribeCurrencyHydration = (cb: () => void) =>
  useCurrencyStore.persist.onFinishHydration(cb);
const getCurrencyHydratedSnapshot = () =>
  useCurrencyStore.persist.hasHydrated();
const getCurrencyHydratedServerSnapshot = () => false;

const useCurrencyHydrated = (): boolean =>
  useSyncExternalStore(
    subscribeCurrencyHydration,
    getCurrencyHydratedSnapshot,
    getCurrencyHydratedServerSnapshot,
  );

export const useHydratedCurrency = (): CurrencyCode => {
  const selected = useCurrencyStore((s) => s.selectedCurrency);
  const hydrated = useCurrencyHydrated();
  return hydrated ? selected : "NGN";
};
