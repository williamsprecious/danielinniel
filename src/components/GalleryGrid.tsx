"use client";

import { useDebouncedCallback } from "use-debounce";
import useFancybox from "@/hooks/useFancybox";
import { useInfiniteGallery } from "@/hooks/useInfiniteGallery";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import GalleryGridItem from "@/components/GalleryGridItem";
import LoadingSpinner from "@/components/LoadingSpinner";
import { urlFor } from "@/sanity/lib/image";
import { useParams } from "next/navigation";

interface GalleryGridProps {
  category: string;
}

const GalleryGrid = ({ category }: GalleryGridProps) => {
  const { grade, conceptType } = useParams<{
    grade: string;
    conceptType: string;
  }>();

  const currentFilterParams = grade || conceptType;

  const { items, loading, hasMore, loadMore } = useInfiniteGallery({
    category,
    filterParam: currentFilterParams,
    limit: 20,
  });

  // Debounce the loadMore function to prevent rapid repeated calls
  const debouncedLoadMore = useDebouncedCallback(loadMore, 400);

  const [fancyboxRef] = useFancybox({
    Carousel: {
      Thumbs: false,
      Zoomable: {
        Panzoom: {
          protected: true,
        },
      },
    },
  });

  const loadMoreRef = useIntersectionObserver({
    callback: debouncedLoadMore,
    enabled: hasMore && !loading,
  });

  return (
    <>
      <div
        ref={fancyboxRef}
        className="row-container grid gap-4 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:mt-14"
      >
        {items.map((item) => {
          const hasImage = !!item.image;

          const imageUrl = hasImage
            ? item.category === "cover-art"
              ? urlFor(item.image!)
                  .width(700)
                  .height(700)
                  .quality(80)
                  .format("webp")
                  .url()
              : urlFor(item.image!).width(700).quality(80).format("webp").url()
            : null;

          const videoPreviewUrl = item.videoPreview?.asset?.url || null;
          const fullVideoUrl = item.video?.asset?.url || null;

          const isVideoFile =
            item.galleryType === "video" && item.videoType === "file";

          const primaryUrl = isVideoFile ? videoPreviewUrl : imageUrl;

          return (
            <GalleryGridItem
              key={item._id}
              url={primaryUrl!}
              type={item.galleryType!}
              videoType={item.videoType || undefined}
              videoUrl={item.videoUrl || undefined}
              fullVideoUrl={fullVideoUrl || undefined}
              description={item.description || undefined}
            />
          );
        })}
      </div>

      {/* Loading indicator */}
      {loading && <LoadingSpinner className="py-8" />}

      {/* Load more trigger */}
      {hasMore && !loading && <div ref={loadMoreRef} className="h-4" />}

      {items.length === 0 && !loading && !hasMore && (
        <div className="py-8">
          <p className="text-lg opacity-85 text-center font-light tracking-wide italic">
            No items found in this category. Check back later.
          </p>
        </div>
      )}
    </>
  );
};

export default GalleryGrid;
