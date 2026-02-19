"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ScrollingTextProps {
  text: string;
  widthClass?: string; // e.g. "w-[64px]"
  duration?: number; // seconds per loop
  className?: string;
}

const ScrollingText = ({
  text,
  widthClass = "w-[64px]",
  duration = 3,
  className,
}: ScrollingTextProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden inline-block text-[13px] lg:text-sm 2xl:text-base align-middle",
        widthClass,
        className
      )}
    >
      <motion.div
        className="whitespace-nowrap will-change-transform"
        animate={{ x: ["100%", "-100%"] }}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
        aria-hidden
      >
        <span className="inline-flex items-center">{text}</span>
        <span className="mx-4">-</span>
        <span className="inline-flex items-center">{text}</span>
      </motion.div>
    </div>
  );
};

export default ScrollingText;
