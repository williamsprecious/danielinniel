"use client";

import { motion } from "motion/react";
import HeaderText from "@/components/HeaderText";
import GalleryFilterItem from "@/components/GalleryFilterItem";

const GalleryFilter = ({
  title,
  filterValues,
  linkParams,
  type,
}: GalleryFilterProps) => {
  return (
    <>
      <HeaderText title={title} delay={0.1} className="mb-2 md:mb-4 2xl:mb-6" />

      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm py-5 md:py-4 2xl:py-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{
            scale: 1,
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.4,
              duration: 0.8,
            },
          }}
          viewport={{ once: true, amount: 0.1 }}
          className="mx-auto w-fit p-1 border border-border rounded-full flex gap-1 items-center sm:p-1.5"
        >
          {filterValues.map((filter) => (
            <GalleryFilterItem
              key={filter.value}
              filterValue={filter}
              linkParams={linkParams}
              type={type}
            />
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default GalleryFilter;
