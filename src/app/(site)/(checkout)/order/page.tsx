import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderConfirmationClient from "@/components/shop/checkout/ui/views/OrderConfirmationClient";
import { backendClient } from "@/sanity/lib/backendClient";
import { ORDER_BY_REFERENCE_QUERY } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Order Confirmation",
};

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string | string[] }>;
}) {
  const { reference } = await searchParams;
  const ref = Array.isArray(reference)
    ? (reference[0] ?? null)
    : (reference ?? null);

  // Reaching /order without a reference isn't a valid destination — 404 it.
  if (!ref) {
    notFound();
  }

  // Read fresh (useCdn: false) via backendClient. The order is created out-of-band by the Paystack webhook → Inngest pipeline, so on a fast redirect it isn't here yet. A CDN read would cache that empty result and keep serving stale null even after the order lands; the client shell re-runs this read via router.refresh() until the order appears (or gives up → not found).
  const order = await backendClient.fetch(ORDER_BY_REFERENCE_QUERY, {
    reference: ref,
  });

  return <OrderConfirmationClient order={order ?? null} />;
}
