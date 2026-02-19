"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/ses";
import { contactSchema, projectSchema } from "@/schema";
import {
  generatePlainTextContactEmail,
  generatePlainTextProjectEmail,
  getContactEmailTemplate,
  getProjectEmailTemplate,
} from "@/lib/ses/contact.template";

export type FormEmailActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function sendProjectEmail(
  formData: unknown
): Promise<FormEmailActionState> {
  const parsed = projectSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed. Please check your input.",
      errors: formatZodErrors(parsed.error),
    };
  }

  const data = parsed.data;
  const recipientEmail = process.env.CONTACT_EMAIL!;

  await sendEmail({
    from: "Danielinniel <no-reply@danielinniel.com>",
    to: recipientEmail,
    replyTo: data.email,
    subject: `New Project Inquiry from ${data.name} - ${
      data.category === "cover-art" ? "Cover Art" : "Concept & Design"
    }`,
    html: getProjectEmailTemplate(data),
    text: generatePlainTextProjectEmail(data),
  });

  return {
    success: true,
    message: "Your project inquiry has been submitted successfully!",
  };
}

export async function sendContactEmail(
  formData: unknown
): Promise<FormEmailActionState> {
  const parsed = contactSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed. Please check your input.",
      errors: formatZodErrors(parsed.error),
    };
  }

  const data = parsed.data;
  const recipientEmail = process.env.CONTACT_EMAIL!;

  await sendEmail({
    from: "Danielinniel <no-reply@danielinniel.com>",
    to: recipientEmail,
    replyTo: data.email,
    subject: `New Contact Message from ${data.name}`,
    html: getContactEmailTemplate(data),
    text: generatePlainTextContactEmail(data),
  });

  return {
    success: true,
    message: "Your message has been sent successfully!",
  };
}

function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  error.issues.forEach((err: z.ZodIssue) => {
    const path = err.path.join(".");
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(err.message);
  });
  return fieldErrors;
}
