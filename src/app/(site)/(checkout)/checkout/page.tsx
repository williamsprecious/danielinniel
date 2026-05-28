import type { Metadata } from "next";
import CheckoutView from "@/components/shop/checkout/ui/views/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}
