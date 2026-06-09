"use server";

import { getProducts } from "@/sanity/queries/products";
import type { ProductListResult } from "@/lib/shop-types";
import { PRODUCT_PAGE_SIZE } from "@/lib/utils";

export async function loadMoreProducts(
  categorySlug: string | null,
  start: number,
  limit = PRODUCT_PAGE_SIZE,
): Promise<ProductListResult> {
  return getProducts(categorySlug, start, limit);
}
