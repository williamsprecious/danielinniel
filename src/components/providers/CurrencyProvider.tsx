"use client";

import { useEffect } from "react";
import { useCurrencyStore } from "@/store/currency-store";
import type { CurrencyRates } from "@/lib/currencies";

type CurrencyProviderProps = {
  initialRates: CurrencyRates;
  children: React.ReactNode;
};

const CurrencyProvider = ({
  initialRates,
  children,
}: CurrencyProviderProps) => {
  const setRates = useCurrencyStore((s) => s.setRates);

  useEffect(() => {
    setRates(initialRates);
  }, [initialRates, setRates]);

  return <>{children}</>;
};

export default CurrencyProvider;
