"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Instagram } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { IoLogoYoutube } from "react-icons/io5";
import { FaTiktok } from "react-icons/fa";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import Logo from "../../public/logo.webp";
import { Button, buttonVariants } from "./ui/button";
import { SocialLink } from "./SocialLink";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";
import CartButton from "@/components/shop/cart/ui/components/CartButton";
import { useNewBooking } from "@/hooks/use-new-booking";
import ScrollingText from "@/components/ScrollingText";

const Header = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isVisible, setIsVisible] = useState(!isHomePage); // Hide on home page initially
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { toggleOpen, setCategory, setStep, step } = useNewBooking();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();

    // Check if we've scrolled past the About section (into Services)
    let hasReachedServices = false;
    const aboutElement = document.getElementById("about-section");
    if (aboutElement) {
      const rect = aboutElement.getBoundingClientRect();
      hasReachedServices = rect.bottom <= 100;
    }

    if (previous !== undefined) {
      if (isHomePage) {
        // On home page: only show header after scrolling past About into Services
        if (hasReachedServices) {
          // Once in Services, use normal scroll behavior
          if (latest < previous || latest < 100) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
            setIsMenuOpen(false);
          }
        } else {
          // Before Services section, hide header
          setIsVisible(false);
          setIsMenuOpen(false);
        }
      } else {
        // On other pages: original behavior
        if (latest < previous || latest < 100) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
          setIsMenuOpen(false);
        }
      }
    }
  });

  // Reset header visibility + close menu when route changes.
  // React docs pattern for "adjust state when a prop changes" — runs during
  // render via a prev-value comparison, not in an effect.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevIsHomePage, setPrevIsHomePage] = useState(isHomePage);
  if (isHomePage !== prevIsHomePage) {
    setPrevIsHomePage(isHomePage);
    setIsVisible(!isHomePage);
    setIsMenuOpen(false);
  }

  // ? Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node) &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: isHomePage ? -100 : 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.3,
        }}
        className={cn(
          "fixed top-2 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-16px)] max-w-[1900px] px-3 h-16 border border-solid border-border/50 backdrop-blur-sm bg-background/80 rounded-[8px] grid grid-cols-[minmax(200px,300px)_max-content] gap-4 justify-between items-center transition-colors duration-1000 ease-in-out sm:grid-cols-[minmax(300px,350px)_max-content] md:top-2.5 md:px-4 md:w-[calc(100%-48px)] min-[900px]:md:grid-cols-[min-content_1fr_140px] lg:md:grid-cols-[230px_1fr_230px] lg:px-5 xl:h-18 2xl:h-[84px] 2xl:top-3 2xl:w-[calc(100%-112px)] 2xl:grid-cols-[300px_1fr_300px] 2xl:px-8",
        )}
      >
        <nav className="hidden min-[900px]:block">
          <ul className="flex items-center gap-1 md:gap-4 lg:gap-5">
            <li>
              <Button
                variant="outline"
                size="sm"
                className="px-2 2xl:px-2"
                onClick={() => {
                  if (step === 3) setStep(2);
                  setCategory("concept-and-design");
                  toggleOpen(true);
                }}
                aria-label="Start Project"
              >
                <ScrollingText
                  text="Start Project"
                  widthClass="w-[52px] 2xl:w-[70px]"
                  duration={5}
                />
              </Button>
            </li>
            <li className="max-[900px]:hidden">
              <Link
                href="/works"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "2xl:text-base",
                })}
              >
                Works
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "2xl:text-base",
                })}
              >
                About
              </Link>
            </li>
          </ul>
        </nav>

        <div className="grid items-center justify-center md:-mb-1.5">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <Image
              src={Logo}
              className="md:w-[450px] 2xl:w-[480px]"
              alt="Danielinniel logo"
            />
          </Link>
        </div>

        <div className="hidden min-[900px]:flex items-center justify-end gap-4 lg:gap-6 2xl:gap-8">
          <SocialLink
            href="https://www.instagram.com/danielinniel"
            icon={Instagram}
            className="size-4"
          />
          <SocialLink href="https://x.com/danielinniel" icon={FaXTwitter} />
          <SocialLink
            href="https://www.tiktok.com/@innielsden"
            icon={FaTiktok}
            className="size-4"
          />
          <SocialLink
            href="https://www.youtube.com/@danielinniel"
            icon={IoLogoYoutube}
            className="size-4"
          />
          <CartButton />
        </div>

        <div className="flex items-center gap-1.5 min-[900px]:hidden">
          <CartButton />
          <button
            className="cursor-pointer"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <Image src="/cancel.svg" width={30} height={30} alt="Hamburger" />
            ) : (
              <Image src="/menu.svg" width={32} height={32} alt="Hamburger" />
            )}
          </button>
        </div>
      </motion.header>

      {/* Backdrop overlay to prevent clicks outside header and menu when mobile nav is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        ref={mobileMenuRef}
      />
    </>
  );
};

export default Header;
