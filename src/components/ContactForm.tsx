"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { useNewBooking } from "@/hooks/use-new-booking";
import { contactSchema } from "@/schema";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import ButtonAnimationWrapper from "@/components/ButtonAnimationWrapper";
import { cn } from "@/lib/utils";
import { sendContactEmail } from "@/actions/contact.action";

const ContactForm = () => {
  const { setStep } = useNewBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof contactSchema>) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const trimmedValues = {
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company?.trim() ?? "",
      message: values.message.trim(),
    };

    try {
      // Send email using server action
      const result = await sendContactEmail(trimmedValues);

      if (result.success) {
        setStep(4);
      } else {
        // Handle validation errors from server
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof z.infer<typeof contactSchema>, {
              type: "server",
              message: messages[0],
            });
          });
        } else {
          setSubmitError(result.message);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError("Failed to send your request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-8 relative max-[400px]:px-4! max-md:py-40 max-md:px-6 md:gap-4"
      >
        {submitError && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
            {submitError}
          </div>
        )}
        <p className="uppercase text-sm text-muted-foreground">
          (Contact Details)
        </p>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Your Name"
                  className={cn(
                    form.formState.errors.name &&
                      "border border-destructive/90",
                  )}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Company (optional)"
                  className={cn(
                    form.formState.errors.company &&
                      "border border-destructive/90",
                  )}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
                  className={cn(
                    form.formState.errors.email &&
                      "border border-destructive/90",
                  )}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  rows={10}
                  placeholder="How can we help?"
                  className={cn(
                    form.formState.errors.message &&
                      "border border-destructive/90",
                  )}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 px-2 pb-2">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="justify-self-end mt-4 text-muted-foreground"
            onClick={() => setStep(1)}
          >
            Previous
          </Button>

          <ButtonAnimationWrapper>
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="justify-self-end mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </Button>
          </ButtonAnimationWrapper>
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
