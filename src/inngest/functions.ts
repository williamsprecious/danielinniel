import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { backendClient } from "@/sanity/lib/backendClient";
import {
  verifyTransaction,
  type PaystackOrderLine,
  type PaystackOrderMetadata,
} from "@/lib/paystack";
import {
  sendAdminOrderEmail,
  sendDigitalDeliveryEmail,
  sendOrderConfirmationEmail,
} from "@/lib/email";
import type { EmailAddress, EmailOrder } from "@/emails/types";

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

const orderDocId = (reference: string) =>
  `order.${reference.replace(/[^a-zA-Z0-9._-]/g, "-")}`;

// Paystack returns metadata scalars as strings, and can serialize JSON null as
// the literal "null" — treat empty / "null" as absent.
const cleanStr = (v: string | null | undefined): string | undefined =>
  v && v !== "null" ? v : undefined;

const toNum = (v: unknown): number => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
};

const toBool = (v: unknown): boolean => v === true || v === "true";

const buildAddress = (address: PaystackOrderMetadata["address"]) => {
  const line2 = cleanStr(address.line2);
  const state = cleanStr(address.state);
  const postalCode = cleanStr(address.postalCode);
  return {
    _type: "address" as const,
    firstName: address.firstName,
    lastName: address.lastName,
    line1: address.line1,
    ...(line2 ? { line2 } : {}),
    city: address.city,
    ...(state ? { state } : {}),
    ...(postalCode ? { postalCode } : {}),
    country: address.countryName,
    phone: address.phone,
  };
};

/**
 * Coerce the metadata Paystack echoes back into real types. Paystack stringifies
 * scalar metadata values (numbers come back as "6", booleans as "true"), so we
 * normalize before the values reach Sanity — `dec` in particular rejects strings.
 */
const normalizeMetadata = (
  raw: PaystackOrderMetadata,
): PaystackOrderMetadata => ({
  ...raw,
  isDigitalOnly: toBool(raw.isDigitalOnly),
  subtotalNGN: toNum(raw.subtotalNGN),
  shippingFeeNGN: toNum(raw.shippingFeeNGN),
  totalNGN: toNum(raw.totalNGN),
  lines: (raw.lines ?? []).map((l) => ({
    ...l,
    unitPriceNGN: toNum(l.unitPriceNGN),
    qty: toNum(l.qty),
    variantKey: cleanStr(l.variantKey) ?? null,
    variantTitle: cleanStr(l.variantTitle) ?? null,
    imageAssetRef: cleanStr(l.imageAssetRef) ?? null,
  })),
});

const buildOrderItem = (line: PaystackOrderLine, index: number) => ({
  _key: `line-${index}`,
  _type: "orderItem" as const,
  ...(line.productId
    ? { product: { _type: "reference" as const, _ref: line.productId } }
    : {}),
  ...(line.variantKey ? { variantKey: line.variantKey } : {}),
  title: line.title,
  ...(line.variantTitle ? { variantTitle: line.variantTitle } : {}),
  type: line.type,
  ...(line.imageAssetRef
    ? {
        image: {
          _type: "image" as const,
          asset: { _type: "reference" as const, _ref: line.imageAssetRef },
        },
      }
    : {}),
  unitPrice: line.unitPriceNGN,
  quantity: line.qty,
  lineTotal: line.unitPriceNGN * line.qty,
});

const buildEmailAddress = (
  address: PaystackOrderMetadata["address"],
): EmailAddress => ({
  firstName: address.firstName,
  lastName: address.lastName,
  line1: address.line1,
  line2: cleanStr(address.line2) ?? null,
  city: address.city,
  state: cleanStr(address.state) ?? null,
  postalCode: cleanStr(address.postalCode) ?? null,
  country: address.countryName,
  phone: address.phone,
});

/** Map the verified Paystack metadata into the shape the email templates accept. */
const buildEmailOrder = (
  metadata: PaystackOrderMetadata,
  reference: string,
  paidAt: string | null,
): EmailOrder => ({
  orderNumber: metadata.orderNumber,
  customer: { ...metadata.customer },
  items: metadata.lines.map((line) => ({
    title: line.title,
    variantTitle: line.variantTitle,
    type: line.type,
    qty: line.qty,
    unitPriceNGN: line.unitPriceNGN,
    lineTotalNGN: line.unitPriceNGN * line.qty,
    imageAssetRef: line.imageAssetRef,
  })),
  subtotalNGN: metadata.subtotalNGN,
  shippingFeeNGN: metadata.shippingFeeNGN,
  totalNGN: metadata.totalNGN,
  isDigitalOnly: metadata.isDigitalOnly,
  shippingAddress: metadata.isDigitalOnly
    ? null
    : buildEmailAddress(metadata.address),
  reference,
  paidAt,
  displayCurrency: metadata.displayCurrency,
});

/**
 * Processes a successful Paystack payment into a real order. Triggered by the
 * webhook via the `order/payment.succeeded` event.
 *
 * - `idempotency` on the reference + a deterministic order `_id` +
 *   `createIfNotExists` guarantee the order is created exactly once even if
 *   Paystack re-delivers `charge.success`.
 * - We re-verify with Paystack (defense in depth) and treat its response as
 *   the source of truth for payment status/amount.
 */
export const processPaidOrder = inngest.createFunction(
  {
    id: "process-paid-order",
    name: "Process paid order",
    triggers: [{ event: "order/payment.succeeded" }],
    idempotency: "event.data.reference",
  },
  async ({ event, step, logger }) => {
    const reference = event.data.reference as string;
    if (!reference) {
      throw new NonRetriableError("Missing payment reference");
    }
    const docId = orderDocId(reference);

    // 1. Verify with Paystack — authoritative source of truth.
    const verified = await step.run("verify-payment", async () => {
      const tx = await verifyTransaction(reference);
      if (tx.status !== "success") {
        throw new NonRetriableError(
          `Transaction ${reference} is not successful (status: ${tx.status})`,
        );
      }
      if (!tx.metadata) {
        throw new NonRetriableError(
          `Transaction ${reference} has no order metadata`,
        );
      }
      return tx;
    });

    const metadata = normalizeMetadata(
      verified.metadata as PaystackOrderMetadata,
    );

    // 2. Short-circuit if the order already exists (re-delivery / replay).
    const existing = await step.run("check-existing", () =>
      backendClient.fetch<string | null>(`*[_id == $id][0]._id`, {
        id: docId,
      }),
    );
    if (existing) {
      logger.info("Order already exists, skipping", { reference, docId });
      return { reference, created: false };
    }

    // Deterministic figures shared by the order document and the emails below.
    const amountChargedNGN = verified.amountKobo / 100;
    const amountMismatch = amountChargedNGN !== metadata.totalNGN;
    const adminNotes = [
      `Display currency at checkout: ${metadata.displayCurrency}.`,
      amountMismatch
        ? `⚠️ Charged NGN ${amountChargedNGN} differs from computed total NGN ${metadata.totalNGN}.`
        : null,
    ]
      .filter(Boolean)
      .join(" ");

    // 3. Create the order document. All amounts are NGN (settlement currency).
    await step.run("create-order", async () => {
      const address = buildAddress(metadata.address);

      await backendClient.createIfNotExists({
        _id: docId,
        _type: "order",
        orderNumber: metadata.orderNumber,
        status: "confirmed",
        customer: {
          firstName: metadata.customer.firstName,
          lastName: metadata.customer.lastName,
          email: metadata.customer.email,
          phone: metadata.customer.phone,
        },
        shippingAddress: metadata.isDigitalOnly ? undefined : address,
        billingAddress: address,
        items: metadata.lines.map(buildOrderItem),
        subtotal: metadata.subtotalNGN,
        shippingFee: metadata.shippingFeeNGN,
        total: metadata.totalNGN,
        currency: "NGN",
        rateToNaira: 1,
        payment: {
          provider: "paystack",
          reference,
          amountNGN: amountChargedNGN,
          paidAt: verified.paidAt ?? new Date().toISOString(),
          gatewayResponse: verified.gatewayResponse ?? undefined,
        },
        adminNotes,
        createdAt: new Date().toISOString(),
      });
    });

    // 4. Decrement inventory for physical lines (atomic transaction so retries are safe). Digital lines have no stock to track.
    await step.run("decrement-inventory", async () => {
      const physicalLines = metadata.lines.filter((l) => l.type === "physical");
      if (physicalLines.length === 0) return { decremented: 0 };

      let tx = backendClient.transaction();
      for (const line of physicalLines) {
        if (!line.productId) continue;
        const path = line.variantKey
          ? `variants[_key=="${line.variantKey}"].stock`
          : "stock";
        tx = tx.patch(line.productId, (p) => p.dec({ [path]: line.qty }));
      }
      await tx.commit();
      return { decremented: physicalLines.length };
    });

    const emailOrder = buildEmailOrder(metadata, reference, verified.paidAt);

    // 5. Resolve download links for any digital lines (public Sanity CDN URLs).
    const downloads = await step.run("load-digital-files", async () => {
      const digitalLines = metadata.lines.filter((l) => l.type === "digital");
      if (digitalLines.length === 0) return [];

      const ids = Array.from(
        new Set(digitalLines.map((l) => l.productId).filter(Boolean)),
      );
      const files = await backendClient.fetch<
        Array<{ _id: string; url: string | null }>
      >(`*[_type == "product" && _id in $ids]{ _id, "url": digitalFile.asset->url }`, {
        ids,
      });
      const urlById = new Map(files.map((f) => [f._id, f.url]));

      return digitalLines.map((l) => ({
        title: l.title,
        url: urlById.get(l.productId) ?? null,
      }));
    });

    const validDownloads = downloads.filter(
      (d): d is { title: string; url: string } => Boolean(d.url),
    );
    if (validDownloads.length < downloads.length) {
      logger.warn("Some digital lines have no downloadable file", {
        reference,
        missing: downloads.length - validDownloads.length,
      });
    }

    // 6. Customer confirmation. Digital-only orders include downloads inline.
    await step.run("send-customer-email", () =>
      sendOrderConfirmationEmail({
        order: emailOrder,
        downloads: metadata.isDigitalOnly ? validDownloads : undefined,
      }),
    );

    // 7. Mixed carts (physical + digital): deliver files in a separate email.
    if (!metadata.isDigitalOnly && validDownloads.length > 0) {
      await step.run("send-digital-delivery", () =>
        sendDigitalDeliveryEmail({
          order: emailOrder,
          downloads: validDownloads,
        }),
      );
    }

    // 8. Internal order notification to the store inbox.
    await step.run("send-admin-email", () =>
      sendAdminOrderEmail({ order: emailOrder }),
    );

    logger.info("Order created", {
      reference,
      docId,
      orderNumber: metadata.orderNumber,
    });
    return { reference, created: true, orderNumber: metadata.orderNumber };
  },
);
