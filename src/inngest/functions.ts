import { inngest } from "./client";
import { backendClient } from "@/sanity/lib/backendClient";

const CURRENCYAPI_BASE =
  "https://api.currencyapi.com/v3/latest?base_currency=NGN";

type CurrencyApiResponse = {
  data: Record<string, { code: string; value: number }>;
};

export const refreshCurrencyRates = inngest.createFunction(
  {
    id: "refresh-currency-rates",
    name: "Refresh currency rates to NGN",
    triggers: [{ cron: "0 0 */2 * *" }],
  },
  async ({ step, logger }) => {
    const apiKey = process.env.CURRENCYAPI_KEY;
    if (!apiKey) {
      throw new Error("CURRENCYAPI_KEY is not set");
    }

    const codes = await step.run("load-configured-currencies", async () => {
      const settings = await backendClient.fetch<{
        ratesToNGN?: unknown;
      } | null>(`*[_id == "storeSettings"][0]{ ratesToNGN }`);
      const raw = settings?.ratesToNGN;
      if (!Array.isArray(raw)) return [];
      const list = raw
        .map((r) => (r as { code?: unknown })?.code)
        .filter((c): c is string => typeof c === "string" && c.length > 0);
      return Array.from(new Set(list));
    });

    if (codes.length === 0) {
      logger.info(
        "No currencies configured in storeSettings.ratesToNGN — skipping refresh",
      );
      return { skipped: true, reason: "no-currencies-configured" };
    }

    const rates = await step.run("fetch-rates", async () => {
      const url = `${CURRENCYAPI_BASE}&currencies=${codes.join(",")}`;
      const res = await fetch(url, { headers: { apikey: apiKey } });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(
          `CurrencyAPI request failed: ${res.status} ${res.statusText} ${body}`,
        );
      }

      const json = (await res.json()) as CurrencyApiResponse;
      return codes.map((code) => {
        const entry = json.data?.[code];
        if (!entry || typeof entry.value !== "number" || entry.value <= 0) {
          throw new Error(`Missing or invalid rate for ${code}`);
        }
        // API returns "foreign per 1 NGN" — invert to "NGN per 1 foreign"
        return {
          _key: `currency-${code.toLowerCase()}`,
          _type: "currencyRate",
          code,
          rate: 1 / entry.value,
        };
      });
    });

    const ratesUpdatedAt = await step.run("update-sanity", async () => {
      const now = new Date().toISOString();
      await backendClient
        .patch("storeSettings")
        .set({ ratesToNGN: rates, ratesUpdatedAt: now })
        .commit();
      return now;
    });

    return { rates, ratesUpdatedAt };
  },
);
