"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  AsYouType,
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import NG from "country-flag-icons/react/3x2/NG";
import US from "country-flag-icons/react/3x2/US";
import CA from "country-flag-icons/react/3x2/CA";
import GB from "country-flag-icons/react/3x2/GB";
import { cn } from "@/lib/utils";
import { isSupportedShippingCountry } from "@/lib/shipping/supported-countries";
import type { ShippingCountryCode } from "@/lib/shipping/types";

const FLAGS: Record<ShippingCountryCode, typeof NG> = { NG, US, CA, GB };

const DEFAULT_COUNTRY: ShippingCountryCode = "NG";

// Clean E.164 from whatever the user typed — libphonenumber-js handles national
// trunk prefixes (e.g. NG's leading 0 → dropped in E.164).
const toE164 = (raw: string, country: ShippingCountryCode): string =>
  raw.trim() ? (parsePhoneNumberFromString(raw, country)?.number ?? "") : "";

const formatNational = (raw: string, country: ShippingCountryCode): string =>
  new AsYouType(country).input(raw);

export type PhoneCountryOption = { code: string; name: string };

type PhoneInputProps = {
  onChange: (value: string) => void;
  /** Configured shipping countries — drives the dropdown list and initial default. */
  countries: ReadonlyArray<PhoneCountryOption>;
  /**
   * The selected shipping/billing country, used as the initial phone country.
   * CheckoutForm re-keys this component on country change so it resets and
   * re-defaults to the new country (and clears the form value alongside).
   */
  country?: string;
  hasError?: boolean;
};

const PhoneInput = ({
  onChange,
  countries,
  country,
  hasError,
}: PhoneInputProps) => {
  const [selected, setSelected] = useState<ShippingCountryCode>(() => {
    if (
      isSupportedShippingCountry(country) &&
      countries.some((c) => c.code === country)
    ) {
      return country;
    }
    const first = countries[0]?.code;
    return isSupportedShippingCountry(first) ? first : DEFAULT_COUNTRY;
  });
  const [national, setNational] = useState("");
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const display = formatNational(national, selected);

  const options = useMemo(
    () =>
      countries
        .filter((c) => isSupportedShippingCountry(c.code))
        .map((c) => ({
          code: c.code as ShippingCountryCode,
          name: c.name,
          dial: getCountryCallingCode(c.code as ShippingCountryCode),
        })),
    [countries],
  );

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const handleType = (raw: string) => {
    setNational(raw);
    onChange(toE164(raw, selected));
  };

  // Switching the phone country clears the number (per requirement).
  const handlePickCountry = (code: ShippingCountryCode) => {
    setSelected(code);
    setNational("");
    onChange("");
    close();
  };

  const SelectedFlag = FLAGS[selected];

  return (
    <div ref={containerRef} className="relative">
      <div
        aria-invalid={hasError || undefined}
        className={cn(
          "flex h-16 w-full items-center rounded-md border border-transparent bg-[#131313] transition-colors",
          "aria-invalid:border-destructive/90",
          hasError && "border-destructive/90",
        )}
      >
        <button
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-label="Select country calling code"
          onClick={() => setOpen((v) => !v)}
          className="flex h-full shrink-0 cursor-pointer items-center gap-2 rounded-l-md pr-3 pl-5 text-foreground/80"
        >
          <SelectedFlag className="h-4 w-6 shrink-0 rounded-sm object-cover" />
          <span className="text-lg tabular-nums">
            +{getCountryCallingCode(selected)}
          </span>
          <ChevronDown
            size={18}
            className={cn(
              "shrink-0 text-foreground/50 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>

        <span className="h-7 w-px shrink-0 bg-border/40" aria-hidden />

        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          aria-label="Phone number"
          placeholder="Phone number"
          value={display}
          onChange={(e) => handleType(e.target.value)}
          className="h-full w-full min-w-0 bg-transparent px-4 font-sans text-lg text-foreground/80 placeholder:text-lg placeholder:font-medium placeholder:text-muted-foreground/60 outline-none"
        />
      </div>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border border-border/40 bg-[#131313] shadow-xl"
        >
          <ul className="max-h-64 overflow-y-auto py-1">
            {options.map((opt) => {
              const isSelected = opt.code === selected;
              const Flag = FLAGS[opt.code];
              return (
                <li key={opt.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handlePickCountry(opt.code)}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-foreground/80 transition-colors hover:bg-foreground/[0.06]",
                      isSelected && "bg-foreground/[0.04] text-foreground",
                    )}
                  >
                    <Flag className="h-4 w-6 shrink-0 rounded-sm object-cover" />
                    <span className="flex-1 truncate">{opt.name}</span>
                    <span className="tabular-nums text-foreground/50">
                      +{opt.dial}
                    </span>
                    {isSelected && <Check size={14} className="text-primary" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
