"use client";

import { useCurrencyStore, useHydratedCurrency } from "@/store/currency-store";
import { formatPrice } from "@/lib/format-price";
import type { ShippingQuote } from "@/lib/shipping/types";

type ShippingMethodCardProps = {
  shippingQuote: ShippingQuote | null;
};

const ShippingMethodCard = ({ shippingQuote }: ShippingMethodCardProps) => {
  const currency = useHydratedCurrency();
  const rates = useCurrencyStore((s) => s.rates);

  const display = (() => {
    if (!shippingQuote) return "Enter address";
    if (!shippingQuote.ok) {
      return shippingQuote.reason === "unsupported-country"
        ? "Unsupported"
        : "Unavailable";
    }
    if (shippingQuote.feeNGN === 0) return "Free";
    return formatPrice(shippingQuote.feeNGN, currency, rates);
  })();

  return (
    <section
      aria-label="Shipping method"
      className="space-y-5 rounded-2xl border border-border/30 bg-foreground/[0.03] p-6 md:p-8"
    >
      <h2 className="text-xs uppercase tracking-[0.18em] text-foreground/60">
        Shipping Method
      </h2>
      <div className="flex items-center justify-between gap-4 rounded-xl border border-primary/60 bg-primary/10 p-5">
        <div className="flex items-center gap-4">
          <div
            aria-hidden
            className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-primary"
          >
            <div className="size-2 rounded-full bg-primary" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground">
              Standard Shipping
            </span>
            <span className="text-xs text-foreground/60">
              2–5 business days
            </span>
          </div>
        </div>

        <span className="text-sm tabular-nums text-foreground">{display}</span>
      </div>
    </section>
  );
};

export default ShippingMethodCard;
