"use client";

import { Image } from "next-sanity/image";
import Link from "next/link";
import { ShoppingBag, X, Minus, Plus } from "lucide-react";
import { useCartDrawer } from "@/components/shop/cart/hooks/use-cart-drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  useCartStore,
  useHydratedCart,
  useHydratedSubtotalNGN,
} from "@/store/cart-store";
import { urlFor } from "@/sanity/lib/image";
import { formatPrice } from "@/lib/format-price";
import { useCurrencyStore, useHydratedCurrency } from "@/store/currency-store";

const CartDrawer = () => {
  const { isOpen, close } = useCartDrawer();
  const lines = useHydratedCart();
  const subtotalNGN = useHydratedSubtotalNGN();
  const updateQty = useCartStore((s) => s.updateQty);
  const removeLine = useCartStore((s) => s.removeLine);
  const currency = useHydratedCurrency();
  const rates = useCurrencyStore((s) => s.rates);

  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent
        side="right"
        className="bg-background/90 flex h-full w-full flex-col gap-0 p-0 sm:max-w-[440px]"
      >
        <SheetTitle className="sr-only">Your bag</SheetTitle>
        <SheetDescription className="sr-only">
          Review the items currently in your shopping bag.
        </SheetDescription>

        <SheetHeader className="flex flex-row items-center gap-4 border-b border-border/40 px-6 py-5 pr-14">
          <span className="grid size-9 place-items-center rounded-full border border-border/40">
            <ShoppingBag className="size-5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] uppercase tracking-[0.18em] text-foreground/50">
              Your Cart
            </span>
            <span className="font-bowlby text-lg">
              {itemCount} {itemCount === 1 ? "Item" : "Items"}
            </span>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="grid size-20 place-items-center rounded-full border border-border/40">
                <ShoppingBag className="size-5" />
              </div>
              <p className="text-foreground/70 max-w-[24ch]">
                Your Cart is empty. Drop a few pieces in to see them here.
              </p>
              <Link
                href="/shop"
                onClick={close}
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                Browse the shop →
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {lines.map((line) => {
                const lineTotalNGN = line.priceNGN * line.qty;
                const atMaxStock =
                  typeof line.stock === "number" && line.qty >= line.stock;
                return (
                  <li
                    key={`${line.productId}::${line.variantKey ?? ""}`}
                    className="flex gap-4 border-b border-border/30 pb-5 last:border-b-0 last:pb-0"
                  >
                    <Link
                      href={`/shop/${line.slug}`}
                      onClick={close}
                      className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-foreground/[0.04]"
                    >
                      <Image
                        src={urlFor(line.image.source).width(200).url()}
                        alt={line.title}
                        width={96}
                        height={96}
                        sizes="96px"
                        placeholder={line.image.lqip ? "blur" : "empty"}
                        blurDataURL={line.image.lqip}
                        className="absolute inset-0 size-full object-cover"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={`/shop/${line.slug}`}
                            onClick={close}
                            className="block truncate text-[15px] font-medium leading-snug hover:underline"
                          >
                            {line.title}
                          </Link>
                          {line.variantTitle && (
                            <p className="mt-1 text-xs text-foreground/55">
                              {line.variantTitle}
                            </p>
                          )}
                          {line.type === "digital" && (
                            <p className="mt-1 text-xs text-foreground/55">
                              Digital download
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            removeLine(line.productId, line.variantKey)
                          }
                          aria-label={`Remove ${line.title}`}
                          className="cursor-pointer text-foreground/40 transition-colors hover:text-foreground"
                        >
                          <X size={14} strokeWidth={2} />
                        </button>
                      </div>

                      <div className="flex items-end justify-between gap-3">
                        {line.type !== "digital" && (
                          <div className="inline-flex items-center rounded-full border border-border/40 px-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(
                                  line.productId,
                                  line.variantKey,
                                  line.qty - 1,
                                )
                              }
                              disabled={line.qty <= 1}
                              aria-label="Decrease"
                              className="grid size-7 cursor-pointer place-items-center text-foreground/70 transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Minus size={12} strokeWidth={2.5} />
                            </button>
                            <span className="min-w-5 text-center text-xs tabular-nums">
                              {line.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(
                                  line.productId,
                                  line.variantKey,
                                  line.qty + 1,
                                )
                              }
                              disabled={atMaxStock}
                              aria-label="Increase"
                              className="grid size-7 cursor-pointer place-items-center text-foreground/70 transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Plus size={12} strokeWidth={2.5} />
                            </button>
                          </div>
                        )}
                        <span className="text-sm tabular-nums ml-auto">
                          {formatPrice(lineTotalNGN, currency, rates)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <SheetFooter className="border-t border-border/40 px-6 py-5">
            <dl className="flex flex-col gap-1.5 text-sm text-foreground/70">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd className="text-foreground text-base tabular-nums">
                  {formatPrice(subtotalNGN, currency, rates)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Shipping</dt>
                <dd className="text-foreground/60">Calculated at checkout</dd>
              </div>
            </dl>
            <button
              type="button"
              className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground transition-transform"
            >
              <span className="text-base font-medium">Checkout</span>
              <span className="text-base opacity-80">·</span>
              <span className="text-base tabular-nums">
                {formatPrice(subtotalNGN, currency, rates)}
              </span>
            </button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
