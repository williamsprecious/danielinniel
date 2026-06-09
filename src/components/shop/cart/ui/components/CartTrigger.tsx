"use client";

import { ShoppingBag } from "lucide-react";
import { useCartDrawer } from "@/components/shop/cart/hooks/use-cart-drawer";
import { cn } from "@/lib/utils";

type CartTriggerProps = {
  count?: number;
  className?: string;
  label?: string;
};

const CartTrigger = ({ count = 2, className, label }: CartTriggerProps) => {
  const open = useCartDrawer((s) => s.open);

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Open bag"
      className={cn(
        "group relative inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border/40 px-3 text-sm text-foreground/85 transition-colors hover:border-foreground/40 hover:text-foreground",
        className,
      )}
    >
      <ShoppingBag size={16} strokeWidth={2} />
      {label && <span className="hidden sm:inline">{label}</span>}
      {count > 0 && (
        <span
          aria-hidden
          className="grid h-5 min-w-5 place-items-center rounded-full bg-[#ff3d7f] px-1.5 text-[10px] font-semibold text-foreground"
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default CartTrigger;
