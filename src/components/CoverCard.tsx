import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { CometCard } from "./ui/comet-card";

interface CoverCardProps {
  text: string;
  priceTag: string;
  href?: string;
  src: StaticImageData;
  viewDelay?: number;
  features?: string[];
}

const CoverCard = ({
  href = "/",
  priceTag,
  src,
  text,
  viewDelay = 0.6,
  features,
}: CoverCardProps) => {
  return (
    <CometCard
      viewDelay={viewDelay}
      rotateDepth={6}
      translateDepth={5}
      className="h-full w-full"
    >
      <Link
        href={href}
        className="group flex h-full w-full flex-col rounded-2xl border border-border/60 bg-background p-2 text-left transition-colors duration-300 hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary 2xl:p-3"
      >
        <div className="aspect-square overflow-hidden rounded-xl">
          <Image
            src={src}
            className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
            alt={`${text} cover art example`}
            sizes="(min-width: 1536px) 552px, (min-width: 768px) 424px, calc(100vw - 56px)"
          />
        </div>
        <div className="flex flex-1 flex-col px-4 pt-6 pb-2 sm:px-5 2xl:px-6 2xl:pt-7">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-heading text-4xl tracking-wide 2xl:text-5xl">
              {text}
            </h3>
            <div className="shrink-0 text-right">
              <span className="block text-xs text-foreground/60">
                Starting at
              </span>
              <span className="mt-1 block text-xl font-medium tabular-nums 2xl:text-2xl">
                ${priceTag.replace(/\+$/, "")}
              </span>
            </div>
          </div>

          {features && features.length > 0 && (
            <div className="mt-5 border-t border-border/60 pt-5">
              <p className="mb-4 text-xs font-medium tracking-widest text-foreground/50 uppercase">
                What&apos;s included
              </p>
              <ul className="space-y-3 text-sm leading-relaxed text-foreground/80 2xl:text-base">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-primary"
                      strokeWidth={1.75}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex-1" />
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 py-4 text-sm font-medium 2xl:mt-7">
            <span>View {text.toLowerCase()} examples</span>
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-secondary-foreground group-focus-visible:bg-primary group-focus-visible:text-secondary-foreground">
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </CometCard>
  );
};

export default CoverCard;
