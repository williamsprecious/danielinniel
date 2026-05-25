export type CurrencyCode =
  | "NGN"
  | "USD"
  | "EUR"
  | "GBP"
  | "CAD"
  | "AUD"
  | "ZAR"
  | "GHS"
  | "JPY";

export type CurrencyMeta = {
  label: string;
  symbol: string;
  locale: string;
};

export const CURRENCY_META: Record<CurrencyCode, CurrencyMeta> = {
  NGN: { label: "Naira", symbol: "₦", locale: "en-NG" },
  USD: { label: "US Dollar", symbol: "$", locale: "en-US" },
  EUR: { label: "Euro", symbol: "€", locale: "en-IE" },
  GBP: { label: "British Pound", symbol: "£", locale: "en-GB" },
  CAD: { label: "Canadian Dollar", symbol: "CA$", locale: "en-CA" },
  AUD: { label: "Australian Dollar", symbol: "A$", locale: "en-AU" },
  ZAR: { label: "South African Rand", symbol: "R", locale: "en-ZA" },
  GHS: { label: "Ghanaian Cedi", symbol: "GH₵", locale: "en-GH" },
  JPY: { label: "Japanese Yen", symbol: "¥", locale: "ja-JP" },
};

export type CurrencyRates = Partial<Record<CurrencyCode, number>>;

export const isCurrencyCode = (value: unknown): value is CurrencyCode =>
  typeof value === "string" && value in CURRENCY_META;
