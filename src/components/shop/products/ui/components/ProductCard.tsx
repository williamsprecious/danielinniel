"use client";

import { Image } from "next-sanity/image";
import Link from "next/link";
import { motion } from "motion/react";
import SaleBadge from "@/components/shop/products/ui/components/SaleBadge";
import type { ProductListItem } from "@/lib/shop-types";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format-price";
import { useCurrencyStore, useHydratedCurrency } from "@/store/currency-store";
import { urlFor } from "@/sanity/lib/image";

type ProductCardProps = {
  product: ProductListItem;
  index?: number;
};

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const currency = useHydratedCurrency();
  const rates = useCurrencyStore((s) => s.rates);

  const onSale =
    typeof product.compareAtPriceNGN === "number" &&
    product.compareAtPriceNGN > product.priceNGN;
  const discountPct = onSale
    ? Math.round(
        ((product.compareAtPriceNGN! - product.priceNGN) /
          product.compareAtPriceNGN!) *
          100,
      )
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: Math.min(index * 0.06, 0.36),
      }}
      className="flex flex-col gap-4"
    >
      <Link
        href={`/shop/${product.slug}`}
        className="relative block overflow-hidden rounded-md bg-[#101010]"
        aria-label={product.title}
      >
        <div className="relative aspect-square w-full">
          <Image
            src={urlFor(product.image.source).width(800).url()}
            alt={product.title}
            width={product.image.width ?? 800}
            height={product.image.height ?? 800}
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            placeholder={product.image.lqip ? "blur" : "empty"}
            blurDataURL={product.image.lqip}
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />

          {discountPct !== null && (
            <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
              <SaleBadge>-{discountPct}%</SaleBadge>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col gap-1.5 px-0.5">
        <Link href={`/shop/${product.slug}`} className="w-fit">
          <h3 className="text-2xl font-heading font-normal leading-tight text-foreground sm:text-3xl">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-sm tabular-nums md:text-base",
              onSale ? "text-foreground" : "text-foreground/85",
            )}
          >
            {formatPrice(product.priceNGN, currency, rates)}
          </span>
          {onSale && (
            <span className="text-sm text-foreground/40 line-through tabular-nums md:text-base">
              {formatPrice(product.compareAtPriceNGN!, currency, rates)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
