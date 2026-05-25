"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ShoppingBag } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductGallery from "@/components/shop/products/ui/components/ProductGallery";
import OptionSelector from "@/components/shop/products/ui/components/OptionSelector";
import QuantityStepper from "@/components/shop/products/ui/components/QuantityStepper";
import SaleBadge from "@/components/shop/products/ui/components/SaleBadge";
import ProductAccordion from "@/components/shop/products/ui/components/ProductAccordion";
import PortableText from "@/components/shop/products/ui/components/PortableText";
import { useCartDrawer } from "@/components/shop/cart/hooks/use-cart-drawer";
import type { ProductDetail } from "@/lib/shop-types";
import { formatPrice } from "@/lib/format-price";
import { useCurrencyStore, useHydratedCurrency } from "@/store/currency-store";
import { useCartStore, type CartLine } from "@/store/cart-store";
import { cn } from "@/lib/utils";

type ProductDetailViewProps = {
  product: ProductDetail;
};

const ProductDetailView = ({ product }: ProductDetailViewProps) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(() =>
    product.options.map((o) => o.values[0] ?? ""),
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const currency = useHydratedCurrency();
  const rates = useCurrencyStore((s) => s.rates);
  const openCart = useCartDrawer((s) => s.open);
  const addLine = useCartStore((s) => s.addLine);

  const showOptionSelectors =
    product.type === "physical" &&
    product.hasVariants &&
    product.options.length > 0;

  const activeVariant = useMemo(() => {
    if (!showOptionSelectors || product.variants.length === 0) return null;
    const key = selectedValues.join("|");
    return (
      product.variants.find((v) => v.optionValues.join("|") === key) ??
      product.variants[0]
    );
  }, [showOptionSelectors, product.variants, selectedValues]);

  const availableStock = useMemo(() => {
    if (product.type === "digital") return undefined;
    if (showOptionSelectors && activeVariant) return activeVariant.stock;
    return product.stock;
  }, [product.type, product.stock, showOptionSelectors, activeVariant]);

  const isOutOfStock = availableStock === 0;

  useEffect(() => {
    if (
      availableStock !== undefined &&
      availableStock > 0 &&
      quantity > availableStock
    ) {
      setQuantity(availableStock);
    }
  }, [availableStock]);

  const displayedPriceNGN = activeVariant?.priceNGN ?? product.priceNGN;
  const displayedCompareAtPriceNGN =
    activeVariant?.compareAtPriceNGN ?? product.compareAtPriceNGN;

  const onSale =
    typeof displayedCompareAtPriceNGN === "number" &&
    displayedCompareAtPriceNGN > displayedPriceNGN;
  const discountPercent = onSale
    ? Math.round(
        ((displayedCompareAtPriceNGN! - displayedPriceNGN) /
          displayedCompareAtPriceNGN!) *
          100,
      )
    : null;

  const accordionSections: { title: string; content: React.ReactNode }[] = [];

  if (product.description?.length) {
    accordionSections.push({
      title: "Description",
      content: <PortableText value={product.description} />,
    });
  }

  if (product.specifications.length > 0) {
    accordionSections.push({
      title: "Specifications",
      content: (
        <dl className="flex flex-col gap-2">
          {product.specifications.map((spec) => (
            <div
              key={spec.label}
              className="flex items-baseline justify-between gap-4 border-b border-border/25 pb-2 last:border-b-0 last:pb-0"
            >
              <dt className="text-foreground/55">{spec.label}</dt>
              <dd className="text-right text-foreground/85">{spec.value}</dd>
            </div>
          ))}
        </dl>
      ),
    });
  }

  if (product.shipping) {
    accordionSections.push({
      title: product.type === "digital" ? "Delivery" : "Shipping & Returns",
      content: (
        <div className="flex flex-col gap-3">
          <p>{product.shipping}</p>
        </div>
      ),
    });
  }

  const handleAddToCart = () => {
    if (isOutOfStock || isAdding) return;
    const firstImage = product.images[0];
    if (!firstImage) return;

    const line: Omit<CartLine, "qty"> = {
      productId: product._id,
      variantKey: activeVariant?.key ?? null,
      slug: product.slug,
      title: product.title,
      variantTitle: activeVariant?.title ?? null,
      type: product.type,
      image: firstImage,
      priceNGN: displayedPriceNGN,
      compareAtPriceNGN: displayedCompareAtPriceNGN,
      stock: availableStock,
    };

    setIsAdding(true);
    setTimeout(() => {
      addLine(line, product.type === "digital" ? 1 : quantity);
      openCart();
      setIsAdding(false);
    }, 1000);
  };

  return (
    <>
      <section className="row-container pt-16 pb-24 md:pt-32 md:pb-32 2xl:pt-40 2xl:pb-40">
        <Breadcrumb className="text-xs sm:text-sm">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/shop">Shop</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-8 grid grid-cols-1 gap-14 md:mt-10 md:gap-10 md:grid-cols-2 lg:gap-14 xl:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <ProductGallery images={product.images} alt={product.title} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col gap-7 md:gap-8"
          >
            <div className="flex flex-col gap-4">
              {discountPercent !== null && (
                <div>
                  <SaleBadge rotate={false} size="md">
                    Save {discountPercent}%
                  </SaleBadge>
                </div>
              )}

              <h1 className="max-[360px]:text-5xl font-heading text-6xl md:text-7xl lg:text-8xl 2xl:text-9xl">
                {product.title}
              </h1>

              <div className="flex items-baseline gap-3">
                <span className="text-2xl text-foreground sm:text-[28px]">
                  {formatPrice(displayedPriceNGN, currency, rates)}
                </span>
                {onSale && (
                  <span className="text-base text-foreground/40 line-through tabular-nums sm:text-lg">
                    {formatPrice(displayedCompareAtPriceNGN!, currency, rates)}
                  </span>
                )}
              </div>
            </div>

            {showOptionSelectors && (
              <div className="flex flex-col gap-6">
                {product.options.map((option, optionIndex) => (
                  <OptionSelector
                    key={option.name}
                    name={option.name}
                    values={option.values}
                    value={selectedValues[optionIndex] ?? option.values[0]}
                    onChange={(val) =>
                      setSelectedValues((prev) => {
                        const next = [...prev];
                        next[optionIndex] = val;
                        return next;
                      })
                    }
                  />
                ))}
              </div>
            )}

            <div className="mb-5 space-y-4 md:mb-12">
              {product.type !== "digital" && (
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  max={
                    availableStock !== undefined && availableStock > 0
                      ? availableStock
                      : 99
                  }
                />
              )}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className={cn(
                  "flex h-16 w-96 max-w-full flex-1 items-center justify-center gap-2.5 rounded-full transition-all duration-300 2xl:h-20 2xl:w-[400px] 2xl:gap-3.5",
                  isOutOfStock
                    ? "cursor-not-allowed bg-foreground/10 text-foreground/40"
                    : isAdding
                      ? "cursor-not-allowed bg-primary/70 text-primary-foreground"
                      : "cursor-pointer bg-primary text-primary-foreground",
                )}
              >
                <ShoppingBag className="size-4 md:size-5 2xl:size-6" />
                <span className="text-base font-medium tracking-wide lg:text-base 2xl:text-xl">
                  {isOutOfStock ? "Out of Stock" : isAdding ? "Adding..." : "Add To Cart"}
                </span>
              </button>
            </div>

            {accordionSections.length > 0 && (
              <ProductAccordion className="mt-2" sections={accordionSections} />
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ProductDetailView;
