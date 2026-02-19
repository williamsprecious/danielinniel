"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const HeaderText = ({
  title,
  underline,
  delay = 0,
  className,
  textType = "h2",
}: {
  title: string;
  underline?: boolean;
  delay?: number;
  className?: string;
  textType?: "h1" | "h2";
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
          type: "spring",
          stiffness: 90,
          damping: 18,
          duration: 1,
          delay,
        }}
        viewport={{ amount: 0.3, once: true }}
        className={cn(underline && "underline", className)}
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
      className={cn(underline && "underline", className)}
    >
      {title}
    </motion.h2>
  );
};

export default HeaderText;
