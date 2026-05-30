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
import { initializeCheckout } from "@/actions/order.action";
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

  const isDigitalOnly = useMemo(
    () => lines.length > 0 && lines.every((l) => l.type === "digital"),
    [lines],
  );

  const shippingFeeNGN = isDigitalOnly
    ? 0
    : shippingQuote?.ok
      ? shippingQuote.feeNGN
      : 0;
  const totalNGN = subtotalNGN + shippingFeeNGN;

  const handleValid = async (values: CheckoutFormValues) => {
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const result = await initializeCheckout({
        values,
        lines,
        displayCurrency: currency,
      });

      if (result.ok) {
        window.location.href = result.authorizationUrl;
        return;
      }

      // The server rejected the cart as stale — re-sync so the customer sees the corrected prices/availability before they retry.
      if (result.reason === "cart-changed") {
        void revalidate();
      }
      setStatusMessage(result.message);
    } catch (error) {
      console.error("Checkout failed", error);
      setStatusMessage("Something went wrong. Please try again.");
    }
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
                    <OrderSummary
                      shippingQuote={shippingQuote}
                      isDigitalOnly={isDigitalOnly}
                    />
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
                      isDigitalOnly={isDigitalOnly}
                    />
                  </section>
                  {!isDigitalOnly && (
                    <ShippingMethodCard shippingQuote={shippingQuote} />
                  )}
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
                  <OrderSummary
                    shippingQuote={shippingQuote}
                    isDigitalOnly={isDigitalOnly}
                  />
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
