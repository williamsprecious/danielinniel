"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ProductListItem } from "@/lib/shop-types";

export type CategoryFilterOption = {
  _id: string;
  title: string;
  slug: string | null;
};

type CategoryFilterProps = {
  options: CategoryFilterOption[];
  value: string | null;
  onChange: (slug: string | null) => void;
  className?: string;
  items: ProductListItem[];
};

const CategoryFilter = ({
  options,
  value,
  onChange,
  className,
  items,
}: CategoryFilterProps) => {
  if (options.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Filter products by category"
      role="tablist"
      className={cn(
        "pt-8 pb-12 flex w-full flex-wrap justify-center gap-x-2 gap-y-3 md:pt-8 md:pb-16 2xl:pb-20 2xl:pt-10",
        items.length && "border-b border-border/60",
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.slug === value;

        return (
          <button
            key={option._id}
            type="button"
            onClick={() => onChange(option.slug)}
            role="tab"
            aria-selected={isActive}
            className={cn(
              "relative inline-flex shrink-0 cursor-pointer items-center rounded-full px-3 py-1.5 text-xs transition-colors duration-200 md:px-4 md:py-2 md:text-sm 2xl:px-6 2xl:text-base",
              isActive
                ? "text-background"
                : "border border-border/40 text-foreground/70 hover:text-foreground",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="category-filter-pill"
                className="absolute inset-0 -z-10 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 360, damping: 34 }}
              />
            )}
            <span className="relative font-normal">{option.title}</span>
          </button>
        );
      })}
    </motion.div>
  );
};

export default CategoryFilter;
