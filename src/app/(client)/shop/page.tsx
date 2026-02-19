import { Metadata } from "next";
import ShopPage from "@/components/pages/ShopPage";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Exclusive prints, merchandise, and digital art drops are loading… Stay sharp — the release is coming soon.",
};

const Shop = () => {
  return <ShopPage />;
};

export default Shop;
