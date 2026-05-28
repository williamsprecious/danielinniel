import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailView from "@/components/shop/products/ui/views/ProductDetailView";
import {
  getProductBySlug,
  // getActiveProductSlugs,
} from "@/sanity/queries/products";

type Params = { slug: string };

// export const generateStaticParams = async () => {
//   const slugs = await getActiveProductSlugs();
//   return slugs.map((slug) => ({ slug }));
// };

export const generateMetadata = async ({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const product = await getProductBySlug(slug, { stega: false });
  if (!product) return { title: "Product not found" };

  return {
    title: product.title,
    description: product.shortDescription,
  };
};

const ProductPage = async ({ params }: { params: Promise<Params> }) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return <ProductDetailView product={product} />;
};

export default ProductPage;
