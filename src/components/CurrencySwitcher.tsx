"use client";

import { ChevronDown, Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CURRENCY_META, type CurrencyCode } from "@/lib/currencies";
import { useCurrencyStore, useHydratedCurrency } from "@/store/currency-store";

const CURRENCY_ORDER: CurrencyCode[] = [
  "NGN",
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "ZAR",
  "GHS",
  "JPY",
];

const CurrencySwitcher = () => {
  const selected = useHydratedCurrency();
  const rates = useCurrencyStore((s) => s.rates);
  const setSelectedCurrency = useCurrencyStore((s) => s.setSelectedCurrency);

  const available: CurrencyCode[] = CURRENCY_ORDER.filter((code) =>
    code === "NGN" ? true : Boolean(rates[code]),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Change currency"
        className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-sm text-foreground/80 opacity-90 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30"
      >
        <Globe className="size-4" aria-hidden />
        <span className="tabular-nums">{selected}</span>
        <ChevronDown className="size-3.5 opacity-70" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="top"
        className="min-w-[12rem] bg-[#131313] text-foreground/85"
      >
        {available.map((code) => {
          const meta = CURRENCY_META[code];
          const isActive = code === selected;
          return (
            <DropdownMenuItem
              key={code}
              onSelect={() => setSelectedCurrency(code)}
              className="justify-between focus:bg-foreground/10 focus:text-foreground"
            >
              <span className="flex items-center gap-2">
                <span className="inline-flex w-7 justify-center">
                  {meta.symbol}
                </span>
                <span className="text-xs">({code})</span>
              </span>
              {isActive && <Check className="size-3.5" aria-hidden />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySwitcher;
