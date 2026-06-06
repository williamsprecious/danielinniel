import { Metadata } from "next";
import ShopView from "@/components/shop/products/ui/views/ShopView";
import { getActiveCategories, getProducts } from "@/sanity/queries/products";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Exclusive prints, merchandise, and digital art drops from the Inn & Iel universe.",
};

const PAGE_SIZE = 12;

const Shop = async () => {
  const [categories, initialProducts] = await Promise.all([
    getActiveCategories(),
    getProducts(null, 0, PAGE_SIZE),
  ]);

  return (
    <ShopView
      categories={categories}
      initialProducts={initialProducts}
      pageSize={PAGE_SIZE}
    />
  );
};

export default Shop;
