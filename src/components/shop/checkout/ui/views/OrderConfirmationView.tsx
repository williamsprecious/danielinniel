import Link from "next/link";
import { Image } from "next-sanity/image";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  MapPin,
  Package,
} from "lucide-react";
import type { ORDER_BY_REFERENCE_QUERY_RESULT } from "../../../../../../sanity.types";
import { urlFor } from "@/sanity/lib/image";
import { formatPrice } from "@/lib/format-price";

export type OrderData = NonNullable<ORDER_BY_REFERENCE_QUERY_RESULT>;

// Orders are settled and stored in NGN — the currency switcher is display-only.
const fmtNGN = (n: number) => formatPrice(n, "NGN", {});

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
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-14 lg:px-10 lg:py-16">
      <div className="mb-8 flex flex-col items-center gap-5 text-center sm:mb-10">
        <div className="grid size-16 place-items-center rounded-full border border-primary/20 bg-primary/10 text-primary">
          <CheckCircle2 size={32} strokeWidth={1.75} aria-hidden="true" />
        </div>
        <div className="space-y-3">
          <h1 className="font-heading text-3xl tracking-wide sm:text-4xl">
            Thank you for your order
          </h1>
          {email && (
            <p className="mx-auto max-w-md text-sm leading-6 text-foreground/60">
              A receipt has been sent to{" "}
              <span className="break-all text-foreground">{email}</span>.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5 sm:gap-6">
        <section
          aria-label="Order details"
          className="overflow-hidden rounded-2xl border border-border/30 bg-foreground/[0.03]"
        >
          <div className="flex items-center gap-3 border-b border-border/30 px-5 py-5 sm:px-8">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-foreground/5 text-foreground/70">
              <Package size={17} aria-hidden="true" />
            </span>
            <h2 className="font-heading text-xl tracking-wide">
              Order details
            </h2>
          </div>

          <ul className="divide-y divide-border/20 px-5 sm:px-8">
            {items.map((line) => (
              <li
                key={line._key}
                className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-x-4 gap-y-2 py-5 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:py-6"
              >
                <div className="relative row-span-2 size-14 overflow-hidden rounded-lg bg-foreground/[0.06] sm:row-span-1 sm:size-16">
                  {line.image && (
                    <Image
                      src={urlFor(line.image).width(128).url()}
                      alt={line.title ?? "Item"}
                      width={64}
                      height={64}
                      sizes="(min-width: 640px) 64px, 56px"
                      className="absolute inset-0 size-full object-cover"
                    />
                  )}
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-sm font-medium leading-6 break-words text-foreground">
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
                  {line.type === "digital" && line.downloadUrl && (
                    <a
                      href={line.downloadUrl}
                      className="mt-2 inline-flex min-h-10 w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Download size={14} aria-hidden="true" />
                      Download
                    </a>
                  )}
                </div>
                <span className="col-start-2 text-sm font-medium whitespace-nowrap tabular-nums text-foreground sm:col-start-3 sm:row-start-1 sm:pt-1 sm:text-right">
                  {fmtNGN(line.lineTotal ?? 0)}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-5 border-t border-border/30 bg-foreground/[0.02] px-5 py-5 sm:px-8 sm:py-6">
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

            <div className="flex items-center justify-between gap-4 border-t border-border/30 pt-5">
              <span className="text-base font-medium text-foreground">
                Total
              </span>
              <span className="text-xl font-semibold tabular-nums text-foreground">
                {fmtNGN(total)}
              </span>
            </div>
          </div>
        </section>

        {address && (
          <section
            aria-label={`${addressLabel} details`}
            className="overflow-hidden rounded-2xl border border-border/30 bg-foreground/[0.03]"
          >
            <div className="flex items-center gap-3 border-b border-border/30 px-5 py-5 sm:px-8">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-foreground/5 text-foreground/70">
                <MapPin size={17} aria-hidden="true" />
              </span>
              <h2 className="font-heading text-xl tracking-wide">
                {addressLabel} details
              </h2>
            </div>

            <address className="px-5 py-5 text-sm leading-7 break-words text-foreground/70 not-italic sm:px-8 sm:py-6">
              <div className="mb-1 font-medium text-foreground">
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

      <div className="mt-8 flex justify-center sm:mt-10">
        <Link
          href="/shop"
          className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
        >
          Continue shopping
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationView;
