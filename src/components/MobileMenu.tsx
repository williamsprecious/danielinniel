"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Instagram } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoYoutube } from "react-icons/io5";
import { FaTiktok } from "react-icons/fa";
import { Button, buttonVariants } from "@/components/ui/button";
import { SocialLink } from "./SocialLink";
import { useNewBooking } from "@/hooks/use-new-booking";
import ScrollingText from "@/components/ScrollingText";
import { cn } from "@/lib/utils";

const MobileMenu = forwardRef<HTMLDivElement, MobileMenuProps>(
  ({ isOpen, onClose }, ref) => {
    const { toggleOpen, setCategory, setStep, step } = useNewBooking();

    const navItems = [
      { href: "/", label: "Home" },
      { href: "/works", label: "Works" },
      { href: "/about", label: "About" },
      { href: "/shop", label: "Shop" },
    ];

    // Prevent menu from closing when clicking inside the menu content
    const handleMenuClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "max-[360px]:py-6 min-[900px]:hidden fixed top-[78px] left-2 right-2 border border-border/50 backdrop-blur-sm rounded-[8px] py-11 px-4 shadow-lg z-40 md:mx-4",
              "bg-background/85",
            )}
            onClick={handleMenuClick}
          >
            <nav>
              <ul className="flex flex-col items-center max-[360px]:gap-4 gap-5">
                {navItems.map((item) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -200 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 18,
                      mass: 0.9,
                    }}
                  >
                    <Link
                      href={item.href}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "mobile-menu",
                        className: "opacity-95",
                      })}
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}

                <motion.li
                  initial={{ opacity: 0, x: -200 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 18,
                    mass: 0.9,
                  }}
                  whileHover={{
                    scale: 1.1,
                    transition: { type: "spring", stiffness: 400, damping: 15 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="mobile-menu"
                    onClick={() => {
                      onClose();

                      if (step === 3) setStep(2); // if we're on the last step (for projects), go back to the second step
                      setCategory("concept-and-design");
                      toggleOpen(true);
                    }}
                    className="px-2 py-2.5 text-base! sm:py-3 bg-primary hover:bg-primary"
                    aria-label="Start Project"
                  >
                    <ScrollingText
                      text="Start Project"
                      widthClass="w-[82px] sm:w-[88px]"
                      className="max-[360px]:text-sm! text-lg! font-medium"
                      duration={5}
                    />
                  </Button>
                </motion.li>

                <motion.li
                  className="mt-6 flex justify-end gap-6"
                  initial={{ opacity: 0, x: -200 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 18,
                    mass: 0.9,
                  }}
                >
                  <div onClick={onClose}>
                    <SocialLink
                      href="https://www.instagram.com/danielinniel"
                      icon={Instagram}
                      className="size-[18px]"
                    />
                  </div>
                  <div onClick={onClose}>
                    <SocialLink
                      href="https://x.com/danielinniel"
                      icon={FaXTwitter}
                      className="size-[18px]"
                    />
                  </div>
                  <div onClick={onClose}>
                    <SocialLink
                      href="https://www.tiktok.com/@innielsden"
                      icon={FaTiktok}
                      className="size-[18px]"
                    />
                  </div>
                  <div onClick={onClose}>
                    <SocialLink
                      href="https://www.youtube.com/@danielinniel"
                      icon={IoLogoYoutube}
                      className="size-[18px]"
                    />
                  </div>
                </motion.li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);

MobileMenu.displayName = "MobileMenu";

export default MobileMenu;
