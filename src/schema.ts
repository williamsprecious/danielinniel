import { z } from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";
import {
  SUPPORTED_SHIPPING_COUNTRY_CODES,
  getRegionLabel,
} from "@/lib/shipping/supported-countries";

export const projectSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email address"),
    category: z.enum(["concept-and-design", "cover-art"]),
    grade: z.enum(["essential", "advanced"]).optional(),
    design: z
      .enum([
        "concept-art",
        "character-design",
        "logo",
        "fashion-illustration",
        "others",
      ])
      .optional(),
    budget: z.string().min(1, "Please select a budget range"),
    projectDetails: z
      .string()
      .min(6, "Project details must be at least 6 characters long"),
    company: z.string().optional(),
  })
  .refine(
    (data) => {
      // If category is cover-art, grade must be provided
      if (data.category === "cover-art") {
        return data.grade !== undefined;
      }
      if (data.category === "concept-and-design") {
        return data.design !== undefined;
      }
      return true;
    },
    {
      message: "Grade is required when category is Cover Art",
      path: ["grade"], // This will show the error on the grade field
    }
  );

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().min(5),
});

export const checkoutSchema = z
  .object({
    // contact
    email: z.string().email("Invalid email address"),

    // shipping
    country: z.enum(
      SUPPORTED_SHIPPING_COUNTRY_CODES as unknown as [string, ...string[]],
      { message: "Select a supported country" },
    ),
    firstName: z.string().min(1, "First name is required").max(60),
    lastName: z.string().min(1, "Last name is required").max(60),
    line1: z.string().min(3, "Address is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    phone: z
      .string()
      .min(1, "Phone is required")
      .refine((v) => isValidPhoneNumber(v), "Enter a valid phone number"),
  })
  .superRefine((data, ctx) => {
    const label = getRegionLabel(data.country);
    if (label && !data.state?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["state"],
        message: `${label} is required`,
      });
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
