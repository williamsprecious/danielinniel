import type { Metadata } from "next";
import CheckoutView from "@/components/shop/checkout/ui/views/CheckoutView";
import { getStoreSettings } from "@/sanity/queries";
import { isSupportedShippingCountry } from "@/lib/shipping/supported-countries";
import type {
  CountryShippingConfig,
  RegionOverride,
} from "@/lib/shipping/types";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const settings = await getStoreSettings();
  const shippingZones: CountryShippingConfig[] = [];
  for (const z of settings?.shippingZones ?? []) {
    if (!isSupportedShippingCountry(z?.country)) continue;
    if (typeof z?.defaultFeeNGN !== "number") continue;
    const regionOverrides: RegionOverride[] = [];
    for (const o of z?.regionOverrides ?? []) {
      if (typeof o?.region !== "string") continue;
      if (typeof o?.feeNGN !== "number") continue;
      regionOverrides.push({ region: o.region, feeNGN: o.feeNGN });
    }
    shippingZones.push({
      country: z.country,
      defaultFeeNGN: z.defaultFeeNGN,
      regionOverrides:
        regionOverrides.length > 0 ? regionOverrides : undefined,
    });
  }
  return <CheckoutView shippingZones={shippingZones} />;
}
