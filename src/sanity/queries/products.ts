import type { PortableTextBlock } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/live";
import {
  PRODUCT_LIST_QUERY,
  PRODUCT_LIST_COUNT_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  ACTIVE_CATEGORIES_QUERY,
  ACTIVE_PRODUCT_SLUGS_QUERY,
  CATEGORY_ID_BY_SLUG_QUERY,
} from "@/sanity/queries";
import type {
  PRODUCT_LIST_QUERY_RESULT,
  PRODUCT_BY_SLUG_QUERY_RESULT,
} from "../../../sanity.types";
import type {
  ProductListItem,
  ProductDetail,
  ProductListResult,
  ProductVariant,
  ShopCategory,
  ShopImage,
} from "@/lib/shop-types";

type RawListItem = PRODUCT_LIST_QUERY_RESULT[number];
type RawDetail = NonNullable<PRODUCT_BY_SLUG_QUERY_RESULT>;
type RawImage = NonNullable<RawListItem["image"]>;

const toShopImage = (raw: RawImage | null | undefined): ShopImage | null => {
  if (!raw || !raw.asset) return null;
  // The query spreads asset metadata into the image, but TypeGen models
  // the orphan-reference case (asset missing) as a variant without those
  // fields — hence the `in` narrowing below.
  const width =
    "width" in raw && typeof raw.width === "number" ? raw.width : undefined;
  const height =
    "height" in raw && typeof raw.height === "number" ? raw.height : undefined;
  const lqip =
    "lqip" in raw && typeof raw.lqip === "string" ? raw.lqip : undefined;
  return {
    source: raw,
    width,
    height,
    lqip,
  };
};

const computeListPrice = (
  raw: RawListItem,
): { priceNGN: number | null; compareAtPriceNGN: number | null } => {
  if (raw.type === "physical" && raw.hasVariants && raw.variants?.length) {
    const variantPrices = raw.variants
      .map((v) => v?.priceNGN)
      .filter((p): p is number => typeof p === "number");
    const variantCompares = raw.variants
      .map((v) => v?.compareAtPriceNGN)
      .filter((p): p is number => typeof p === "number");
    return {
      priceNGN: variantPrices.length ? Math.min(...variantPrices) : null,
      compareAtPriceNGN: variantCompares.length
        ? Math.min(...variantCompares)
        : null,
    };
  }
  return {
    priceNGN: typeof raw.priceNGN === "number" ? raw.priceNGN : null,
    compareAtPriceNGN:
      typeof raw.compareAtPriceNGN === "number" ? raw.compareAtPriceNGN : null,
  };
};

const normalizeListItem = (raw: RawListItem): ProductListItem | null => {
  const image = toShopImage(raw.image);
  const { priceNGN, compareAtPriceNGN } = computeListPrice(raw);
  if (!raw.slug || !raw.title || !raw.type || !image || priceNGN === null) {
    return null;
  }
  return {
    _id: raw._id,
    slug: raw.slug,
    title: raw.title,
    type: raw.type,
    image,
    priceNGN,
    compareAtPriceNGN: compareAtPriceNGN ?? undefined,
  };
};

const normalizeVariants = (raw: RawDetail["variants"]): ProductVariant[] => {
  if (!raw?.length) return [];
  return raw
    .map((v): ProductVariant | null => {
      if (
        !v.title ||
        !v.optionValues?.length ||
        typeof v.priceNGN !== "number"
      ) {
        return null;
      }
      return {
        key: v._key,
        title: v.title,
        optionValues: v.optionValues,
        priceNGN: v.priceNGN,
        compareAtPriceNGN:
          typeof v.compareAtPriceNGN === "number"
            ? v.compareAtPriceNGN
            : undefined,
        stock: typeof v.stock === "number" ? v.stock : 0,
      };
    })
    .filter((v): v is ProductVariant => v !== null);
};

const normalizeDetail = (raw: RawDetail): ProductDetail | null => {
  if (!raw.slug || !raw.title || !raw.type) return null;

  const images = (raw.images ?? [])
    .map((img) => toShopImage(img))
    .filter((i): i is ShopImage => i !== null);

  const isDigital = raw.type === "digital";
  const hasVariants = !isDigital && raw.hasVariants === true;

  const options = !isDigital
    ? (raw.options ?? [])
        .map((o) => ({
          name: o.name ?? "",
          values: o.values ?? [],
        }))
        .filter((o) => o.name && o.values.length > 0)
    : [];

  const variants = !isDigital ? normalizeVariants(raw.variants) : [];

  let priceNGN: number;
  let compareAtPriceNGN: number | undefined;
  if (hasVariants && variants.length) {
    const prices = variants.map((v) => v.priceNGN);
    priceNGN = Math.min(...prices);
    const compares = variants
      .map((v) => v.compareAtPriceNGN)
      .filter((c): c is number => typeof c === "number");
    compareAtPriceNGN = compares.length ? Math.min(...compares) : undefined;
  } else {
    if (typeof raw.priceNGN !== "number") return null;
    priceNGN = raw.priceNGN;
    compareAtPriceNGN =
      typeof raw.compareAtPriceNGN === "number"
        ? raw.compareAtPriceNGN
        : undefined;
  }

  const specifications = (raw.specifications ?? [])
    .map((s) => ({
      label: s.label ?? "",
      value: s.value ?? "",
    }))
    .filter((s) => s.label && s.value);

  return {
    _id: raw._id,
    slug: raw.slug,
    title: raw.title,
    type: raw.type,
    shortDescription: raw.shortDescription ?? undefined,
    description: (raw.description ?? undefined) as
      | PortableTextBlock[]
      | undefined,
    images,
    hasVariants,
    priceNGN,
    compareAtPriceNGN,
    stock: typeof raw.stock === "number" ? raw.stock : undefined,
    options,
    variants,
    specifications,
    shipping: raw.shipping ?? undefined,
  };
};

export async function getProducts(
  categorySlug: string | null,
  start = 0,
  limit = 12,
): Promise<ProductListResult> {
  try {
    let categoryId: string | null = null;
    if (categorySlug) {
      const { data } = await sanityFetch({
        query: CATEGORY_ID_BY_SLUG_QUERY,
        params: { slug: categorySlug },
      });
      if (!data) {
        return { items: [], totalCount: 0, hasMore: false };
      }
      categoryId = data;
    }

    const [{ data: items }, { data: totalCount }] = await Promise.all([
      sanityFetch({
        query: PRODUCT_LIST_QUERY,
        params: { categoryId, start, end: start + limit },
      }),
      sanityFetch({
        query: PRODUCT_LIST_COUNT_QUERY,
        params: { categoryId },
      }),
    ]);
    const normalized = (items ?? [])
      .map(normalizeListItem)
      .filter((p): p is ProductListItem => p !== null);
    const count = totalCount ?? 0;
    return {
      items: normalized,
      totalCount: count,
      hasMore: start + limit < count,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { items: [], totalCount: 0, hasMore: false };
  }
}

export async function getProductBySlug(
  slug: string,
  options: { stega?: boolean } = {},
): Promise<ProductDetail | null> {
  try {
    const { data } = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: { slug },
      // ...options,
    });
    if (!data) return null;
    return normalizeDetail(data);
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

export async function getActiveCategories(): Promise<ShopCategory[]> {
  try {
    const { data } = await sanityFetch({ query: ACTIVE_CATEGORIES_QUERY });
    return (data ?? [])
      .map((c) => ({
        _id: c._id,
        title: c.title ?? "",
        slug: c.slug ?? "",
      }))
      .filter((c) => c.title && c.slug);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getActiveProductSlugs(): Promise<string[]> {
  try {
    const { data } = await sanityFetch({
      query: ACTIVE_PRODUCT_SLUGS_QUERY,
      perspective: "published",
      stega: false,
    });
    return (data ?? [])
      .map((d) => d.slug)
      .filter((s): s is string => typeof s === "string" && s.length > 0);
  } catch (error) {
    console.error("Error fetching product slugs:", error);
    return [];
  }
}
