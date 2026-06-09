import Layout from "@/components/Layout";
import CartDrawer from "@/components/shop/cart/ui/components/CartDrawer";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Layout>{children}</Layout>
      <CartDrawer />
    </>
  );
}
