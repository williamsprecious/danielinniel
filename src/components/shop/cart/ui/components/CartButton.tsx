"use client";

import { BiShoppingBag } from "react-icons/bi";
import { useCartDrawer } from "@/components/shop/cart/hooks/use-cart-drawer";
import { useHydratedTotalQty } from "@/store/cart-store";
import { cn } from "@/lib/utils";

type CartButtonProps = {
  className?: string;
};

const CartButton = ({ className }: CartButtonProps) => {
  const open = useCartDrawer((s) => s.open);
  const totalQty = useHydratedTotalQty();
  const hasItems = totalQty > 0;

  return (
    <button
      type="button"
      onClick={open}
      aria-label={
        hasItems
          ? `Open cart, ${totalQty} ${totalQty === 1 ? "item" : "items"}`
          : "Open cart"
      }
      className={cn(
        "relative grid size-9 cursor-pointer place-items-center text-foreground/95 transition-colors hover:text-foreground",
        className,
      )}
    >
      <BiShoppingBag className="size-5.5 md:size-5" />
      {hasItems && (
        <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-medium leading-none tabular-nums text-primary-foreground">
          {totalQty > 99 ? "99+" : totalQty}
        </span>
      )}
    </button>
  );
};

export default CartButton;
