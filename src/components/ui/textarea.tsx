import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-0 placeholder:text-muted-foreground/60 aria-invalid:border-destructive/90 text-foreground/80 flex field-sizing-content min-h-36 placeholder:font-medium placeholder:text-lg font-sans w-full rounded-md bg-[#131313] p-5 text-lg shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
