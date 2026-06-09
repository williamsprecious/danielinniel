"use client";
import React, { SVGProps, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export const StickyBanner = ({
  className,
  children,
  storageKey,
}: {
  className?: string;
  children: React.ReactNode;
  /**
   * When set, the dismissed state is remembered in sessionStorage under this
   * key — the banner stays hidden across navigation and reloads within the
   * same tab, and shows again only in a new tab or after the tab is closed.
   * Read lazily on first render so there's no flash for already-dismissed users.
   */
  storageKey?: string;
}) => {
  const hydrated = useHydrated();
  const [dismissed, setDismissed] = useState(
    () =>
      typeof window !== "undefined" &&
      !!storageKey &&
      window.sessionStorage.getItem(storageKey) === "1",
  );

  const handleDismiss = () => {
    setDismissed(true);
    if (storageKey && typeof window !== "undefined") {
      window.sessionStorage.setItem(storageKey, "1");
    }
  };

  if (!hydrated) return null;

  return (
    <motion.div
      className="w-full overflow-hidden"
      initial={false}
      animate={{ height: dismissed ? 0 : "auto" }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <div
        className={cn(
          "relative flex min-h-14 w-full items-center justify-center bg-transparent px-6 py-1",
          className,
        )}
      >
        {children}

        <button
          type="button"
          aria-label="Dismiss banner"
          className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
          onClick={handleDismiss}
        >
          <CloseIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    </motion.div>
  );
};

const CloseIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </svg>
  );
};
