import Link from "next/link";
import { CheckCircle2, MapPin, Package } from "lucide-react";

type OrderLine = {
  id: string;
  title: string;
  variant?: string;
  qty: number;
  priceUsd: number;
  type: "physical" | "digital";
};

const DUMMY_LINES: OrderLine[] = [
  {
    id: "1",
    title: "Fallout - Lucy",
    variant: "Size: S",
    qty: 1,
    priceUsd: 14,
    type: "physical",
  },
  {
    id: "2",
    title: "Fallout - Maximus",
    variant: "Size: M",
    qty: 2,
    priceUsd: 14,
    type: "physical",
  },
];

const SUBTOTAL_USD = DUMMY_LINES.reduce(
  (sum, l) => sum + l.priceUsd * l.qty,
  0,
);
const SHIPPING_USD = 0;
const TOTAL_USD = SUBTOTAL_USD + SHIPPING_USD;

const DUMMY_ORDER = {
  number: "DI-2026-0001",
  email: "you@example.com",
  date: "May 27, 2026",
  estimatedDelivery: "June 3 – 8, 2026",
  shipping: {
    name: "Williams Bolu",
    line1: "12 Marina Road",
    line2: "Apt 4B",
    city: "Lagos",
    state: "Lagos",
    postal: "100001",
    country: "Nigeria",
  },
};

const fmt = (usd: number) => `$${usd.toFixed(2)}`;

const OrderConfirmationView = () => {
  return (
    <div className="mx-auto w-full max-w-[900px] px-6 py-10 lg:px-10 lg:py-14">
      <div className="mb-10 flex flex-col items-center gap-4 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 size={32} strokeWidth={1.75} />
        </div>
        <div className="space-y-1.5">
          <h2 className="font-heading text-2xl tracking-wider">
            Thank you for your order
          </h2>
          <p className="text-sm text-foreground/60">
            Order <span className="text-foreground">{DUMMY_ORDER.number}</span>{" "}
            · {DUMMY_ORDER.date}
          </p>
          <p className="text-sm text-foreground/60">
            A receipt has been sent to{" "}
            <span className="text-foreground">{DUMMY_ORDER.email}</span>.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section
          aria-label="Order details"
          className="space-y-6 rounded-2xl border border-border/30 bg-foreground/[0.03] p-6 md:p-8"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-foreground/60">
            <Package size={14} />
            Order Details
          </div>

          <ul className="space-y-4">
            {DUMMY_LINES.map((line) => (
              <li key={line.id} className="flex items-start gap-4">
                <div
                  className="size-14 shrink-0 rounded-md bg-foreground/[0.06]"
                  aria-hidden
                />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm text-foreground">
                    {line.title}
                  </span>
                  {line.variant && (
                    <span className="text-xs text-foreground/55">
                      {line.variant}
                    </span>
                  )}
                  {line.type !== "digital" && (
                    <span className="text-xs text-foreground/55">
                      Qty {line.qty}
                    </span>
                  )}
                </div>
                <span className="text-sm tabular-nums text-foreground">
                  {fmt(line.priceUsd * line.qty)}
                </span>
              </li>
            ))}
          </ul>

          <div className="h-px w-full bg-border/30" />

          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-foreground/70">Subtotal</dt>
              <dd className="tabular-nums text-foreground">
                {fmt(SUBTOTAL_USD)}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-foreground/70">Shipping</dt>
              <dd className="tabular-nums text-foreground">
                {fmt(SHIPPING_USD)}
              </dd>
            </div>
          </dl>

          <div className="h-px w-full bg-border/30" />

          <div className="flex items-center justify-between">
            <span className="text-base text-foreground">Total</span>
            <span className="text-base tabular-nums text-foreground">
              {fmt(TOTAL_USD)}
            </span>
          </div>
        </section>

        <section
          aria-label="Shipping details"
          className="space-y-6 rounded-2xl border border-border/30 bg-foreground/[0.03] p-6 md:p-8"
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-foreground/60">
            <MapPin size={14} />
            Shipping
          </div>

          <address className="text-sm leading-relaxed text-foreground/80 not-italic">
            <div className="text-foreground">{DUMMY_ORDER.shipping.name}</div>
            <div>{DUMMY_ORDER.shipping.line1}</div>
            {DUMMY_ORDER.shipping.line2 && (
              <div>{DUMMY_ORDER.shipping.line2}</div>
            )}
            <div>
              {DUMMY_ORDER.shipping.city}, {DUMMY_ORDER.shipping.state}{" "}
              {DUMMY_ORDER.shipping.postal}
            </div>
            <div>{DUMMY_ORDER.shipping.country}</div>
          </address>

          <div className="h-px w-full bg-border/30" />

          <div className="space-y-1.5">
            <p className="text-xs uppercase tracking-[0.18em] text-foreground/60">
              Estimated Delivery
            </p>
            <p className="text-sm text-foreground">
              {DUMMY_ORDER.estimatedDelivery}
            </p>
          </div>
        </section>
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/shop"
          className="inline-flex h-12 items-center justify-center rounded-full border border-border/40 px-8 text-sm font-medium text-foreground/80 transition-colors hover:border-border/60 hover:text-foreground"
        >
          Continue shopping →
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationView;
