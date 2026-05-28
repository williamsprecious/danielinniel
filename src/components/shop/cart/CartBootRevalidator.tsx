"use client";

import { useEffect } from "react";
import { useCartHydrated, useCartStore } from "@/store/cart-store";

/**
 * Mounted once at the root site layout — fires a single silent cart
 * revalidation against fresh product data the moment the persisted cart
 * hydrates. Because it's mounted in the root layout, it survives SPA
 * navigations and only re-mounts on a hard page load, which is exactly the
 * cadence we want: one revalidation per browser session start. Subsequent
 * drawer opens within the same session show whatever lines the boot left
 * behind, by design.
 *
 * The checkout page mounts its own forced revalidation as the final
 * safeguard before payment — see CheckoutView.
 */
const CartBootRevalidator = () => {
  const cartHydrated = useCartHydrated();
  const revalidate = useCartStore((s) => s.revalidate);

  useEffect(() => {
    if (!cartHydrated) return;
    void revalidate();
  }, [cartHydrated, revalidate]);

  return null;
};

export default CartBootRevalidator;
