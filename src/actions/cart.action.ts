"use server";

import { request as arcjetRequest, slidingWindow } from "@arcjet/next";
import { aj } from "@/lib/arcjet";
import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCTS_BY_IDS_FOR_CART_QUERY } from "@/sanity/queries";
import type { CartLine } from "@/store/cart-store";
import type { ShopImage } from "@/lib/shop-types";

export type CartRevalidationInput = ReadonlyArray<{
  productId: string;
  variantKey: string | null;
  qty: number;
}>;

/** Per-line outcome of revalidation. The cart store replays these onto the
 *  persisted cart silently — no UI surface. */
export type CartLineDiff =
  | { key: string; status: "unchanged" | "updated" | "qty-clamped"; line: CartLine }
  | { key: string; status: "removed"; line: null };

export type CartRevalidationResult =
  | { ok: true; diffs: CartLineDiff[] }
  | { ok: false; reason: "rate-limited" | "errored" };

const cartRevalidateRateLimit = slidingWindow({
  mode: "LIVE",
  interval: "1m",
  max: 30,
});

const compositeKey = (productId: string, variantKey: string | null) =>
  `${productId}::${variantKey ?? ""}`;

/**
 * Normalize the image projected via `productImageFields`. Structurally the
 * same shape used in `src/sanity/queries/products.ts`, but the auto-generated
 * type is per-query, so we keep a tiny dedicated normalizer here rather than
 * widening the shared one.
 */
const normalizeImage = (raw: unknown): ShopImage | null => {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as {
    asset?: unknown;
    width?: number | null;
    height?: number | null;
    lqip?: string | null;
  };
  if (!obj.asset) return null;
  return {
    source: raw as ShopImage["source"],
    width: typeof obj.width === "number" ? obj.width : undefined,
    height: typeof obj.height === "number" ? obj.height : undefined,
    lqip: typeof obj.lqip === "string" ? obj.lqip : undefined,
  };
};

type FetchedProduct = {
  _id: string;
  status: string | null;
  slug: string | null;
  title: string | null;
  type: "physical" | "digital" | null;
  hasVariants: boolean | null;
  priceNGN: number | null;
  compareAtPriceNGN: number | null;
  stock: number | null;
  image: unknown;
  variants: Array<{
    _key: string;
    title: string | null;
    priceNGN: number | null;
    compareAtPriceNGN: number | null;
    stock: number | null;
  }> | null;
};

const removed = (key: string): CartLineDiff => ({
  key,
  status: "removed",
  line: null,
});

const reconcileLine = (
  input: { productId: string; variantKey: string | null; qty: number },
  previous: CartLine | undefined,
  product: FetchedProduct | undefined,
): CartLineDiff => {
  const key = compositeKey(input.productId, input.variantKey);

  if (!product) return removed(key);
  if (product.status !== "active") return removed(key);
  if (product.type !== "physical" && product.type !== "digital") {
    return removed(key);
  }
  if (previous && previous.type !== product.type) return removed(key);

  const image = normalizeImage(product.image) ?? previous?.image ?? null;
  const slug = product.slug ?? previous?.slug ?? "";
  const title = product.title ?? previous?.title ?? "Item";

  if (product.type === "digital") {
    if (product.hasVariants) return removed(key);
    if (typeof product.priceNGN !== "number") return removed(key);
    if (!image) return removed(key);

    const next: CartLine = {
      productId: input.productId,
      variantKey: null,
      slug,
      title,
      variantTitle: null,
      type: "digital",
      image,
      priceNGN: product.priceNGN,
      compareAtPriceNGN:
        typeof product.compareAtPriceNGN === "number"
          ? product.compareAtPriceNGN
          : undefined,
      qty: 1,
      stock: undefined,
    };

    const changed =
      !previous ||
      previous.priceNGN !== next.priceNGN ||
      previous.title !== next.title ||
      previous.slug !== next.slug ||
      previous.compareAtPriceNGN !== next.compareAtPriceNGN;
    return {
      key,
      status: changed ? "updated" : "unchanged",
      line: next,
    };
  }

  // Physical
  if (product.hasVariants) {
    if (!input.variantKey) return removed(key);
    const variant = (product.variants ?? []).find(
      (v) => v._key === input.variantKey,
    );
    if (!variant) return removed(key);
    if (typeof variant.priceNGN !== "number") return removed(key);

    const stock = typeof variant.stock === "number" ? variant.stock : undefined;
    if (typeof stock === "number" && stock <= 0) return removed(key);
    if (!image) return removed(key);

    let qty = Math.max(1, Math.floor(input.qty));
    let clamped = false;
    if (typeof stock === "number" && qty > stock) {
      qty = stock;
      clamped = true;
    }

    const next: CartLine = {
      productId: input.productId,
      variantKey: input.variantKey,
      slug,
      title,
      variantTitle: variant.title ?? previous?.variantTitle ?? null,
      type: "physical",
      image,
      priceNGN: variant.priceNGN,
      compareAtPriceNGN:
        typeof variant.compareAtPriceNGN === "number"
          ? variant.compareAtPriceNGN
          : undefined,
      qty,
      stock,
    };

    if (clamped) return { key, status: "qty-clamped", line: next };
    const changed =
      !previous ||
      previous.priceNGN !== next.priceNGN ||
      previous.title !== next.title ||
      previous.variantTitle !== next.variantTitle ||
      previous.slug !== next.slug ||
      previous.compareAtPriceNGN !== next.compareAtPriceNGN ||
      previous.stock !== next.stock;
    return {
      key,
      status: changed ? "updated" : "unchanged",
      line: next,
    };
  }

  // Physical, non-variant
  if (input.variantKey) return removed(key);
  if (typeof product.priceNGN !== "number") return removed(key);
  const stock = typeof product.stock === "number" ? product.stock : undefined;
  if (typeof stock === "number" && stock <= 0) return removed(key);
  if (!image) return removed(key);

  let qty = Math.max(1, Math.floor(input.qty));
  let clamped = false;
  if (typeof stock === "number" && qty > stock) {
    qty = stock;
    clamped = true;
  }

  const next: CartLine = {
    productId: input.productId,
    variantKey: null,
    slug,
    title,
    variantTitle: null,
    type: "physical",
    image,
    priceNGN: product.priceNGN,
    compareAtPriceNGN:
      typeof product.compareAtPriceNGN === "number"
        ? product.compareAtPriceNGN
        : undefined,
    qty,
    stock,
  };

  if (clamped) return { key, status: "qty-clamped", line: next };
  const changed =
    !previous ||
    previous.priceNGN !== next.priceNGN ||
    previous.title !== next.title ||
    previous.slug !== next.slug ||
    previous.compareAtPriceNGN !== next.compareAtPriceNGN ||
    previous.stock !== next.stock;
  return {
    key,
    status: changed ? "updated" : "unchanged",
    line: next,
  };
};

/**
 * Revalidate a cart against fresh product data from Sanity.
 *
 * Each input line is returned as a diff:
 *   - "unchanged": nothing material changed
 *   - "updated": product fields refreshed (title / price / etc.)
 *   - "qty-clamped": qty was reduced to fit current stock
 *   - "removed": product / variant gone, out of stock, inactive, or otherwise
 *                no longer fulfillable
 *
 * The client (cart store) replays these diffs onto the persisted cart
 * silently — no UI surface is shown to the customer.
 *
 * TODO(checkout-server-recalc): the future order-create server action MUST
 * call this same logic right before writing the order and refuse to proceed
 * if any line ends up "removed" or has a material price change the user
 * hasn't been shown — the client preview is not enough.
 */
export async function revalidateCart(
  input: CartRevalidationInput,
  // The cart store passes the current persisted lines so we can detect
  // price/title diffs and emit "updated" vs "unchanged" accurately. Optional.
  previousLines?: ReadonlyArray<CartLine>,
): Promise<CartRevalidationResult> {
  if (input.length === 0) return { ok: true, diffs: [] };

  try {
    const req = await arcjetRequest();
    const decision = await aj
      .withRule(cartRevalidateRateLimit)
      .protect(req);
    if (decision.isDenied()) {
      return { ok: false, reason: "rate-limited" };
    }
  } catch (error) {
    console.warn("Arcjet check failed for revalidateCart", error);
    // Don't block on Arcjet errors — keep revalidating.
  }

  const ids = Array.from(new Set(input.map((l) => l.productId)));
  let products: FetchedProduct[] = [];
  try {
    const { data } = await sanityFetch({
      query: PRODUCTS_BY_IDS_FOR_CART_QUERY,
      params: { ids },
    });
    products = (data ?? []) as unknown as FetchedProduct[];
  } catch (error) {
    console.error("revalidateCart fetch failed", error);
    return { ok: false, reason: "errored" };
  }

  const byId = new Map(products.map((p) => [p._id, p]));
  const prevByKey = new Map(
    (previousLines ?? []).map((l) => [
      compositeKey(l.productId, l.variantKey),
      l,
    ]),
  );

  const diffs: CartLineDiff[] = input.map((line) =>
    reconcileLine(
      line,
      prevByKey.get(compositeKey(line.productId, line.variantKey)),
      byId.get(line.productId),
    ),
  );

  return { ok: true, diffs };
}
