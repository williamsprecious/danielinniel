export type ShippingCountryCode = "NG" | "US" | "CA" | "GB";

export type RegionOverride = {
  region: string;
  feeNGN: number;
};

export type CountryShippingConfig = {
  country: ShippingCountryCode;
  defaultFeeNGN: number;
  regionOverrides?: RegionOverride[];
};

export type ShippingQuote =
  | { ok: true; feeNGN: number; matchedRegion: string | null }
  | { ok: false; reason: "unsupported-country" | "no-zone" };
