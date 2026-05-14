"use server";

import { sanityFetch } from "@/sanity/lib/live";
import { GALLERY_QUERY, GALLERY_COUNT_QUERY } from "@/sanity/queries";
import { GALLERY_QUERY_RESULT } from "../../sanity.types";

export interface GalleryData {
  items: GALLERY_QUERY_RESULT;
  totalCount: number;
  hasMore: boolean;
}

export const getGalleryData = async (
  category: string,
  filterParam?: string,
  start: number = 0,
  limit: number = 12
): Promise<GalleryData> => {
  try {
    const params = {
      category,
      filterParam: filterParam || null,
      start,
      end: start + limit,
    };

    const [{ data: items }, { data: totalCount }] = await Promise.all([
      sanityFetch({ query: GALLERY_QUERY, params }),
      sanityFetch({
        query: GALLERY_COUNT_QUERY,
        params: { category, filterParam: filterParam || null },
      }),
    ]);

    return {
      items: items ?? [],
      totalCount: totalCount ?? 0,
      hasMore: start + limit < (totalCount ?? 0),
    };
  } catch (error) {
    console.error("Error fetching gallery data:", error);
    return { items: [], totalCount: 0, hasMore: false };
  }
};
