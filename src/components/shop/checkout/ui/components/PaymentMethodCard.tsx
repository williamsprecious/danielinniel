import Image from "next/image";

const CARDS = [
  { src: "/mastercard.svg", alt: "Mastercard" },
  { src: "/visa.svg", alt: "Visa" },
  { src: "/verve.svg", alt: "Verve" },
];

const PaymentMethodCard = () => {
  return (
    <section
      aria-label="Payment method"
      className="space-y-5 rounded-2xl border border-border/30 bg-foreground/[0.03] p-6 md:p-8"
    >
      <div className="space-y-1.5">
        <h2 className="text-xs uppercase tracking-[0.18em] text-foreground/60">
          Payment
        </h2>
        <p className="text-xs text-foreground/55">
          All transactions are secure and encrypted.
        </p>
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/60 bg-primary/10 p-5">
          <div className="flex items-center gap-4">
            <div
              aria-hidden
              className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-primary"
            >
              <div className="size-2 rounded-full bg-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">
              Paystack
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            {CARDS.map((card) => (
              <Image
                key={card.src}
                src={card.src}
                alt={card.alt}
                width={36}
                height={22}
                className="h-5 w-auto"
                unoptimized
              />
            ))}
          </div>
        </div>
        <p className="px-1 text-xs text-foreground/55">
          You&apos;ll be redirected to Paystack to complete your purchase.
        </p>
      </div>
    </section>
  );
};

export default PaymentMethodCard;
