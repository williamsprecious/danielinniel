"use client";

import { useMemo, useRef, useState } from "react";
import { Image } from "next-sanity/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { motion } from "motion/react";
import useFancybox from "@/hooks/useFancybox";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type { ShopImage } from "@/lib/shop-types";

type ProductGalleryProps = {
  images: ShopImage[];
  alt: string;
};

const ProductGallery = ({ images, alt }: ProductGalleryProps) => {
  const [index, setIndex] = useState(0);
  const fancyboxOptions = useMemo(() => ({ Carousel: { Thumbs: false } }), []);
  const [setFancyboxRoot] = useFancybox(fancyboxOptions);
  const anchorRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const total = images.length;
  const go = (next: number) => setIndex((next + total) % total);

  if (total === 0) return null;

  return (
    <div ref={setFancyboxRoot} className="flex flex-col gap-3">
      <div className="group/gallery relative aspect-square w-full overflow-hidden rounded-md bg-[#101010]">
        {images.map((image, i) => {
          const isActive = i === index;
          const fullUrl = urlFor(image.source).url();
          const displayUrl = urlFor(image.source).width(1200).url();
          return (
            <motion.div
              key={`${fullUrl}-${i}`}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : 0.98,
              }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "absolute inset-0",
                isActive
                  ? "pointer-events-auto z-10"
                  : "pointer-events-none z-0",
              )}
            >
              <Link
                ref={(el) => {
                  anchorRefs.current[i] = el;
                }}
                href={fullUrl}
                prefetch={false}
                data-fancybox="product-gallery"
                data-caption={alt}
                aria-hidden={!isActive}
                tabIndex={isActive ? 0 : -1}
                className="relative block size-full cursor-zoom-in"
              >
                <Image
                  src={displayUrl}
                  alt={alt}
                  width={image.width ?? 1200}
                  height={image.height ?? 1200}
                  sizes="(max-width: 1024px) 100vw, 540px"
                  placeholder={image.lqip ? "blur" : "empty"}
                  blurDataURL={image.lqip}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 size-full object-cover"
                />
              </Link>
            </motion.div>
          );
        })}

        {total > 1 && (
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-full bg-black/65 p-1 ring-1 ring-inset ring-foreground/10 backdrop-blur-md transition-opacity duration-200 sm:bottom-4 sm:left-4 md:opacity-0 md:group-hover/gallery:opacity-100">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous image"
              className="grid size-9 cursor-pointer place-items-center rounded-full text-foreground/85 transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              <ChevronLeft size={18} strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next image"
              className="grid size-9 cursor-pointer place-items-center rounded-full text-foreground/85 transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              <ChevronRight size={18} strokeWidth={2.2} />
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => anchorRefs.current[index]?.click()}
          aria-label="Expand image"
          className="absolute bottom-3 right-3 z-20 grid size-10 cursor-pointer place-items-center rounded-full bg-black/65 text-foreground/85 ring-1 ring-inset ring-foreground/10 backdrop-blur-md transition-colors sm:bottom-4 sm:right-4"
        >
          <Expand size={16} strokeWidth={2.2} />
        </button>
      </div>

      {total > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.slice(0, 5).map((image, i) => {
            const isActive = i === index;
            const thumbUrl = urlFor(image.source).width(200).height(200).url();
            return (
              <button
                key={`${thumbUrl}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-md bg-[#0d0d0d] ring-1 ring-inset transition-all duration-300",
                  isActive
                    ? "ring-foreground/70 ring-2"
                    : "cursor-pointer ring-transparent hover:ring-foreground/30",
                )}
              >
                <Image
                  src={thumbUrl}
                  alt={`${alt} thumbnail ${i + 1}`}
                  width={200}
                  height={200}
                  sizes="100px"
                  loading="lazy"
                  className="absolute inset-0 size-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
