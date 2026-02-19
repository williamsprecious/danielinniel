"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const GalleryFilterItem = ({
  filterValue,
  linkParams,
  type,
}: GalleryFilterItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === `/${linkParams}/${filterValue.value}`;

  return (
    <Link
      key={filterValue.value}
      href={`/${linkParams}/${filterValue.value}`}
      className={cn(
        "rounded-full",
        type === "grade"
          ? "px-6 py-1.5 text-base md:py-2 md:px-8 2xl:text-lg 2xl:px-10"
          : "px-3 py-1.5 text-sm min-[390px]:text-[15px] min-[390px]:px-3.5 min-[430px]:px-4 min-[500px]:text-base min-[500px]:px-5 md:py-2 md:px-6 2xl:text-lg 2xl:px-8",
        isActive
          ? "bg-secondary text-secondary-foreground"
          : "bg-transparent text-foreground/60"
      )}
    >
      {filterValue.title}
    </Link>
  );
};

export default GalleryFilterItem;
