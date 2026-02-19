"use client";
import { useEffect, useRef, useState } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  once = true,
  viewportAmount = 0.25,
  viewportMargin,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  once?: boolean;
  viewportAmount?: number;
  viewportMargin?: string;
}) => {
  const [scope, animate] = useAnimate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  const wordsArray = words.split(" ");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      {
        threshold: viewportAmount,
        rootMargin: viewportMargin,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, viewportAmount, viewportMargin]);

  useEffect(() => {
    if (!inView) return;

    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.2),
      },
    );
  }, [animate, duration, filter, inView]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="text-foreground/60 opacity-0"
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div ref={containerRef} className={cn("font-normal", className)}>
      <div className="mt-4">
        <div className=" text-foreground/60 text-center text-[17px] leading-snug tracking-wide md:text-xl lg:text-[26px] 2xl:text-3xl">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
