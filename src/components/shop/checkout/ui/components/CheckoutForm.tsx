"use client";

import { useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import CountryCombobox from "@/components/shop/checkout/ui/components/CountryCombobox";
import { checkoutSchema, type CheckoutFormValues } from "@/schema";

export type CheckoutFormHandle = {
  submit: () => void;
};

type CheckoutFormProps = {
  ref?: React.Ref<CheckoutFormHandle>;
  onValid: (values: CheckoutFormValues) => void;
};

const CheckoutForm = ({ ref, onValid }: CheckoutFormProps) => {
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      country: "Nigeria",
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

        {/* SHIPPING ADDRESS */}
        <fieldset className="space-y-5">
          <legend className="mb-5 text-xs uppercase tracking-[0.18em] text-foreground/60">
            Shipping Address
          </legend>

          <FormField
            control={form.control}
            name="country"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <CountryCombobox
                    value={field.value}
                    onChange={field.onChange}
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

          <div className="grid gap-5 md:grid-cols-3">
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
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="State"
                      aria-label="State or region"
                      autoComplete="address-level1"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="Phone"
                    aria-label="Phone"
                    autoComplete="tel"
                    {...field}
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
