"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useDebouncedCallback } from "use-debounce";
import ProductCard from "@/components/shop/products/ui/components/ProductCard";
import CategoryFilter, {
  type CategoryFilterOption,
} from "@/components/shop/products/ui/components/CategoryFilter";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import type { ProductListResult, ShopCategory } from "@/lib/shop-types";
import { PRODUCT_PAGE_SIZE } from "@/lib/utils";

type ShopViewProps = {
  categories: ShopCategory[];
  initialProducts: ProductListResult;
  pageSize?: number;
};

const ALL_OPTION: CategoryFilterOption = {
  _id: "all",
  title: "All",
  slug: null,
};

const ShopView = ({
  categories,
  initialProducts,
  pageSize = PRODUCT_PAGE_SIZE,
}: ShopViewProps) => {
  const [categorySlug, setCategorySlug] = useState<string | null>(null);

  const { items, loading, hasMore, loadMore } = useInfiniteProducts({
    categorySlug,
    initialProducts,
    initialCategorySlug: null,
    limit: pageSize,
  });

  const debouncedLoadMore = useDebouncedCallback(loadMore, 400);
  const loadMoreRef = useIntersectionObserver({
    callback: debouncedLoadMore,
    enabled: hasMore && !loading,
  });

  const hasCategories = categories.length > 0;
  const options: CategoryFilterOption[] = hasCategories
    ? [
        ALL_OPTION,
        ...categories.map((c) => ({
          _id: c._id,
          title: c.title,
          slug: c.slug,
        })),
      ]
    : [];

  return (
    <>
      <section className="row-container pt-16 pb-24 md:pt-36 md:pb-32 2xl:pt-44 2xl:pb-40">
        <div className="">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-center text-5xl font-heading md:text-7xl"
          >
            Shop All
          </motion.h1>

          {hasCategories && (
            <CategoryFilter
              options={options}
              value={categorySlug}
              onChange={setCategorySlug}
              items={items}
              loading={loading}
            />
          )}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-2 sm:gap-y-12 md:mt-10 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14 2xl:grid-cols-4">
          {items.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>

        {loading && <LoadingSpinner className="py-12" />}

        {hasMore && !loading && <div ref={loadMoreRef} className="h-4" />}

        {items.length === 0 && !loading && !hasMore && (
          <div className="py-8">
            <p className="text-base opacity-85 text-center font-light tracking-wide italic md:text-lg">
              No items yet. Check back later.
            </p>
          </div>
        )}
      </section>
    </>
  );
};

export default ShopView;
