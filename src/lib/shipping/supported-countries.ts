import type { ShippingCountryCode } from "./types";

export const SUPPORTED_SHIPPING_COUNTRIES = [
  { code: "NG", name: "Nigeria", regionLabel: "State" as const },
  { code: "US", name: "United States", regionLabel: "State" as const },
  { code: "CA", name: "Canada", regionLabel: "Province" as const },
  { code: "GB", name: "United Kingdom", regionLabel: null },
] as const;

export type SupportedShippingCountry =
  (typeof SUPPORTED_SHIPPING_COUNTRIES)[number];

export const SUPPORTED_SHIPPING_COUNTRY_CODES = SUPPORTED_SHIPPING_COUNTRIES.map(
  (c) => c.code,
) as readonly ShippingCountryCode[];

export const isSupportedShippingCountry = (
  code: string | null | undefined,
): code is ShippingCountryCode =>
  !!code &&
  SUPPORTED_SHIPPING_COUNTRY_CODES.includes(code as ShippingCountryCode);

export const getSupportedShippingCountry = (code: string | null | undefined) =>
  SUPPORTED_SHIPPING_COUNTRIES.find((c) => c.code === code) ?? null;

export const getRegionLabel = (code: string | null | undefined) =>
  getSupportedShippingCountry(code)?.regionLabel ?? null;
