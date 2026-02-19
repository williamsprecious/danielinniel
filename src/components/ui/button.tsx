import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground font-normal shadow-xs hover:bg-secondary hover:text-secondary-foreground",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border border-solid shadow-xs",
        secondary:
          "bg-secondary text-secondary-foreground font-normal shadow-xs hover:bg-primary hover:text-primary-foreground",
        ghost: "hover:bg-accent/5 hover:text-accent dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-7 text-[13px] gap-1.5 px-3 has-[>svg]:px-2.5 lg:h-8 lg:text-sm 2xl:px-6 2xl:h-[37px]",
        md: "h-11 px-5 text-sm has-[>svg]:px-4 sm:text-base sm:h-12 md:has-[>svg]:px-5 md:px-6 md:h-12 2xl:h-13",
        lg: "h-12 px-6 text-sm has-[>svg]:px-6 sm:text-base sm:h-13 md:has-[>svg]:px-8 md:px-8 md:h-14 2xl:h-15 2xl:text-lg",
        icon: "size-9",
        "mobile-menu": "px-6 py-2 max-[360px]:text-sm! sm:py-2 text-lg!",
        xl: "text-lg w-[65%] px-10 py-2.5 font-medium sm:w-fit md:text-xl 2xl:py-3.5 2xl:text-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
