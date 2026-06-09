"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export type AccordionSection = {
  title: string;
  content: React.ReactNode;
};

type ProductAccordionProps = {
  sections: AccordionSection[];
  className?: string;
  defaultOpen?: number;
};

const ProductAccordion = ({
  sections,
  className,
  defaultOpen,
}: ProductAccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(
    defaultOpen ?? null,
  );

  return (
    <div className={cn("flex flex-col", className)}>
      {sections.map((section, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={section.title}
            className="border-t border-border/40 last:border-b"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="group flex w-full cursor-pointer items-center justify-between py-5 text-left transition-colors hover:text-foreground"
              aria-expanded={isOpen}
            >
              <span className="text-base font-medium text-foreground/90 group-hover:text-foreground md:text-lg">
                {section.title}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="grid size-6 place-items-center text-foreground/70 transition-colors group-hover:text-foreground"
              >
                <Plus size={18} strokeWidth={2} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.22 },
                  }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 pr-10 text-base font-light leading-relaxed text-foreground/70">
                    {section.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default ProductAccordion;
