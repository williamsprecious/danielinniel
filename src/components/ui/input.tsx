import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground text-foreground/80 placeholder:text-muted-foreground/60 placeholder:font-medium placeholder:text-lg selection:bg-primary selection:text-primary-foreground bg-[#131313] flex h-16 font-sans w-full min-w-0 rounded-md border border-transparent p-5 text-lg shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive/90",
        className
      )}
      {...props}
    />
  );
}

export { Input };
