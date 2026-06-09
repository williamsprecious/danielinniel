import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";

type OrderStatusMessageProps = {
  variant: "finalizing" | "not-found";
};

/**
 * Shown on the confirmation page while the order is still being written
 * (`finalizing`) or when there's no order reference to look up (`not-found`).
 */
const OrderStatusMessage = ({ variant }: OrderStatusMessageProps) => {
  const finalizing = variant === "finalizing";

  return (
    <div className="mx-auto flex w-full max-w-[600px] flex-col items-center gap-4 px-6 py-24 text-center lg:px-10">
      <div className="grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
        {finalizing ? (
          <Loader2 size={28} strokeWidth={1.75} className="animate-spin" />
        ) : (
          <AlertCircle size={28} strokeWidth={1.75} />
        )}
      </div>
      <h2 className="font-heading text-2xl tracking-wider">
        {finalizing ? "Finalizing your order…" : "No order found"}
      </h2>
      <p className="max-w-md text-sm text-foreground/60">
        {finalizing
          ? "Your payment was successful — we're confirming your order. This page updates automatically and only takes a moment. A receipt has been sent to your email."
          : "We couldn't find an order to display. If you've just paid, check your email for a receipt or contact us with your payment reference."}
      </p>

      <Link
        href="/shop"
        className="mt-4 inline-flex h-12 items-center justify-center rounded-full border border-border/40 px-8 text-sm font-medium text-foreground/80 transition-colors hover:border-border/60 hover:text-foreground"
      >
        Continue shopping →
      </Link>
    </div>
  );
};

export default OrderStatusMessage;
