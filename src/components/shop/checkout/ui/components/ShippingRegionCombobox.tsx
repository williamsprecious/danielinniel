"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Region } from "@/lib/shipping/regions";

type ShippingRegionComboboxProps = {
  value: string;
  onChange: (region: string) => void;
  regions: ReadonlyArray<Region>;
  label: string;
  hasError?: boolean;
};

const ShippingRegionCombobox = ({
  value,
  onChange,
  regions,
  label,
  hasError,
}: ShippingRegionComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return regions;
    return regions.filter((r) => r.name.toLowerCase().includes(q));
  }, [query, regions]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        role="combobox"
        onClick={() => {
          if (open) close();
          else setOpen(true);
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={hasError || undefined}
        className={cn(
          "flex h-16 w-full cursor-pointer items-center justify-between rounded-md border border-transparent bg-[#131313] p-5 text-left text-lg text-foreground/80 transition-colors",
          !value && "text-muted-foreground/60 font-medium",
          hasError && "border-destructive/90",
        )}
      >
        <span className="truncate">{value || label}</span>
        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-foreground/50 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border border-border/40 bg-[#131313] shadow-xl"
        >
          <div className="flex items-center gap-2 border-b border-border/30 px-4 py-3">
            <Search size={14} className="text-foreground/50" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}s`}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground/40 focus:outline-none"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-foreground/50">
                No {label.toLowerCase()}s match.
              </li>
            ) : (
              filtered.map((region) => {
                const selected = region.name === value;
                return (
                  <li key={region.name}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        onChange(region.name);
                        close();
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-foreground/80 transition-colors hover:bg-foreground/[0.06]",
                        selected && "bg-foreground/[0.04] text-foreground",
                      )}
                    >
                      <span>{region.name}</span>
                      {selected && (
                        <Check size={14} className="text-primary" />
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ShippingRegionCombobox;
