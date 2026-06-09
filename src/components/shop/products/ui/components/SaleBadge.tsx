import { cn } from "@/lib/utils";

type SaleBadgeProps = {
  children: React.ReactNode;
  className?: string;
  rotate?: boolean;
  size?: "sm" | "md";
};

const SaleBadge = ({
  children,
  className,
  rotate = true,
  size = "sm",
}: SaleBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center bg-[#ff3d7f] text-foreground justify-center font-semibold tracking-wide uppercase select-none",
        size === "sm" && "h-6 px-2.5 text-[11px] rounded-[3px]",
        size === "md" && "h-7 px-3 text-xs rounded-[3px]",
        rotate && "-rotate-3",
        className,
      )}
    >
      {children}
    </span>
  );
};

export default SaleBadge;
