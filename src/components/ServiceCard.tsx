"use client";

import { useState } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { TbArrowBigRightLines } from "react-icons/tb";
import { CometCard } from "./ui/comet-card";
import { cn } from "@/lib/utils";

const ServiceCard = ({
  highlighted = false,
  text,
  href = "/",
  src,
  fallbackSrc,
  sizes = "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw",
  viewDelay = 0.6,
}: {
  highlighted?: boolean;
  text: string;
  href?: string;
  src: StaticImageData | string;
  fallbackSrc?: StaticImageData | string;
  sizes?: string;
  viewDelay?: number;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset load/error state when src changes (React docs "adjust state when
  // prop changes" pattern — runs during render, not in an effect).
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setImageLoaded(false);
    setImageError(false);
  }

  const useFallbackPermanently = imageError && !!fallbackSrc;
  const showMainImage = imageLoaded && !imageError;
  const shouldRenderMainImage = !useFallbackPermanently;

  return (
    <CometCard
      viewDelay={viewDelay}
      className={cn(highlighted && "lg:scale-110")}
    >
      <Link
        href={href}
        className="flex w-full h-full cursor-pointer flex-col items-stretch rounded-[16px] ring ring-foreground/10 bg-[#0e0d0d] p-2 md:p-2 lg:p-4 gap-1"
        style={{
          transformStyle: "preserve-3d",
          transform: "none",
          opacity: 1,
        }}
      >
        {/* Both image layers share one reserved area, including while loading. */}
        <div
          key={typeof src === "string" ? src : src.src}
          className="relative mx-2 overflow-hidden"
          style={{
            aspectRatio: "1 / 1",
            minHeight: "300px",
          }}
        >
          {/* Keep the fallback mounted so it can crossfade and survive errors. */}
          {fallbackSrc && (
            <Image
              src={fallbackSrc}
              className={cn(
                "object-cover transition-opacity duration-300",
                showMainImage ? "opacity-0" : "opacity-100",
              )}
              fill
              sizes={sizes}
              alt=""
            />
          )}
          {shouldRenderMainImage && (
            <Image
              src={src}
              className={cn(
                "object-cover transition-opacity duration-300",
                !fallbackSrc || showMainImage ? "opacity-100" : "opacity-0",
              )}
              fill
              sizes={sizes}
              alt=""
              unoptimized
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                if (fallbackSrc) {
                  setImageLoaded(false);
                }
              }}
            />
          )}
        </div>
        <div className="z-2 flex shrink-0 items-center justify-between font-sans px-4 pb-3 sm:pb-3.5 lg:pb-1.5 lg:px-2 2xl:pt-1.5 2xl:pb-4">
          <h3 className="font-semibold max-sm:text-[22px] max-md:text-xl max-lg:text-xl lg:text-xl 2xl:text-[26px]">
            {text}
          </h3>
          <span className="text-xs opacity-50">
            <TbArrowBigRightLines className="size-7 2xl:size-8" />
          </span>
        </div>
      </Link>
    </CometCard>
  );
};

export default ServiceCard;

// bg-[#0B0B0B]
