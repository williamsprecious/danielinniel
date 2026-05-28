"use client";

import { Image } from "next-sanity/image";
import {
  useHydratedCart,
  useHydratedSubtotalNGN,
} from "@/store/cart-store";
import { useCurrencyStore, useHydratedCurrency } from "@/store/currency-store";
import { formatPrice } from "@/lib/format-price";
import { urlFor } from "@/sanity/lib/image";

const OrderSummary = () => {
  const lines = useHydratedCart();
  const subtotalNGN = useHydratedSubtotalNGN();
  const currency = useHydratedCurrency();
  const rates = useCurrencyStore((s) => s.rates);

  const shippingNGN = 0;
  const totalNGN = subtotalNGN + shippingNGN;

  return (
    <div className="space-y-6">
      <h2 className="text-xs uppercase tracking-[0.18em] text-foreground/60">
        Order Summary
      </h2>

      <ul className="space-y-5">
        {lines.map((line) => {
          const lineTotalNGN = line.priceNGN * line.qty;
          return (
            <li
              key={`${line.productId}::${line.variantKey ?? ""}`}
              className="flex items-start gap-4"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-foreground/[0.04]">
                <Image
                  src={urlFor(line.image.source).width(128).url()}
                  alt={line.title}
                  width={64}
                  height={64}
                  sizes="64px"
                  placeholder={line.image.lqip ? "blur" : "empty"}
                  blurDataURL={line.image.lqip}
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm text-foreground">
                  {line.title}
                </span>
                {line.variantTitle && (
                  <span className="text-xs text-foreground/55">
                    {line.variantTitle}
                  </span>
                )}
                {line.type !== "digital" && (
                  <span className="text-xs text-foreground/55">
                    Qty {line.qty}
                  </span>
                )}
              </div>
              <span className="text-sm tabular-nums text-foreground">
                {formatPrice(lineTotalNGN, currency, rates)}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="h-px w-full bg-border/30" />

      <dl className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-foreground/70">Subtotal</dt>
          <dd className="tabular-nums text-foreground">
            {formatPrice(subtotalNGN, currency, rates)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-foreground/70">Shipping</dt>
          <dd className="tabular-nums text-foreground">
            {formatPrice(shippingNGN, currency, rates)}
          </dd>
        </div>
      </dl>

      <div className="h-px w-full bg-border/30" />

      <div className="flex items-center justify-between">
        <span className="text-base text-foreground">Total</span>
        <span className="text-base tabular-nums text-foreground">
          {formatPrice(totalNGN, currency, rates)}
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;
