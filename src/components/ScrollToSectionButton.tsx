"use client";

import { Button } from "./ui/button";
import { ChevronsDown } from "lucide-react";

const ScrollToSectionButton = ({
  targetId,
  className,
}: ScrollToSectionButtonProps) => {
  const scrollToSection = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Button
      className={`hidden md:block absolute left-2/4 -translate-x-[50%] bottom-8 hover:bg-transparent hover:text-foreground animate-bounce ${
        className || ""
      }`}
      variant="ghost"
      onClick={scrollToSection}
    >
      <ChevronsDown className="size-7" />
    </Button>
  );
};

export default ScrollToSectionButton;
