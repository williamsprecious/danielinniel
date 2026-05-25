import type { PortableTextBlock } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";

export type ShopImage = {
  /** Sanity image source — pass to `urlFor(source).url()`. */
  source: SanityImageSource;
  width?: number;
  height?: number;
  lqip?: string;
};

export type ShopCategory = {
  _id: string;
  title: string;
  slug: string;
};

export type ProductOption = {
  name: string;
  values: string[];
};

export type ProductVariant = {
  key: string;
  title: string;
  optionValues: string[];
  priceNGN: number;
  compareAtPriceNGN?: number;
  stock: number;
};

export type ProductListItem = {
  _id: string;
  slug: string;
  title: string;
  type: "physical" | "digital";
  image: ShopImage;
  priceNGN: number;
  compareAtPriceNGN?: number;
};

export type ProductDetail = {
  _id: string;
  slug: string;
  title: string;
  type: "physical" | "digital";
  shortDescription?: string;
  description?: PortableTextBlock[];
  images: ShopImage[];
  hasVariants: boolean;
  priceNGN: number;
  compareAtPriceNGN?: number;
  stock?: number;
  options: ProductOption[];
  variants: ProductVariant[];
  specifications: { label: string; value: string }[];
  shipping?: string;
};

export type ProductListResult = {
  items: ProductListItem[];
  totalCount: number;
  hasMore: boolean;
};
