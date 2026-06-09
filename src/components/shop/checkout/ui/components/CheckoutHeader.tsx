"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { StickyBanner } from "@/components/ui/sticky-banner";

const TITLES: Record<string, string> = {
  "/checkout": "CHECKOUT",
  "/order": "ORDER",
};

const HIDE_BACK_ON = new Set(["/order"]);

const CheckoutHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "CHECKOUT";
  const showBack = !HIDE_BACK_ON.has(pathname);

  return (
    <>
      {pathname === "/checkout" && (
        <StickyBanner
          storageKey="checkout-ngn-notice"
          className="bg-primary text-foreground text-sm"
        >
          <span className="text-center">
            Payment settles in <span className="font-semibold">NGN</span>,
            regardless of the currency selected.
          </span>
        </StickyBanner>
      )}
      <header className="bg-background flex items-center border-b border-border/30 px-6 py-5 lg:px-8">
        {showBack ? (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="grid size-9 cursor-pointer place-items-center rounded-full border border-border/40 text-foreground/80 transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} strokeWidth={2} />
          </button>
        ) : (
          <div className="size-9" aria-hidden />
        )}
        <h1 className="flex-1 text-center font-heading text-3xl md:text-4xl tracking-wider">
          {title}
        </h1>
        <div className="size-9" aria-hidden />
      </header>
    </>
  );
};

export default CheckoutHeader;
