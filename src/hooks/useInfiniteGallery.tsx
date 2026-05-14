"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getGalleryData, GalleryData } from "@/actions/gallery.action";
import { GALLERY_QUERY_RESULT } from "../../sanity.types";

interface UseInfiniteGalleryProps {
  category: string;
  filterParam?: string;
  limit?: number;
}

interface UseInfiniteGalleryReturn {
  items: GALLERY_QUERY_RESULT;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
}

export const useInfiniteGallery = ({
  category,
  filterParam,
  limit = 12,
}: UseInfiniteGalleryProps): UseInfiniteGalleryReturn => {
  const [items, setItems] = useState<GALLERY_QUERY_RESULT>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const loadingRef = useRef(false);

  const fetchData = useCallback(
    async (page: number, reset = false) => {
      if (loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const start = page * limit;
        const data: GalleryData = await getGalleryData(
          category,
          filterParam,
          start,
          limit
        );

        if (reset) {
          setItems(data.items);
          setCurrentPage(0);
        } else {
          setItems((prev) => [...prev, ...data.items]);
          setCurrentPage(page);
        }

        setHasMore(data.hasMore);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch gallery data"
        );
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [category, filterParam, limit]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore && !loadingRef.current) {
      fetchData(currentPage + 1);
    }
  }, [loading, hasMore, currentPage, fetchData]);

  const refetch = useCallback(() => {
    fetchData(0, true);
  }, [fetchData]);

  // Initial load and refetch when dependencies change
  useEffect(() => {
    fetchData(0, true);
  }, [fetchData]);

  return {
    items,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
  };
};
