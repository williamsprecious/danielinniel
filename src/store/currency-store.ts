"use client";

import { useEffect, useState } from "react";
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

export const useHydratedCurrency = (): CurrencyCode => {
  const selected = useCurrencyStore((s) => s.selectedCurrency);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useCurrencyStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = useCurrencyStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    return unsub;
  }, []);

  return hydrated ? selected : "NGN";
};
