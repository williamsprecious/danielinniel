import { Metadata } from "next";
import ShopView from "@/components/shop/products/ui/views/ShopView";
import { getActiveCategories, getProducts } from "@/sanity/queries/products";
import { PRODUCT_PAGE_SIZE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Exclusive prints, merchandise, and digital art drops from the Inn & Iel universe.",
};

const Shop = async () => {
  const [categories, initialProducts] = await Promise.all([
    getActiveCategories(),
    getProducts(null, 0, PRODUCT_PAGE_SIZE),
  ]);

  return (
    <ShopView
      categories={categories}
      initialProducts={initialProducts}
      pageSize={PRODUCT_PAGE_SIZE}
    />
  );
};

export default Shop;
