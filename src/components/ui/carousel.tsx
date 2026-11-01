"use client";

import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, type PanInfo } from "motion/react";
import ButtonAnimationWrapper from "@/components/ButtonAnimationWrapper";
import { Button } from "@/components/ui/button";
import useFancybox from "@/hooks/useFancybox";
import { Image } from "next-sanity/image";
import Link from "next/link";
import { getSwipeDirection } from "@/lib/carousel-gesture";

interface SlideData {
  title: string;
  button: string;
  src: string;
  _id: string;
  workUrl: string | null;
  image: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
    };
    media?: unknown;
    hotspot?: unknown;
    crop?: unknown;
    _type: "image";
  } | null;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);

  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (event.buttons !== 0) {
      xRef.current = 0;
      yRef.current = 0;
      return;
    }
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { src, button, title, workUrl } = slide;

  return (
    <li
      ref={slideRef}
      className="flex flex-1 flex-col cursor-grab active:cursor-grabbing items-center justify-center relative text-center text-foreground opacity-100 transition-all duration-300 ease-in-out w-[70vmin] h-[70vmin] mx-[4vmin] z-10 [perspective:1200px] [transform-style:preserve-3d] sm:w-[65vmin] sm:h-[65vmin]"
      onClick={() => handleSlideClick(index)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform:
          current !== index
            ? "scale(0.8) rotateX(8deg)"
            : "scale(1) rotateX(0deg)",
        transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        transformOrigin: "bottom",
      }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full rounded-2xl bg-[#1D1F2F] overflow-hidden transition-all duration-150 ease-out"
        style={{
          transform:
            current === index
              ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
              : "none",
        }}
      >
        <Image
          className="absolute inset-0 w-[120%] h-[120%] object-cover opacity-100 transition-opacity duration-600 ease-in-out"
          style={{
            opacity: current === index ? 1 : 0.8,
          }}
          alt={title}
          src={src}
          width={500}
          height={500}
          onLoad={imageLoaded}
          loading="eager"
          decoding="sync"
          draggable={false}
        />
        {current === index && (
          <div className="absolute inset-0 bg-black/30 transition-all duration-1000" />
        )}
      </div>

      <article
        className={`relative p-[4vmin] transition-opacity duration-1000 ease-in-out ${
          current === index ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <h2 className="text-xl text-center tracking-[-1px] md:text-2xl lg:text-3xl font-sans font-semibold relative 2xl:text-4xl">
          {title}
        </h2>
        <div
          className="mt-3 flex justify-center md:mt-4"
          onClick={(e) => e.stopPropagation()}
        >
          <ButtonAnimationWrapper>
            {workUrl ? (
              <Link
                href={workUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
                draggable={false}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size={"lg"}
                  variant="secondary"
                  className="px-3! gap-1.5! mx-auto hover:shadow-lg hover:bg-secondary hover:text-background transition duration-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] 2xl:px-5!"
                >
                  {button}
                </Button>
              </Link>
            ) : (
              <a
                href={slide.src}
                data-fancybox="featured-gallery"
                data-caption={slide.title}
                className="inline-block"
                draggable={false}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  size={"lg"}
                  variant="secondary"
                  className="px-3! gap-1.5! mx-auto hover:shadow-lg hover:bg-secondary hover:text-background transition duration-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] 2xl:px-5!"
                >
                  {button}
                </Button>
              </a>
            )}
          </ButtonAnimationWrapper>
        </div>
      </article>
    </li>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      type="button"
      className={`w-10 h-10 cursor-pointer flex items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 border-3 border-transparent rounded-full focus:border-primary focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      aria-label={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-neutral-600 dark:text-foreground/85" />
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
  autoPlayInterval?: number;
  pauseOnHover?: boolean;
}

const DEFAULT_AUTO_PLAY_INTERVAL = 5000;
const RESUME_DELAY = 3000; // Resume auto-play 3 seconds after interaction

export default function Carousel({
  slides,
  autoPlayInterval = DEFAULT_AUTO_PLAY_INTERVAL,
  pauseOnHover = false,
}: CarouselProps) {
  const [current, setCurrent] = useState(slides.length > 1 ? 1 : 0);
  const activeIndex = current % Math.max(slides.length, 1);

  // Refs to track auto-play state without causing re-renders
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const suppressClickRef = useRef(false);
  const carouselRef = useRef<HTMLDivElement | null>(null);

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

  // Combine carousel ref with fancybox ref callback
  const setCombinedRefs = useCallback(
    (node: HTMLDivElement | null) => {
      carouselRef.current = node;
      fancyboxRef(node);
    },
    [fancyboxRef],
  );

  const advanceToNext = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
  }, []);

  const startAutoPlay = useCallback(() => {
    // Don't start if paused, hovered, or only one slide
    if (
      isPausedRef.current ||
      isHoveredRef.current ||
      isDraggingRef.current ||
      slides.length <= 1
    ) {
      return;
    }

    // CRITICAL: Clear any existing interval before starting a new one
    // This prevents multiple intervals from running simultaneously and ensures
    // clean state transitions when manually navigating or resuming from pause
    stopAutoPlay();

    autoPlayIntervalRef.current = setInterval(() => {
      // Double-check pause state before advancing
      if (
        !isPausedRef.current &&
        !isHoveredRef.current &&
        !isDraggingRef.current
      ) {
        advanceToNext();
      }
    }, autoPlayInterval);
  }, [autoPlayInterval, advanceToNext, slides.length, stopAutoPlay]);

  const pauseAutoPlay = useCallback(() => {
    isPausedRef.current = true;
    stopAutoPlay();

    // Clear resume timeout if exists
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, [stopAutoPlay]);

  const resetAutoPlay = useCallback(() => {
    // Reset the auto-play timer (useful after manual navigation)
    // This ensures the timer resets to full duration after user interaction
    // The old interval is cleared FIRST, preventing any race conditions
    stopAutoPlay();
    if (!isPausedRef.current && !isHoveredRef.current) {
      startAutoPlay();
    }
  }, [stopAutoPlay, startAutoPlay]);

  const resumeAutoPlay = useCallback(() => {
    if (isDraggingRef.current) return;
    // Clear any existing resume timeout
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }

    // Resume after a delay, but only if conditions are met
    resumeTimeoutRef.current = setTimeout(() => {
      if (!isHoveredRef.current && !isDraggingRef.current) {
        isPausedRef.current = false;
        startAutoPlay();
      }
    }, RESUME_DELAY);
  }, [startAutoPlay]);

  // Initialize auto-play on mount
  useEffect(() => {
    if (slides.length <= 1) return;

    // Reset pause state and start auto-play
    isPausedRef.current = false;
    isHoveredRef.current = false;
    startAutoPlay();

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
        resumeTimeoutRef.current = null;
      }
    };
  }, [slides.length, startAutoPlay]);

  // Handle hover to pause/resume auto-play
  const handleMouseEnter = useCallback(() => {
    if (!pauseOnHover) return;
    isHoveredRef.current = true;
    pauseAutoPlay();
  }, [pauseOnHover, pauseAutoPlay]);

  const handleMouseLeave = useCallback(() => {
    if (!pauseOnHover) return;
    isHoveredRef.current = false;
    resumeAutoPlay();
  }, [pauseOnHover, resumeAutoPlay]);

  const handlePreviousClick = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    resetAutoPlay();
  }, [slides.length, resetAutoPlay]);

  const handleNextClick = useCallback(() => {
    advanceToNext();
    resetAutoPlay();
  }, [advanceToNext, resetAutoPlay]);

  const handleSlideClick = useCallback(
    (index: number) => {
      if (activeIndex !== index) {
        setCurrent(index);
        resetAutoPlay();
      }
    },
    [activeIndex, resetAutoPlay],
  );

  const handleDragStart = useCallback(() => {
    isDraggingRef.current = true;
    suppressClickRef.current = true;
    pauseAutoPlay();
  }, [pauseAutoPlay]);

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      isDraggingRef.current = false;
      if (event.type !== "pointercancel" && slides.length > 1) {
        const direction = getSwipeDirection(
          info,
          carouselRef.current?.clientWidth ?? 0,
        );
        if (direction !== 0) {
          setCurrent(
            (prev) => (prev + direction + slides.length) % slides.length,
          );
        }
      }
      resumeAutoPlay();
    },
    [slides.length, resumeAutoPlay],
  );

  const handleClickCapture = useCallback((event: React.MouseEvent) => {
    // Block the click generated by a drag release, including Fancybox links.
    // A new pointer press clears this flag; keyboard clicks remain available.
    if (suppressClickRef.current && event.detail !== 0) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, []);

  if (slides.length === 0) return null;

  return (
    <div
      ref={setCombinedRefs}
      className="relative w-[70vmin] h-[70vmin] mx-auto sm:w-[65vmin] sm:h-[65vmin]"
      role="region"
      aria-label="Featured works"
      aria-roledescription="carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="absolute inset-0 touch-pan-y select-none cursor-grab active:cursor-grabbing"
        drag={slides.length > 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        dragMomentum={false}
        dragSnapToOrigin
        dragTransition={{ bounceStiffness: 600, bounceDamping: 40 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onPointerDownCapture={() => {
          suppressClickRef.current = false;
        }}
        onClickCapture={handleClickCapture}
      >
        <ul
          className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${activeIndex * (100 / slides.length)}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <Slide
              key={slide._id}
              slide={slide}
              index={index}
              current={activeIndex}
              handleSlideClick={handleSlideClick}
            />
          ))}
        </ul>
      </motion.div>

      <div className="absolute flex justify-center w-full top-[calc(100%+2rem)] lg:top-[calc(100%+3rem)] 2xl:top-[calc(100%+4rem)]">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />

        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
}
