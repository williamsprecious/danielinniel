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
  const renderTextGroup = () => (
    <span className="flex shrink-0 items-center gap-4 pr-4">
      <span className="inline-flex items-center">{text}</span>
      <span aria-hidden>-</span>
    </span>
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden inline-block text-[13px] lg:text-sm 2xl:text-base align-middle",
        widthClass,
        className,
      )}
    >
      <motion.div
        className="flex w-max whitespace-nowrap will-change-transform"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
        aria-hidden
      >
        {renderTextGroup()}
        {renderTextGroup()}
      </motion.div>
    </div>
  );
};

export default ScrollingText;
