/**
 * Shared data shapes for the order-related emails, plus an NGN money formatter
 * that reuses the app's `formatPrice`. Named exports only.
 */
import { formatPrice } from "@/lib/format-price";
import type { CurrencyRates } from "@/lib/currencies";

const NO_RATES = {} as CurrencyRates;

/** Format an NGN amount the same way the storefront does (settlement currency). */
export const formatNGN = (amountNGN: number): string =>
  formatPrice(amountNGN, "NGN", NO_RATES);

export type EmailOrderItem = {
  title: string;
  variantTitle?: string | null;
  type: "physical" | "digital";
  qty: number;
  unitPriceNGN: number;
  lineTotalNGN: number;
  /** Sanity image asset ref (e.g. "image-…-png") for the thumbnail. */
  imageAssetRef?: string | null;
  /**
   * Direct absolute image URL — takes precedence over `imageAssetRef` when set.
   * Used for preview/test data that points at public assets rather than Sanity.
   */
  imageUrl?: string | null;
};

export type EmailAddress = {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
  phone: string;
};

export type EmailOrder = {
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: EmailOrderItem[];
  subtotalNGN: number;
  shippingFeeNGN: number;
  totalNGN: number;
  isDigitalOnly: boolean;
  shippingAddress?: EmailAddress | null;
  /** Admin-only extras (omitted from customer-facing emails). */
  reference?: string;
  paidAt?: string | null;
  displayCurrency?: string;
};

/** A single delivered digital file. */
export type DownloadItem = {
  title: string;
  url: string;
};
