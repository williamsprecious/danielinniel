import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { verifyWebhookSignature } from "@/lib/paystack";

// Node runtime — we need the raw body + node:crypto for signature verification.
export const runtime = "nodejs";

type PaystackWebhookEvent = {
  event: string;
  data?: { reference?: string };
};

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: PaystackWebhookEvent;
  try {
    payload = JSON.parse(raw) as PaystackWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (payload.event === "charge.success" && payload.data?.reference) {
    const reference = payload.data.reference;
    await inngest.send({
      // 24h event-level dedup — Paystack may deliver the same event more than once.
      id: `paystack-${reference}`,
      name: "order/payment.succeeded",
      data: { reference },
    });
  }

  // Always acknowledge quickly; anything we don't handle is simply ignored.
  return NextResponse.json({ received: true });
}
