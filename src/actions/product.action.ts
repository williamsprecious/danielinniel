"use server";

import { getProducts } from "@/sanity/queries/products";
import type { ProductListResult } from "@/lib/shop-types";

/**
 * Server Action used by the client-side infinite-scroll hook to fetch
 * subsequent pages and re-filter on category change. Initial page-load
 * data is fetched directly in the shop server component via
 * `getProducts` from `@/sanity/queries/products` — calling that
 * directly preserves Sanity Live caching that the action boundary
 * would otherwise bypass.
 */
export async function loadMoreProducts(
  categorySlug: string | null,
  start: number,
  limit = 12,
): Promise<ProductListResult> {
  return getProducts(categorySlug, start, limit);
}
