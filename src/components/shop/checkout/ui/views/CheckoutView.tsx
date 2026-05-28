"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import CheckoutForm, {
  type CheckoutFormHandle,
} from "@/components/shop/checkout/ui/components/CheckoutForm";
import ShippingMethodCard from "@/components/shop/checkout/ui/components/ShippingMethodCard";
import PaymentMethodCard from "@/components/shop/checkout/ui/components/PaymentMethodCard";
import OrderSummary from "@/components/shop/checkout/ui/components/OrderSummary";
import EmptyCheckoutState from "@/components/shop/checkout/ui/components/EmptyCheckoutState";
import {
  useCartHydrated,
  useCartStore,
  useHydratedCart,
  useHydratedSubtotalNGN,
} from "@/store/cart-store";
import { useHydratedCurrency, useCurrencyStore } from "@/store/currency-store";
import type { CheckoutFormValues } from "@/schema";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format-price";
import type { CountryShippingConfig } from "@/lib/shipping/types";
import {
  SUPPORTED_SHIPPING_COUNTRIES,
  getRegionLabel,
} from "@/lib/shipping/supported-countries";
import { lookupShippingFee } from "@/lib/shipping/zone-lookup";

type CheckoutViewProps = {
  shippingZones: CountryShippingConfig[];
};

const CheckoutView = ({ shippingZones }: CheckoutViewProps) => {
  const formRef = useRef<CheckoutFormHandle>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(true);
  const [destination, setDestination] = useState<{
    country: string;
    state: string;
  }>({ country: "", state: "" });

  const lines = useHydratedCart();
  const subtotalNGN = useHydratedSubtotalNGN();
  const currency = useHydratedCurrency();
  const rates = useCurrencyStore((s) => s.rates);

  const cartHydrated = useCartHydrated();
  const revalidate = useCartStore((s) => s.revalidate);

  // Silently revalidate once the cart hydrates so the customer reaches checkout with current prices/stock/availability. On a checkout-page reload this fires alongside CartBootRevalidator; the store's isRevalidating guard collapses the pair into a single network round-trip.
  useEffect(() => {
    if (!cartHydrated) return;
    void revalidate();
  }, [cartHydrated, revalidate]);

  const availableCountries = useMemo(() => {
    const configured = new Set(shippingZones.map((z) => z.country));
    return SUPPORTED_SHIPPING_COUNTRIES.filter((c) => configured.has(c.code));
  }, [shippingZones]);

  const shippingQuote = useMemo(() => {
    if (!destination.country) return null;
    // Hold the preview until the customer picks a region for countries that have regional overrides — otherwise we'd show the country-default fee and then change it the moment they pick a state, which is confusing. UK (regionLabel === null) shows its flat fee immediately.
    const regionLabel = getRegionLabel(destination.country);
    if (regionLabel && !destination.state) return null;
    return lookupShippingFee(
      shippingZones,
      destination.country,
      destination.state,
    );
  }, [shippingZones, destination.country, destination.state]);

  const shippingFeeNGN = shippingQuote?.ok ? shippingQuote.feeNGN : 0;
  const totalNGN = subtotalNGN + shippingFeeNGN;

  const handleValid = (values: CheckoutFormValues) => {
    setIsSubmitting(true);
    // TODO(shipping-server-recalc): the upcoming order-create server action
    // must call lookupShippingFee(zones, values.country, values.state) on the
    // server using a fresh storeSettings read, reject with a user-friendly
    // error when ok=false, and snapshot the resulting fee onto the order.
    // The client-computed preview is for UX only and must not be trusted.

    // TODO(cart-server-recalc): the same action must also call revalidateCart
    // server-side just before writing the order. Refuse to proceed if any
    // line ends up "removed" or has a material price change the customer
    // hasn't been shown — the client preview is not enough.

    // Validates the cart products serverside also, its avalability, variation avalability, quantity, stock etc

    console.log("Checkout payload", {
      values,
      lines,
      subtotalNGN,
      shippingFeeNGN,
      totalNGN,
      currency,
    });
    setStatusMessage(
      "Checkout coming soon — order processing lands in the next release.",
    );
    setIsSubmitting(false);
  };

  const handlePlaceOrder = () => {
    setStatusMessage(null);
    formRef.current?.submit();
  };

  return (
    <>
      <div className="mx-auto w-full max-w-[1400px] px-6 pt-10 pb-0 lg:px-10 lg:py-14">
        {cartHydrated &&
          (lines.length === 0 ? (
            <EmptyCheckoutState />
          ) : (
            <>
              {/* Mobile: collapsible summary header (CTA + trust badge live in the sticky bar) */}
              <div className="lg:hidden mb-6">
                <button
                  type="button"
                  onClick={() => setMobileSummaryOpen((v) => !v)}
                  aria-expanded={mobileSummaryOpen}
                  aria-controls="mobile-order-summary"
                  className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-border/30 bg-foreground/[0.03] px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-2 text-sm text-foreground/70">
                    Order summary
                    <ChevronDown
                      size={14}
                      className={cn(
                        "transition-transform",
                        mobileSummaryOpen && "rotate-180",
                      )}
                    />
                  </span>
                  <span className="text-sm tabular-nums text-foreground">
                    {formatPrice(totalNGN, currency, rates)}
                  </span>
                </button>
                {mobileSummaryOpen && (
                  <div
                    id="mobile-order-summary"
                    className="mt-3 rounded-2xl border border-border/30 bg-foreground/[0.03] p-6"
                  >
                    {statusMessage && (
                      <div
                        role="status"
                        className="mb-4 rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-foreground"
                      >
                        {statusMessage}
                      </div>
                    )}
                    <OrderSummary shippingQuote={shippingQuote} />
                  </div>
                )}
              </div>

              {/* Form + desktop summary */}
              <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
                <div className="space-y-6 pb-40 lg:pb-0">
                  <section
                    aria-label="Contact and shipping"
                    className="rounded-2xl border border-border/30 bg-foreground/[0.03] p-6 md:p-8"
                  >
                    <CheckoutForm
                      ref={formRef}
                      onValid={handleValid}
                      availableCountries={availableCountries}
                      onDestinationChange={setDestination}
                    />
                  </section>
                  <ShippingMethodCard shippingQuote={shippingQuote} />
                  <PaymentMethodCard />
                </div>
                <aside
                  aria-label="Order summary"
                  className="hidden space-y-6 rounded-2xl border border-border/30 bg-foreground/[0.03] p-6 md:p-8 lg:sticky lg:top-24 lg:block lg:self-start"
                >
                  {statusMessage && (
                    <div
                      role="status"
                      className="rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-foreground"
                    >
                      {statusMessage}
                    </div>
                  )}
                  <OrderSummary shippingQuote={shippingQuote} />
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={
                      isSubmitting ||
                      lines.length === 0 ||
                      availableCountries.length === 0
                    }
                    className="flex h-14 w-full cursor-pointer items-center justify-center rounded-full bg-primary text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? "PROCESSING…" : "PLACE ORDER"}
                  </button>
                </aside>
              </div>
            </>
          ))}
      </div>

      {/* Mobile sticky Place Order bar */}
      {cartHydrated && lines.length > 0 && (
        <div
          role="region"
          aria-label="Place order"
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border/30 bg-background/95 px-5 py-6 backdrop-blur lg:hidden"
        >
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isSubmitting || availableCountries.length === 0}
            className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>{isSubmitting ? "PROCESSING…" : "PLACE ORDER"}</span>
            <span aria-hidden className="opacity-70">
              ·
            </span>
            <span className="tabular-nums">
              {formatPrice(totalNGN, currency, rates)}
            </span>
          </button>
        </div>
      )}
    </>
  );
};

export default CheckoutView;
