import { defineArrayMember, defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const storeSettingsType = defineType({
  name: "storeSettings",
  title: "Store Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    // ── Identity ─────────────────────────────────────────────
    defineField({
      name: "storeName",
      title: "Store Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contactEmails",
      title: "Contact Emails",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description:
        "Email addresses used for store contact and order notifications. Add at least one.",
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(2)
          .unique()
          .custom((emails) => {
            const list = emails as string[] | undefined;
            if (!list || list.length === 0) return true;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            for (const email of list) {
              if (!emailRegex.test(email))
                return `"${email}" is not a valid email address`;
            }
            return true;
          }),
    }),
    defineField({
      name: "emailFromName",
      title: "Email Sender Name",
      type: "string",
      initialValue: "Danielinniel Store",
      description:
        'Sender name used on customer emails (e.g., "Danielinniel Store <no-reply@…>")',
    }),

    // ── Currency ─────────────────────────────────────────────
    defineField({
      name: "baseCurrency",
      title: "Base Currency",
      type: "string",
      initialValue: "NGN",
      readOnly: true,
      description:
        "Currency prices are authored in. Always NGN (Paystack settlement).",
    }),
    defineField({
      name: "ratesToNGN",
      title: "Rates to NGN",
      type: "array",
      description:
        "Foreign currencies the storefront can switch to for display. Add a currency code; the rate is refreshed automatically by the currency sync job.",
      of: [
        defineArrayMember({
          type: "object",
          name: "currencyRate",
          fields: [
            defineField({
              name: "code",
              title: "Currency Code",
              type: "string",
              options: {
                list: [
                  { title: "USD ($)", value: "USD" },
                  { title: "EUR (€)", value: "EUR" },
                  { title: "GBP (£)", value: "GBP" },
                  { title: "CAD (CA$)", value: "CAD" },
                  { title: "AUD (A$)", value: "AUD" },
                  { title: "ZAR (R)", value: "ZAR" },
                  { title: "GHS (GH₵)", value: "GHS" },
                  { title: "JPY (¥)", value: "JPY" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "rate",
              title: "Rate (₦ per 1 unit)",
              type: "number",
              readOnly: true,
              description:
                "How many NGN equals 1 unit of this currency. Set automatically by the currency sync job.",
              validation: (Rule) => Rule.positive(),
            }),
          ],
          preview: {
            select: { code: "code", rate: "rate" },
            prepare: ({ code, rate }) => ({
              title: code || "Currency",
              subtitle:
                typeof rate === "number"
                  ? `1 ${code} ≈ ₦${Math.round(rate).toLocaleString()}`
                  : "Pending next sync",
            }),
          },
        }),
      ],
      validation: (Rule) =>
        Rule.custom((items) => {
          const list = items as Array<{ code?: string }> | undefined;
          if (!list || list.length === 0) return true;
          const codes = list
            .map((i) => i?.code)
            .filter((c): c is string => typeof c === "string");
          const seen = new Set<string>();
          const dups = new Set<string>();
          for (const c of codes) {
            if (seen.has(c)) dups.add(c);
            seen.add(c);
          }
          return dups.size === 0
            ? true
            : `Duplicate currency codes: ${[...dups].join(", ")}`;
        }),
    }),
    defineField({
      name: "ratesUpdatedAt",
      title: "Rates Last Updated",
      type: "datetime",
      readOnly: true,
      description:
        "Last time rates were refreshed by the currency sync job.",
    }),

    // ── Shipping ─────────────────────────────────────────────
    defineField({
      name: "shippingZones",
      title: "Shipping Zones",
      type: "array",
      description:
        "Add one entry per country you ship to. Each entry has a default fee (used when no region matches) and optional region overrides for specific states/provinces. United Kingdom is flat-only (no regions). A fee of 0 means free shipping.",
      of: [
        defineArrayMember({ type: "shippingZoneNG" }),
        defineArrayMember({ type: "shippingZoneUS" }),
        defineArrayMember({ type: "shippingZoneCA" }),
        defineArrayMember({ type: "shippingZoneGB" }),
      ],
      validation: (Rule) =>
        Rule.custom((items) => {
          const list = items as
            | Array<{ country?: string; _type?: string }>
            | undefined;
          if (!list || list.length === 0) return true;
          const NAMES: Record<string, string> = {
            NG: "Nigeria",
            US: "United States",
            CA: "Canada",
            GB: "United Kingdom",
          };
          const seen = new Set<string>();
          const dups = new Set<string>();
          for (const z of list) {
            const country = z?.country;
            if (!country) continue;
            if (seen.has(country)) dups.add(country);
            seen.add(country);
          }
          if (dups.size === 0) return true;
          const labels = [...dups]
            .map((c) => NAMES[c] ?? c)
            .join(", ");
          return `Each country can only be configured once — duplicates: ${labels}`;
        }),
    }),

    // ── Digital delivery defaults ────────────────────────────
    defineField({
      name: "defaultDownloadExpiryDays",
      title: "Default Download Expiry (days)",
      type: "number",
      initialValue: 30,
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: "defaultDownloadLimit",
      title: "Default Download Limit",
      type: "number",
      initialValue: 5,
      validation: (Rule) => Rule.required().integer().min(1),
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Store Settings",
      subtitle: "Singleton",
    }),
  },
});
