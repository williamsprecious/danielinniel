import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { TbCircleCheck } from "react-icons/tb";
import { cn } from "@/lib/utils";
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
    <CometCard viewDelay={viewDelay}>
      <Link
        href={href}
        className={cn(
          "flex w-full h-full cursor-pointer flex-col items-stretch rounded-[16px] border border-solid border-border/50 bg-[#0e0d0d] px-2 pt-4 2xl:px-3"
        )}
      >
        <div className="mx-2">
          <Image src={src} className="rounded-[8px]" alt="Character" />
        </div>
        <div
          className={cn(
            "z-2 flex flex-shrink-0 flex-col gap-3 font-sans py-5 px-3.5 md:py-6"
          )}
        >
          <div className="flex items-center justify-between">
            <h3
              className={cn("font-medium text-xl lg:text-[22px] 2xl:text-2xl")}
            >
              {text}
            </h3>
            <span className="text-lg opacity-60 lg:text-xl 2xl:text-[22px]">
              ${priceTag}
            </span>
          </div>

          {features && features.length > 0 && (
            <ul className="mt-1.5 grid grid-cols-1 gap-1.5 text-xs leading-snug text-white/70 2xl:grid-cols-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-[2px] text-[#a5d4d0]">
                    <TbCircleCheck className="size-3.5" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </CometCard>
  );
};

export default CoverCard;
