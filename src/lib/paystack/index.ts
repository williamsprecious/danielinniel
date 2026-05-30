import "server-only";
import crypto from "node:crypto";

const PAYSTACK_BASE = "https://api.paystack.co";

const secretKey = () => {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not set");
  return key;
};

/**
 * The order snapshot we attach to a Paystack transaction at initialization and
 * read back (verbatim) in the Inngest order processor. Prices are NGN — the
 * server-authoritative figures computed at init time, i.e. exactly what the
 * customer is charged. The order document is built solely from this snapshot.
 */
export type PaystackOrderLine = {
  productId: string;
  variantKey: string | null;
  title: string;
  variantTitle: string | null;
  type: "physical" | "digital";
  imageAssetRef: string | null;
  unitPriceNGN: number;
  qty: number;
};

export type PaystackOrderAddress = {
  firstName: string;
  lastName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  /** Supported shipping country code, e.g. "NG". */
  countryCode: string;
  /** Human-readable country name stored on the order, e.g. "Nigeria". */
  countryName: string;
  phone: string;
};

export type PaystackOrderMetadata = {
  orderNumber: string;
  isDigitalOnly: boolean;
  /** Currency the customer was viewing at checkout — display-only; settlement is NGN. */
  displayCurrency: string;
  subtotalNGN: number;
  shippingFeeNGN: number;
  totalNGN: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  address: PaystackOrderAddress;
  lines: PaystackOrderLine[];
};

type InitializeArgs = {
  email: string;
  amountNGN: number;
  reference: string;
  metadata: PaystackOrderMetadata;
  callbackUrl: string;
};

type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

/**
 * Initialize a Paystack transaction. Amount is converted to kobo (NGN
 * subunit). Returns the hosted-checkout URL the browser should redirect to.
 */
export async function initializeTransaction({
  email,
  amountNGN,
  reference,
  metadata,
  callbackUrl,
}: InitializeArgs): Promise<{ authorizationUrl: string; reference: string }> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amountNGN * 100),
      currency: "NGN",
      reference,
      callback_url: callbackUrl,
      metadata,
    }),
  });

  const json = (await res.json()) as PaystackInitializeResponse;
  if (!res.ok || !json.status || !json.data?.authorization_url) {
    throw new Error(
      `Paystack initialize failed: ${res.status} ${json.message ?? ""}`,
    );
  }

  return {
    authorizationUrl: json.data.authorization_url,
    reference: json.data.reference,
  };
}

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    status: string;
    amount: number;
    paid_at: string | null;
    gateway_response: string | null;
    reference: string;
    currency: string;
    metadata: PaystackOrderMetadata | null;
  };
};

export type VerifiedTransaction = {
  status: string;
  amountKobo: number;
  paidAt: string | null;
  gatewayResponse: string | null;
  reference: string;
  metadata: PaystackOrderMetadata | null;
};

/**
 * Verify a transaction with Paystack — the authoritative source of truth used
 * by the order processor before any order is written.
 */
export async function verifyTransaction(
  reference: string,
): Promise<VerifiedTransaction> {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${secretKey()}` },
    },
  );

  const json = (await res.json()) as PaystackVerifyResponse;
  if (!res.ok || !json.status || !json.data) {
    throw new Error(
      `Paystack verify failed: ${res.status} ${json.message ?? ""}`,
    );
  }

  const { data } = json;
  return {
    status: data.status,
    amountKobo: data.amount,
    paidAt: data.paid_at,
    gatewayResponse: data.gateway_response,
    reference: data.reference,
    metadata: data.metadata ?? null,
  };
}

/**
 * Verify a Paystack webhook signature. Paystack signs the raw request body
 * with HMAC-SHA512 keyed on the secret key and sends it in `x-paystack-signature`.
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha512", secretKey())
    .update(rawBody)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
