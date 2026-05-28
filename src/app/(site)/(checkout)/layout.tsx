import type { Metadata } from "next";
import CheckoutHeader from "@/components/shop/checkout/ui/components/CheckoutHeader";

export const metadata: Metadata = {
  description: "Secure checkout for Danielinniel store.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen text-foreground">
      <CheckoutHeader />
      <main>{children}</main>
    </div>
  );
}
