"use client";

import { useState } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useNewBooking } from "@/hooks/use-new-booking";

const StartProjectButton = ({ category, grade }: StartProjectButtonProps) => {
  const { toggleOpen, step, setStep, setCategory, setGrade } = useNewBooking();
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // ? Show button when scrolled past 150px, hide when at the very top
    if (latest > 150) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  });

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      }}
      className="fixed left-1/2 -translate-x-1/2 w-full bottom-0 border border-solid bg-background/85 backdrop-blur-sm rounded-t-full p-4 flex items-center justify-center sm:w-[340px] lg:w-[380px] min-[82rem]:w-[400px] 2xl:w-[480px] 2xl:p-5"
    >
      <Button
        size="xl"
        variant="secondary"
        onClick={() => {
          if (step === 3) {
            // if we're on the last step (for projects), go back to the first step
            setStep(2);
          } else if (step === 1) {
            // if we're on the first step (for gallery click, directs the user to the selected category, reason and "grade if selected"), go to the second step
            setStep(2);
          }

          setCategory(category);
          if (grade) setGrade(grade);
          toggleOpen(true);
        }}
      >
        Start a Project
      </Button>
    </motion.div>
  );
};

export default StartProjectButton;
