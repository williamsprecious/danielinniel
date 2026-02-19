"use client";

import { motion } from "motion/react";
import HeaderText from "@/components/HeaderText";

const ServicesHeading = () => {
  return (
    <div className="relative pb-4 sm:pb-6 md:pb-8">
      <HeaderText title="Services" />

      <motion.div
        className="absolute bottom-0 left-1/2 h-[1px] bg-border/60"
        initial={{ width: 0, x: "-50%" }}
        whileInView={{ width: "100%", x: "-50%" }}
        viewport={{ amount: 0.3, once: true }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      />
    </div>
  );
};

export default ServicesHeading;
