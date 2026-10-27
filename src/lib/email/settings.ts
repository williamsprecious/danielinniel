import "server-only";
import { defineQuery } from "next-sanity";
import { z } from "zod";
import { backendClient } from "@/sanity/lib/backendClient";

const STORE_CONTACT_EMAILS_QUERY = defineQuery(`
  *[_type == "storeSettings" && _id == "storeSettings"][0]{contactEmails}
`);

const contactEmailsSchema = z
  .array(z.string().trim().pipe(z.email()))
  .min(1)
  .max(2)
  .refine(
    (emails) =>
      new Set(emails.map((email) => email.toLowerCase())).size ===
      emails.length,
  );

export async function getStoreContactEmails(): Promise<string[]> {
  const settings = await backendClient.fetch(
    STORE_CONTACT_EMAILS_QUERY,
    {},
    { perspective: "published", cache: "no-store", stega: false },
  );
  const result = contactEmailsSchema.safeParse(settings?.contactEmails);

  if (result.success) return result.data;

  throw new Error(
    "Store Settings must have one or two valid, unique Contact Emails. Save and publish the settings before sending order notifications.",
  );
}
