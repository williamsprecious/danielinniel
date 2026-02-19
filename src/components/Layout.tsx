"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Footer from "@/components/Footer";
import BookingDialog from "@/components/BookingDialog";
import { cn } from "@/lib/utils";
import { SparklesCore } from "./ui/sparkles";
import { useIsMobile } from "@/hooks/use-mobile";

// Dynamically import Header with no SSR to prevent hydration issues
const Header = dynamic(() => import("@/components/Header"), {
  ssr: false,
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const removeFooter =
    pathname === "/cover-art/essential" ||
    pathname === "/cover-art/advanced" ||
    pathname === "/design/concept-art" ||
    pathname === "/design/logo" ||
    pathname == "/design/character-design" ||
    pathname === "/design/fashion-illustration";

  return (
    <>
      <div className="fixed inset-0 w-full h-screen -z-10">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.5}
          maxSize={1.2}
          speed={0.4}
          particleDensity={isMobile ? 4 : 2}
          className="w-full h-full"
          particleColor="rgba(255, 255, 255, 0.8)"
        />
      </div>
      <BookingDialog />

      {/* Just so the footer can be fixed to the bottom */}
      <div
        className={cn(
          "flex flex-col",
          removeFooter
            ? "min-h-screen"
            : "min-h-[calc(100vh-140px)] md:min-h-[calc(100vh-100px)]",
        )}
      >
        <Header />
        <main
          className={cn(
            "md:pt-0 mb-auto",
            pathname === "/" || pathname === "/about" ? "pt-0" : "pt-20",
          )}
        >
          {children}
        </main>
        {!removeFooter && <Footer />}
      </div>
    </>
  );
};

export default Layout;
