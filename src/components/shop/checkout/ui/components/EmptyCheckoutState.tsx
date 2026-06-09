"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";

const REDIRECT_DELAY_MS = 2000;
const REDIRECT_TO = "/shop";

const EmptyCheckoutState = () => {
  const router = useRouter();

  useEffect(() => {
    const id = window.setTimeout(() => {
      router.push(REDIRECT_TO);
    }, REDIRECT_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [router]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 rounded-2xl border border-border/30 bg-foreground/[0.03] px-8 py-14 text-center">
      <div className="grid size-16 place-items-center rounded-full border border-border/40 text-foreground/70">
        <ShoppingBag size={22} />
      </div>
      <div className="space-y-1.5">
        <p className="font-heading text-2xl tracking-wider">
          Your cart is empty
        </p>
        <p className="text-sm text-foreground/60">
          Drop a few pieces into your bag to start checkout.
        </p>
      </div>
      <Link
        href={REDIRECT_TO}
        className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
      >
        Continue shopping →
      </Link>
    </div>
  );
};

export default EmptyCheckoutState;
