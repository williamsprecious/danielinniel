import Link from "next/link";
import { Image } from "next-sanity/image";
import { CheckCircle2, MapPin, Package } from "lucide-react";
import type { ORDER_BY_REFERENCE_QUERY_RESULT } from "../../../../../../sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { formatPrice } from "@/lib/format-price";

export type OrderData = NonNullable<ORDER_BY_REFERENCE_QUERY_RESULT>;

// Orders are settled and stored in NGN — the currency switcher is display-only.
const fmtNGN = (n: number) => formatPrice(n, "NGN", {});

const fmtDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

const OrderConfirmationView = ({ order }: { order: OrderData }) => {
  const items = order.items ?? [];
  const isDigitalOnly =
    items.length > 0 && items.every((line) => line.type === "digital");
  const address = order.shippingAddress ?? order.billingAddress ?? null;
  const addressLabel = order.shippingAddress ? "Shipping" : "Billing";
  const subtotal = order.subtotal ?? 0;
  const shippingFee = order.shippingFee ?? 0;
  const total = order.total ?? 0;
  const email = order.customer?.email ?? "";

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
            Order <span className="text-foreground">{order.orderNumber}</span>
            {order.createdAt ? <> · {fmtDate(order.createdAt)}</> : null}
          </p>
          {email && (
            <p className="text-sm text-foreground/60">
              A receipt has been sent to{" "}
              <span className="text-foreground">{email}</span>.
            </p>
          )}
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
            {items.map((line) => (
              <li key={line._key} className="flex items-start gap-4">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-foreground/[0.06]">
                  {line.image && (
                    <Image
                      src={urlFor(line.image).width(112).url()}
                      alt={line.title ?? "Item"}
                      width={56}
                      height={56}
                      sizes="56px"
                      className="absolute inset-0 size-full object-cover"
                    />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm text-foreground">
                    {line.title}
                  </span>
                  {line.variantTitle && (
                    <span className="text-xs text-foreground/55">
                      {line.variantTitle}
                    </span>
                  )}
                  {line.type !== "digital" && (
                    <span className="text-xs text-foreground/55">
                      Qty {line.quantity}
                    </span>
                  )}
                </div>
                <span className="text-sm tabular-nums text-foreground">
                  {fmtNGN(line.lineTotal ?? 0)}
                </span>
              </li>
            ))}
          </ul>

          <div className="h-px w-full bg-border/30" />

          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-foreground/70">Subtotal</dt>
              <dd className="tabular-nums text-foreground">
                {fmtNGN(subtotal)}
              </dd>
            </div>
            {!isDigitalOnly && (
              <div className="flex items-center justify-between">
                <dt className="text-foreground/70">Shipping</dt>
                <dd className="tabular-nums text-foreground">
                  {shippingFee === 0 ? "Free" : fmtNGN(shippingFee)}
                </dd>
              </div>
            )}
          </dl>

          <div className="h-px w-full bg-border/30" />

          <div className="flex items-center justify-between">
            <span className="text-base text-foreground">Total</span>
            <span className="text-base tabular-nums text-foreground">
              {fmtNGN(total)}
            </span>
          </div>
        </section>

        {address && (
          <section
            aria-label={`${addressLabel} details`}
            className="space-y-6 rounded-2xl border border-border/30 bg-foreground/[0.03] p-6 md:p-8"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-foreground/60">
              <MapPin size={14} />
              {addressLabel}
            </div>

            <address className="text-sm leading-relaxed text-foreground/80 not-italic">
              <div className="text-foreground">
                {address.firstName} {address.lastName}
              </div>
              <div>{address.line1}</div>
              {address.line2 && <div>{address.line2}</div>}
              <div>
                {[address.city, address.state, address.postalCode]
                  .filter(Boolean)
                  .join(", ")}
              </div>
              <div>{address.country}</div>
            </address>
          </section>
        )}
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
