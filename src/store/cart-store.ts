"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ShopImage } from "@/lib/shop-types";

// Bump this whenever the CartLine schema changes (e.g., new required field, renamed key, semantic change). On next visit every customer's persisted.cart is silently replaced with an empty one — see `migrate` below.
export const CART_STORE_VERSION = 1;

export type CartLine = {
  productId: string;
  variantKey: string | null;
  slug: string;
  title: string;
  variantTitle: string | null;
  type: "physical" | "digital";
  image: ShopImage;
  priceNGN: number;
  compareAtPriceNGN?: number;
  qty: number;
  stock?: number;
};

type CartState = {
  lines: CartLine[];
  addLine: (line: Omit<CartLine, "qty">, qty?: number) => void;
  updateQty: (
    productId: string,
    variantKey: string | null,
    qty: number,
  ) => void;
  removeLine: (productId: string, variantKey: string | null) => void;
  clear: () => void;
};

const matchLine = (
  line: CartLine,
  productId: string,
  variantKey: string | null,
) => line.productId === productId && line.variantKey === variantKey;

const clampQty = (qty: number, stock?: number) => {
  const safe = Math.max(1, Math.floor(qty));
  return typeof stock === "number" && stock > 0 ? Math.min(safe, stock) : safe;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addLine: (incoming, qty = 1) =>
        set((state) => {
          const isDigital = incoming.type === "digital";
          const existing = state.lines.find((l) =>
            matchLine(l, incoming.productId, incoming.variantKey),
          );
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                matchLine(l, incoming.productId, incoming.variantKey)
                  ? {
                      ...l,
                      ...incoming,
                      qty: isDigital
                        ? 1
                        : clampQty(l.qty + qty, incoming.stock),
                    }
                  : l,
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                ...incoming,
                qty: isDigital ? 1 : clampQty(qty, incoming.stock),
              },
            ],
          };
        }),
      updateQty: (productId, variantKey, qty) =>
        set((state) => ({
          lines: state.lines
            .map((l) => {
              if (!matchLine(l, productId, variantKey)) return l;
              if (l.type === "digital") return { ...l, qty: qty <= 0 ? 0 : 1 };
              return { ...l, qty: clampQty(qty, l.stock) };
            })
            .filter((l) => l.qty > 0),
        })),
      removeLine: (productId, variantKey) =>
        set((state) => ({
          lines: state.lines.filter(
            (l) => !matchLine(l, productId, variantKey),
          ),
        })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "cart-store",
      version: CART_STORE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
      migrate: (persisted, version) => {
        if (version !== CART_STORE_VERSION) return { lines: [] };
        return persisted as { lines: CartLine[] };
      },
    },
  ),
);

// useSyncExternalStore bridge to the zustand persist hydration lifecycle.
// Stable module-level fns so React doesn't re-subscribe on every render.
const subscribeCartHydration = (cb: () => void) =>
  useCartStore.persist.onFinishHydration(cb);
const getCartHydratedSnapshot = () => useCartStore.persist.hasHydrated();
const getCartHydratedServerSnapshot = () => false;

// SSR-safe — returns false until localStorage hydrates, then true. Use this
// when you need to know whether the persisted cart is ready to read.
export const useCartHydrated = (): boolean =>
  useSyncExternalStore(
    subscribeCartHydration,
    getCartHydratedSnapshot,
    getCartHydratedServerSnapshot,
  );

// SSR-safe — returns [] until localStorage hydrates, then the persisted lines.
// Prevents the cart badge / summary from flashing wrong values during hydration.
export const useHydratedCart = (): CartLine[] => {
  const lines = useCartStore((s) => s.lines);
  const hydrated = useCartHydrated();
  return hydrated ? lines : [];
};

export const useHydratedTotalQty = (): number =>
  useHydratedCart().reduce((sum, l) => sum + l.qty, 0);

export const useHydratedSubtotalNGN = (): number =>
  useHydratedCart().reduce((sum, l) => sum + l.priceNGN * l.qty, 0);
