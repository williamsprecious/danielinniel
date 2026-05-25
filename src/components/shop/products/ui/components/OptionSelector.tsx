"use client";

import { cn } from "@/lib/utils";

type OptionSelectorProps = {
  name: string;
  values: string[];
  value: string;
  onChange: (val: string) => void;
};

const OptionSelector = ({
  name,
  values,
  value,
  onChange,
}: OptionSelectorProps) => {
  if (values.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm text-foreground/80">{name}:</span>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => {
          const isActive = v === value;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              aria-pressed={isActive}
              className={cn(
                "min-w-11 cursor-pointer rounded-md border px-3.5 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border/40 text-foreground/85",
              )}
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OptionSelector;
