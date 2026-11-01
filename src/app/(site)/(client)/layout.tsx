import Layout from "@/components/Layout";
import SparklesBackground from "@/components/SparklesBackground";
import CartDrawer from "@/components/shop/cart/ui/components/CartDrawer";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SparklesBackground />
      <Layout>{children}</Layout>
      <CartDrawer />
    </>
  );
}
