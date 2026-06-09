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
  viewDelay = 0.6,
}: {
  highlighted?: boolean;
  text: string;
  href?: string;
  src: StaticImageData | string;
  fallbackSrc?: StaticImageData | string;
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

  // Determine if we should use fallback permanently (main image errored)
  const useFallbackPermanently = imageError && !!fallbackSrc;

  // Show fallback when:
  // Fallback exists AND main image hasn't loaded yet, OR
  // Main image errored (use fallback permanently)
  const showFallback = fallbackSrc && (!imageLoaded || useFallbackPermanently);

  // Determine if main image should be rendered
  // Render main image when:
  // - Not using fallback permanently (no error OR no fallback), AND
  // - Either image is loaded OR we're still trying to load it (not loaded yet)
  // This ensures the image stays in DOM during loading to maintain container dimensions
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
        {/* Container with aspect ratio to prevent collapse - always maintains dimensions */}
        <div
          className="mx-2"
          style={{
            aspectRatio: "1 / 1",
            minHeight: "300px",
          }}
        >
          {/* Fallback image - ALWAYS shown when fallback exists and main image hasn't loaded or errored */}
          {showFallback && fallbackSrc && (
            <Image
              src={fallbackSrc}
              className="w-full h-full object-cover"
              width={500}
              height={500}
              alt="Character"
              unoptimized
              priority={useFallbackPermanently}
            />
          )}
          {/* Main image - Keep in DOM but hidden when using fallback permanently to maintain dimensions */}
          {shouldRenderMainImage && (
            <Image
              src={src}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                showFallback && "opacity-0 invisible",
                !showFallback && "opacity-100 visible",
              )}
              width={500}
              height={500}
              alt="Character"
              unoptimized
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                // Ensure fallback is shown when error occurs
                if (fallbackSrc) {
                  setImageLoaded(false);
                }
              }}
            />
          )}
        </div>
        <div className="z-2 flex flex-shrink-0 items-center justify-between font-sans px-4 pb-3 sm:pb-3.5 lg:pb-1.5 lg:px-2 2xl:pt-1.5 2xl:pb-4">
          <h3 className="font-medium max-sm:text-[22px] max-md:text-xl max-lg:text-xl lg:text-xl 2xl:text-[26px]">
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
