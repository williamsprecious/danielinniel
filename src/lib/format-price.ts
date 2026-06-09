import {
  CURRENCY_META,
  type CurrencyCode,
  type CurrencyRates,
} from "./currencies";

const formatAmount = (amount: number, currency: CurrencyCode) =>
  new Intl.NumberFormat(CURRENCY_META[currency].locale, {
    style: "currency",
    currency,
    maximumFractionDigits:
      currency === "NGN" || currency === "JPY" ? 0 : 2,
  }).format(amount);

export const formatPrice = (
  priceNGN: number,
  currency: CurrencyCode,
  rates: CurrencyRates,
): string => {
  if (currency === "NGN") {
    return formatAmount(priceNGN, "NGN");
  }

  const rate = rates[currency];
  if (!rate || rate <= 0) {
    return formatAmount(priceNGN, "NGN");
  }

  return formatAmount(priceNGN / rate, currency);
};
