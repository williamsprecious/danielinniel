"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import OrderConfirmationView, {
  type OrderData,
} from "@/components/shop/checkout/ui/views/OrderConfirmationView";
import OrderStatusMessage from "@/components/shop/checkout/ui/components/OrderStatusMessage";

const REFRESH_INTERVAL_MS = 3000;
// ~1 minute total (20 × 3s) before we give up and show "not found".
const MAX_REFRESHES = 20;

type OrderConfirmationClientProps = {
  order: OrderData | null;
};

const OrderConfirmationClient = ({ order }: OrderConfirmationClientProps) => {
  const router = useRouter();
  const [gaveUp, setGaveUp] = useState(false);
  const cleared = useRef(false);

  // Clear the cart once, on mount.
  useEffect(() => {
    if (!cleared.current) {
      cleared.current = true;
      useCartStore.getState().clear();
    }
  }, []);

  // Poll for the order until it lands or we run out of attempts.
  useEffect(() => {
    if (order) return;
    let count = 0;
    const id = setInterval(() => {
      count += 1;
      if (count > MAX_REFRESHES) {
        clearInterval(id);
        setGaveUp(true);
        return;
      }
      router.refresh();
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [order, router]);

  if (order) {
    return <OrderConfirmationView order={order} />;
  }

  return <OrderStatusMessage variant={gaveUp ? "not-found" : "finalizing"} />;
};

export default OrderConfirmationClient;
