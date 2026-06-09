import type { CountryShippingConfig, ShippingQuote } from "./types";
import { isSupportedShippingCountry } from "./supported-countries";

/**
 * Resolve a shipping fee for the given destination.
 *
 * Precedence:
 *   1. exact region override (case-insensitive, trimmed) wins
 *   2. country's defaultFeeNGN is the fallback
 *   3. nothing matches → { ok: false }
 *
 * Single source of truth for:
 *   - Sanity Studio shippingZones validation (optional, server-only)
 *   - Checkout UI live preview (OrderSummary)
 *   - The future order-create server action (server-side recompute — never
 *     trust client-supplied amounts; recompute from saved address)
 */
export const lookupShippingFee = (
  zones: ReadonlyArray<CountryShippingConfig> | null | undefined,
  country: string | null | undefined,
  region?: string | null,
): ShippingQuote => {
  if (!isSupportedShippingCountry(country)) {
    return { ok: false, reason: "unsupported-country" };
  }
  if (!zones || zones.length === 0) {
    return { ok: false, reason: "no-zone" };
  }

  const config = zones.find((z) => z.country === country);
  if (!config) {
    return { ok: false, reason: "no-zone" };
  }

  const norm = (region ?? "").trim().toLowerCase();
  if (norm && config.regionOverrides) {
    const exact = config.regionOverrides.find(
      (o) => o.region.trim().toLowerCase() === norm,
    );
    if (exact) {
      return { ok: true, feeNGN: exact.feeNGN, matchedRegion: exact.region };
    }
  }

  if (typeof config.defaultFeeNGN === "number") {
    return {
      ok: true,
      feeNGN: config.defaultFeeNGN,
      matchedRegion: null,
    };
  }

  return { ok: false, reason: "no-zone" };
};
