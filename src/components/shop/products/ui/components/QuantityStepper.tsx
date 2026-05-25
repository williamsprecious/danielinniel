"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  className?: string;
};

const QuantityStepper = ({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: QuantityStepperProps) => {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={cn(
        "inline-flex h-12 items-center gap-1 rounded-full border border-border/40 bg-background/60 px-1 backdrop-blur-sm",
        className,
      )}
    >
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="grid size-10 cursor-pointer place-items-center rounded-full text-foreground/80 transition-colors hover:bg-foreground/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus size={16} strokeWidth={2.5} />
      </button>
      <span
        aria-live="polite"
        className="min-w-8 text-center text-sm font-medium tabular-nums text-foreground"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="grid size-10 cursor-pointer place-items-center rounded-full text-foreground/80 transition-colors hover:bg-foreground/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default QuantityStepper;
