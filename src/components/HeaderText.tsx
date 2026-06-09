"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const HeaderText = ({
  title,
  delay = 0,
  className,
  textType = "h2",
  underline = false,
}: {
  title: string;
  delay?: number;
  className?: string;
  textType?: "h1" | "h2";
  underline?: boolean;
}) => {
  if (textType === "h1") {
    return (
      <motion.h1
        initial={{
          y: 60,
          opacity: 0,
        }}
        whileInView={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          type: "tween",
          ease: [0.25, 1, 0.5, 1],
          duration: 0.8,
          delay,
        }}
        viewport={{ amount: 0.3, once: true }}
        className={cn(
          "font-heading text-6xl md:text-7xl lg:text-8xl 2xl:text-9xl",
          underline && "underline underline-offset-8",
          className,
        )}
      >
        {title}
      </motion.h1>
    );
  }

  return (
    <motion.h2
      initial={{
        y: 60,
        opacity: 0,
      }}
      whileInView={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 18,
        duration: 1,
        delay,
      }}
      viewport={{ amount: 0.3, once: true }}
      className={cn(
        "font-heading text-5xl text-center md:text-6xl lg:text-7xl 2xl:text-8xl",
        underline && "underline underline-offset-8",
        className,
      )}
    >
      {title}
    </motion.h2>
  );
};

export default HeaderText;
