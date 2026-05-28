import type { Metadata } from "next";
import OrderConfirmationView from "@/components/shop/checkout/ui/views/OrderConfirmationView";

export const metadata: Metadata = {
  title: "Order Confirmation",
};

export default function OrderPage() {
  return <OrderConfirmationView />;
}
