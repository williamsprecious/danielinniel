"use client";

import { useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import ShippingCountryCombobox, {
  type ShippingCountryOption,
} from "@/components/shop/checkout/ui/components/ShippingCountryCombobox";
import ShippingRegionCombobox from "@/components/shop/checkout/ui/components/ShippingRegionCombobox";
import PhoneInput from "@/components/shop/checkout/ui/components/PhoneInput";
import { checkoutSchema, type CheckoutFormValues } from "@/schema";
import { getRegionLabel } from "@/lib/shipping/supported-countries";
import { getRegionsForCountry } from "@/lib/shipping/regions";
import { cn } from "@/lib/utils";

export type CheckoutFormHandle = {
  submit: () => void;
};

type CheckoutFormProps = {
  ref?: React.Ref<CheckoutFormHandle>;
  onValid: (values: CheckoutFormValues) => void;
  availableCountries: ReadonlyArray<ShippingCountryOption>;
  onDestinationChange?: (destination: { country: string; state: string }) => void;
  /** Digital-only carts ship nothing — the address is collected for billing. */
  isDigitalOnly?: boolean;
};

const CheckoutForm = ({
  ref,
  onValid,
  availableCountries,
  onDestinationChange,
  isDigitalOnly = false,
}: CheckoutFormProps) => {
  const defaultCountry = availableCountries[0]?.code ?? "";

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      country: defaultCountry,
      firstName: "",
      lastName: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      phone: "",
    },
    mode: "onBlur",
  });

  useImperativeHandle(ref, () => ({
    submit: () => {
      void form.handleSubmit(onValid)();
    },
  }));

  const watchedCountry = useWatch({ control: form.control, name: "country" });
  const watchedState = useWatch({ control: form.control, name: "state" });

  const regionLabel = useMemo(
    () => getRegionLabel(watchedCountry),
    [watchedCountry],
  );
  const regions = useMemo(
    () => getRegionsForCountry(watchedCountry),
    [watchedCountry],
  );

  useEffect(() => {
    onDestinationChange?.({
      country: watchedCountry ?? "",
      state: watchedState ?? "",
    });
  }, [watchedCountry, watchedState, onDestinationChange]);

  // If the country no longer supports a region, clear any leftover state value
  // so the form doesn't carry stale data into a hidden field.
  useEffect(() => {
    if (regionLabel === null && form.getValues("state")) {
      form.setValue("state", "", { shouldValidate: false });
    }
  }, [regionLabel, form]);

  // Switching the address country resets the phone number (the PhoneInput is
  // re-keyed on the same country, re-defaulting its flag to the new country).
  const phoneResetGuard = useRef(false);
  useEffect(() => {
    if (!phoneResetGuard.current) {
      phoneResetGuard.current = true;
      return;
    }
    form.setValue("phone", "", { shouldValidate: false });
  }, [watchedCountry, form]);

  if (availableCountries.length === 0) {
    return (
      <div
        role="status"
        className="rounded-md border border-border/40 bg-foreground/[0.04] p-5 text-sm text-foreground/80"
      >
        Shipping isn&apos;t configured yet — please contact us before placing
        an order.
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onValid)}
        className="space-y-8"
        noValidate
      >
        {/* CONTACT INFORMATION */}
        <fieldset className="space-y-5">
          <legend className="mb-5 text-xs uppercase tracking-[0.18em] text-foreground/60">
            Contact Information
          </legend>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    aria-label="Email"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </fieldset>

        {/* SHIPPING / BILLING ADDRESS */}
        <fieldset className="space-y-5">
          <legend className="mb-5 text-xs uppercase tracking-[0.18em] text-foreground/60">
            {isDigitalOnly ? "Billing Address" : "Shipping Address"}
          </legend>

          <FormField
            control={form.control}
            name="country"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <ShippingCountryCombobox
                    value={field.value}
                    onChange={field.onChange}
                    countries={availableCountries}
                    hasError={!!fieldState.error}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="First Name"
                      aria-label="First name"
                      autoComplete="given-name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Last Name"
                      aria-label="Last name"
                      autoComplete="family-name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="line1"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Address"
                    aria-label="Address line 1"
                    autoComplete="address-line1"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="line2"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Apartment, Suite, etc. (optional)"
                    aria-label="Apartment, suite, etc."
                    autoComplete="address-line2"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div
            className={cn(
              "grid gap-5",
              regionLabel ? "md:grid-cols-3" : "md:grid-cols-2",
            )}
          >
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="City"
                      aria-label="City"
                      autoComplete="address-level2"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {regionLabel && regions && (
              <FormField
                control={form.control}
                name="state"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <ShippingRegionCombobox
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        regions={regions}
                        label={regionLabel}
                        hasError={!!fieldState.error}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Zip code"
                      aria-label="Postal code"
                      autoComplete="postal-code"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  {/* Re-keyed on the address country so switching it resets the
                      number and re-defaults the flag to the new country. */}
                  <PhoneInput
                    key={watchedCountry}
                    onChange={field.onChange}
                    countries={availableCountries}
                    country={watchedCountry}
                    hasError={!!fieldState.error}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </fieldset>
      </form>
    </Form>
  );
};

export default CheckoutForm;
