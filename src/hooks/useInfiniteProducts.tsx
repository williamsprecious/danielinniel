"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { loadMoreProducts } from "@/actions/product.action";
import type { ProductListItem, ProductListResult } from "@/lib/shop-types";
import { PRODUCT_PAGE_SIZE } from "@/lib/utils";

interface UseInfiniteProductsProps {
  categorySlug: string | null;
  /** Server-fetched first page used to seed state on mount. */
  initialProducts: ProductListResult;
  /** The categorySlug that `initialProducts` was fetched for. Defaults to null (the "All" slot). */
  initialCategorySlug?: string | null;
  limit?: number;
}

interface UseInfiniteProductsReturn {
  items: ProductListItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
}

export const useInfiniteProducts = ({
  categorySlug,
  initialProducts,
  initialCategorySlug = null,
  limit = PRODUCT_PAGE_SIZE,
}: UseInfiniteProductsProps): UseInfiniteProductsReturn => {
  const [items, setItems] = useState<ProductListItem[]>(initialProducts.items);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(initialProducts.hasMore);
  const [currentPage, setCurrentPage] = useState(0);

  const loadingRef = useRef(false);
  // Track whether the current state still represents the server-seeded slug.
  // We skip the auto-fetch on first render when the categorySlug matches the
  // seed so the SSR data isn't immediately discarded.
  const seededSlugRef = useRef<string | null>(initialCategorySlug);

  const fetchData = useCallback(
    async (page: number, reset = false) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);
      setError(null);
      if (reset) setItems([]);

      try {
        const start = page * limit;
        const data: ProductListResult = await loadMoreProducts(
          categorySlug,
          start,
          limit,
        );

        if (reset) {
          setItems(data.items);
          setCurrentPage(0);
        } else {
          setItems((prev) => [...prev, ...data.items]);
          setCurrentPage(page);
        }

        setHasMore(data.hasMore);
        seededSlugRef.current = categorySlug;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products",
        );
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [categorySlug, limit],
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore && !loadingRef.current) {
      fetchData(currentPage + 1);
    }
  }, [loading, hasMore, currentPage, fetchData]);

  const refetch = useCallback(() => {
    fetchData(0, true);
  }, [fetchData]);

  useEffect(() => {
    if (categorySlug === seededSlugRef.current) {
      // Seed is still valid — no refetch needed.
      return;
    }
    fetchData(0, true);
  }, [categorySlug, fetchData]);

  return {
    items,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
  };
};
