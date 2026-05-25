"use client";

import { useState, useEffect, type MouseEvent } from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { motion } from "motion/react";
import { MdOutlineRocketLaunch } from "react-icons/md";
import joinMovement from "@public/join-the-movement.webp";
import { buttonVariants } from "@/components/ui/button";
import RollingGallery from "@/components/ui/RollingGallery/RollingGallery";
import ButtonAnimationWrapper from "@/components/ButtonAnimationWrapper";
import { cn } from "@/lib/utils";

const OptimizedHeadingImage = ({
  mainSrc,
  fallbackSrc,
}: {
  mainSrc: string;
  fallbackSrc: StaticImageData;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset state when src changes to handle prop updates correctly
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [mainSrc]);

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
    <div className="relative h-[70px] md:h-[90px] 2xl:h-[120px] flex items-center justify-center">
      {/* Fallback image - ALWAYS shown when fallback exists and main image hasn't loaded or errored */}
      {fallbackSrc && showFallback && (
        <Image
          src={fallbackSrc}
          className="h-full w-auto object-contain"
          height={130}
          alt="Nft Header"
          unoptimized
          priority
        />
      )}
      {/* Main image - Keep in DOM but hidden when using fallback permanently to maintain dimensions */}
      {shouldRenderMainImage && (
        <Image
          src={mainSrc}
          className={cn(
            "h-full w-auto object-contain transition-opacity duration-300",
            showFallback &&
              "opacity-0 invisible absolute left-1/2 -translate-x-1/2",
            !showFallback && "opacity-100 visible",
          )}
          width={1000}
          height={130}
          alt="Nft Header"
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
  );
};

const Nft = () => {
  const handleZoraClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const proceed = window.confirm(
      "This NFT collection is available on Zora. Login is required to view. Continue to Zora?",
    );

    if (!proceed) {
      event.preventDefault();
    }
  };

  return (
    <section className="pb-24 pt-20 max-md:space-y-7">
      <div className="row-container flex flex-col gap-1 items-center md:gap-2">
        <motion.div
          initial={{
            y: 40,
            opacity: 0,
            scale: 0.9,
          }}
          whileInView={{
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.2,
            duration: 0.8,
          }}
          viewport={{ amount: 0.3, once: true }}
        >
          <OptimizedHeadingImage
            mainSrc="https://d1o0lg255tq9i5.cloudfront.net/join-the-movement.gif"
            fallbackSrc={joinMovement}
          />
        </motion.div>
        <motion.h4
          initial={{
            y: 60,
            opacity: 0,
          }}
          whileInView={{
            y: 0,
            opacity: 0.85,
          }}
          transition={{
            type: "spring",
            stiffness: 90,
            damping: 18,
            duration: 1,
          }}
          viewport={{ amount: 0.3, once: true }}
          className="w-[100%] text-center text-sm opacity-85 min-[680px]:w-[90%] sm:text-base md:text-base md:mx-auto md:max-w-[640px] lg:max-w-2xl 2xl:text-xl 2xl:max-w-3xl"
        >
          Enter the inn & iel universe with curated collections of original,
          collectible characters.
        </motion.h4>
      </div>

      <RollingGallery
        autoplay={true}
        pauseOnHover={true}
        images={[
          "/inn&-iel-nft1.webp",
          "/inn&-iel-nft2.webp",
          "/inn&-iel-nft3.webp",
          "/inn&-iel-nft4.webp",
          "/inn&-iel-nft5.webp",
        ]}
      />

      <div className="flex justify-center">
        <ButtonAnimationWrapper>
          <Link
            href="https://zora.co/invite/danielinniel"
            onClick={handleZoraClick}
            className={buttonVariants({ size: "lg" })}
          >
            View on Zora
            <MdOutlineRocketLaunch />
          </Link>
        </ButtonAnimationWrapper>
      </div>
    </section>
  );
};

export default Nft;
