"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Footer from "@/components/Footer";
import BookingDialog from "@/components/BookingDialog";

// Dynamically import Header with no SSR to prevent hydration issues
const Header = dynamic(() => import("@/components/Header"), {
  ssr: false,
});

const Layout = ({ children }: { children: React.ReactNode }) => {
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
      <BookingDialog />

      {/* Just so the footer can be fixed to the bottom */}
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        {!removeFooter && <Footer />}
      </div>
    </>
  );
};

export default Layout;
