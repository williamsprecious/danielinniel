"use server";

import crypto from "node:crypto";
import { request as arcjetRequest, slidingWindow } from "@arcjet/next";
import { aj } from "@/lib/arcjet";
import { checkoutSchema } from "@/schema";
import { revalidateCart } from "@/actions/cart.action";
import type { CartLine } from "@/store/cart-store";
import { getStoreSettings } from "@/sanity/queries";
import { lookupShippingFee } from "@/lib/shipping/zone-lookup";
import type { CountryShippingConfig } from "@/lib/shipping/types";
import { getSupportedShippingCountry } from "@/lib/shipping/supported-countries";
import {
  initializeTransaction,
  type PaystackOrderLine,
  type PaystackOrderMetadata,
} from "@/lib/paystack";
import type { CurrencyCode } from "@/lib/currencies";

export type InitializeCheckoutInput = {
  values: unknown;
  lines: CartLine[];
  displayCurrency: CurrencyCode;
};

export type InitializeCheckoutResult =
  | { ok: true; authorizationUrl: string }
  | {
      ok: false;
      reason:
        | "validation"
        | "empty"
        | "cart-changed"
        | "shipping"
        | "rate-limited"
        | "errored";
      message: string;
    };

const checkoutRateLimit = slidingWindow({
  mode: "LIVE",
  interval: "10m",
  max: 10,
});

const extractAssetRef = (source: unknown): string | null => {
  if (source && typeof source === "object") {
    const asset = (source as { asset?: { _ref?: string } }).asset;
    if (asset?._ref) return asset._ref;
  }
  return null;
};

/**
 * Step 1 of checkout: validate everything server-side, then hand off to
 * Paystack. No order document is created here — the order is only written
 * after payment succeeds (see the webhook + Inngest processor). All amounts
 * are NGN (the settlement currency); the display currency is recorded for
 * reference only.
 */
export async function initializeCheckout(
  input: InitializeCheckoutInput,
): Promise<InitializeCheckoutResult> {
  // Rate limit
  try {
    const req = await arcjetRequest();
    const decision = await aj.withRule(checkoutRateLimit).protect(req);
    if (decision.isDenied()) {
      return {
        ok: false,
        reason: "rate-limited",
        message:
          "Too many checkout attempts. Please wait a moment and try again.",
      };
    }
  } catch (error) {
    console.warn("Arcjet check failed for initializeCheckout", error);
    // Don't block checkout on an Arcjet error.
  }

  // Validate the form payload
  const parsed = checkoutSchema.safeParse(input.values);
  if (!parsed.success) {
    return {
      ok: false,
      reason: "validation",
      message: "Please check your details and try again.",
    };
  }
  const values = parsed.data;

  if (!input.lines || input.lines.length === 0) {
    return { ok: false, reason: "empty", message: "Your cart is empty." };
  }

  // The client already revalidates on mount; this guards against anything changing between then and now. We pass the client lines so we can detect material changes the customer hasn't been shown.
  const cartInput = input.lines.map((l) => ({
    productId: l.productId,
    variantKey: l.variantKey,
    qty: l.qty,
  }));

  const revalidation = await revalidateCart(cartInput, input.lines);
  if (!revalidation.ok) {
    if (revalidation.reason === "rate-limited") {
      return {
        ok: false,
        reason: "rate-limited",
        message: "Too many requests. Please wait a moment and try again.",
      };
    }
    return {
      ok: false,
      reason: "errored",
      message: "We couldn't verify your cart. Please try again.",
    };
  }

  const hasRemoved = revalidation.diffs.some((d) => d.status === "removed");
  const hasClamped = revalidation.diffs.some((d) => d.status === "qty-clamped");
  const hasUpdated = revalidation.diffs.some((d) => d.status === "updated");

  if (hasRemoved) {
    return {
      ok: false,
      reason: "cart-changed",
      message:
        "Some items are no longer available and were removed. Please review your cart.",
    };
  }
  if (hasClamped) {
    return {
      ok: false,
      reason: "cart-changed",
      message:
        "Stock changed for some items and quantities were adjusted. Please review your cart.",
    };
  }
  if (hasUpdated) {
    return {
      ok: false,
      reason: "cart-changed",
      message:
        "Prices in your cart have changed. Please review the updated total before paying.",
    };
  }

  // All lines unchanged — use the server-verified lines as the snapshot.
  const verifiedLines = revalidation.diffs.flatMap((d) =>
    d.line ? [d.line] : [],
  );

  const orderLines: PaystackOrderLine[] = verifiedLines.map((line) => ({
    productId: line.productId,
    variantKey: line.variantKey,
    title: line.title,
    variantTitle: line.variantTitle,
    type: line.type,
    imageAssetRef: extractAssetRef(line.image.source),
    unitPriceNGN: line.priceNGN,
    qty: line.qty,
  }));

  const subtotalNGN = orderLines.reduce(
    (sum, l) => sum + l.unitPriceNGN * l.qty,
    0,
  );

  // Server-authoritative shipping fee from a fresh storeSettings read — the
  // client preview is never trusted. Digital-only carts ship nothing, so the
  // fee is forced to 0 and we skip the zone lookup.
  const isDigitalOnly = orderLines.every((l) => l.type === "digital");
  let shippingFeeNGN = 0;
  if (!isDigitalOnly) {
    const settings = await getStoreSettings();
    const zones = (settings?.shippingZones ?? null) as
      | CountryShippingConfig[]
      | null;
    const quote = lookupShippingFee(zones, values.country, values.state);
    if (!quote.ok) {
      return {
        ok: false,
        reason: "shipping",
        message:
          "We can't ship to the selected destination. Please choose another address.",
      };
    }
    shippingFeeNGN = quote.feeNGN;
  }

  const totalNGN = subtotalNGN + shippingFeeNGN;
  if (totalNGN <= 0) {
    return {
      ok: false,
      reason: "errored",
      message: "This order total can't be processed. Please contact support.",
    };
  }

  const reference = `O-${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
  const orderNumber = `O-${crypto.randomBytes(6).toString("hex")}`;

  const countryName =
    getSupportedShippingCountry(values.country)?.name ?? values.country;

  const metadata: PaystackOrderMetadata = {
    orderNumber,
    isDigitalOnly,
    displayCurrency: input.displayCurrency,
    subtotalNGN,
    shippingFeeNGN,
    totalNGN,
    customer: {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
    },
    address: {
      firstName: values.firstName,
      lastName: values.lastName,
      line1: values.line1,
      line2: values.line2 ?? null,
      city: values.city,
      state: values.state ?? null,
      postalCode: values.postalCode ?? null,
      countryCode: values.country,
      countryName,
      phone: values.phone,
    },
    lines: orderLines,
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    console.error("NEXT_PUBLIC_APP_URL is not set");
    return {
      ok: false,
      reason: "errored",
      message: "Checkout is temporarily unavailable. Please try again later.",
    };
  }
  // Paystack appends its own `?reference=…&trxref=…` to the callback URL, so we must NOT add our own — a duplicated `reference` param would arrive as an array and break the lookup.
  const callbackUrl = `http://localhost:3000/order`;
  // const callbackUrl = `${appUrl}/order`;

  try {
    const { authorizationUrl } = await initializeTransaction({
      email: values.email,
      amountNGN: totalNGN,
      reference,
      metadata,
      callbackUrl,
    });
    return { ok: true, authorizationUrl };
  } catch (error) {
    console.error("Paystack initialize failed", error);
    return {
      ok: false,
      reason: "errored",
      message: "We couldn't start the payment. Please try again.",
    };
  }
}
