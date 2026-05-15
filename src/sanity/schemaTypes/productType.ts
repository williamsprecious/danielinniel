import { defineArrayMember, defineField, defineType } from "sanity";
import { PackageIcon } from "@sanity/icons";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(220),
    }),
    defineField({
      name: "description",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "images",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true } })],
      validation: (Rule) =>
        Rule.required().min(1).error("Add at least one image"),
    }),
    defineField({
      name: "categories",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "category" }],
        }),
      ],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
    defineField({
      name: "status",
      type: "string",
      initialValue: "draft",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Active", value: "active" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── Product type (physical / digital) ────────────────────
    defineField({
      name: "type",
      title: "Product Type",
      type: "string",
      initialValue: "physical",
      options: {
        list: [
          { title: "Physical", value: "physical" },
          { title: "Digital", value: "digital" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    // Digital delivery fields (shown when type === "digital")
    defineField({
      name: "digitalFile",
      title: "Digital File",
      type: "file",
      hidden: ({ parent }) => parent?.type !== "digital",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = (context as { parent?: { type?: string } })?.parent;
          if (parent?.type !== "digital") return true;
          return value
            ? true
            : "Upload the digital file delivered to customers";
        }),
    }),
    defineField({
      name: "downloadLimit",
      title: "Download Limit",
      type: "number",
      initialValue: 5,
      hidden: ({ parent }) => parent?.type !== "digital",
      description: "Max downloads per order. Overrides StoreSettings default.",
      validation: (Rule) => Rule.integer().min(1),
    }),
    defineField({
      name: "downloadExpiryDays",
      title: "Download Link Expiry (days)",
      type: "number",
      initialValue: 30,
      hidden: ({ parent }) => parent?.type !== "digital",
      description:
        "Days the customer's download link stays active for after purchase. Overrides StoreSettings default.",
      validation: (Rule) => Rule.integer().min(1),
    }),

    // ── Variants / simple pricing (physical only)
    defineField({
      name: "hasVariants",
      title: "Has Variants?",
      type: "boolean",
      initialValue: false,
      // Digital products have no variants — a digital file is one item
      hidden: ({ parent }) => parent?.type === "digital",
      description:
        "Turn on if this product comes in different options like sizes or colors.",
    }),

    // Simple pricing (shown when digital OR physical with no variants)
    defineField({
      name: "priceNGN",
      title: "Price (NGN)",
      type: "number",
      hidden: ({ parent }) =>
        parent?.hasVariants === true && parent?.type !== "digital",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = (
            context as { parent?: { hasVariants?: boolean; type?: string } }
          )?.parent;
          // Skip for variable physical products — price lives on each variant
          if (parent?.hasVariants === true && parent?.type !== "digital")
            return true;
          if (value === undefined || value === null) return "Price is required";
          return value >= 0 || "Price must be ≥ 0";
        }),
    }),
    defineField({
      name: "compareAtPriceNGN",
      title: "Compare-at Price (NGN)",
      type: "number",
      description:
        "Original price for strikethrough/sale display. Leave empty if not on sale.",
      hidden: ({ parent }) =>
        parent?.hasVariants === true && parent?.type !== "digital",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "stock",
      type: "number",
      initialValue: 0,
      hidden: ({ parent }) =>
        parent?.hasVariants === true && parent?.type !== "digital",
      validation: (Rule) => Rule.integer().min(0),
    }),

    // Variable product fields (shown when physical AND hasVariants is true)
    defineField({
      name: "options",
      title: "Option Types",
      type: "array",
      hidden: ({ parent }) =>
        parent?.hasVariants !== true || parent?.type === "digital",
      description:
        "Define the options customers can choose from. For example, add an option called 'Size' with values Small, Medium, Large. You can add up to three option types.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = (
            context as { parent?: { hasVariants?: boolean; type?: string } }
          )?.parent;
          if (parent?.hasVariants !== true || parent?.type === "digital")
            return true;
          if (!Array.isArray(value) || value.length === 0)
            return "Add at least one option type, like Size or Color";
          if (value.length > 3) return "You can have at most 3 option types";
          return true;
        }),
      of: [
        defineArrayMember({
          type: "object",
          name: "productOption",
          fields: [
            defineField({
              name: "name",
              title: "Option Name",
              type: "string",
              description: "The name of this option, like 'Size' or 'Color'.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "values",
              title: "Option Values",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              description:
                "The choices customers can pick from. For a Size option, you might add Small, Medium, Large.",
              validation: (Rule) => Rule.required().min(1).unique(),
            }),
          ],
          preview: {
            select: { name: "name", values: "values" },
            prepare: ({ name, values }) => ({
              title: name || "Option",
              subtitle: Array.isArray(values) ? values.join(", ") : "",
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "variants",
      type: "array",
      hidden: ({ parent }) =>
        parent?.hasVariants !== true || parent?.type === "digital",
      description:
        "Add a row for every combination of the Option Types above. For example, if Size is Small/Medium and Color is Red/Blue, add four variants.",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = (
            context as { parent?: { hasVariants?: boolean; type?: string } }
          )?.parent;
          if (parent?.hasVariants !== true || parent?.type === "digital")
            return true;
          return (
            (Array.isArray(value) && value.length > 0) ||
            "Add at least one variant"
          );
        }),
      of: [
        defineArrayMember({
          type: "object",
          name: "productVariant",
          fields: [
            defineField({
              name: "title",
              type: "string",
              description:
                'A clear display label for this variant, for example "Small / Red".',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "optionValues",
              title: "Option Values",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              description:
                "Enter the values for this variant in the same order as the Option Types above. Example: if Option Types are Size then Color, enter 'Small' then 'Red'.",
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const values = value as string[] | undefined;
                  if (!Array.isArray(values) || values.length === 0)
                    return "Option values are required";

                  const doc = context.document as
                    | {
                        options?: Array<{
                          name?: string;
                          values?: string[];
                        }>;
                      }
                    | undefined;
                  const productOptions = doc?.options;

                  if (
                    !Array.isArray(productOptions) ||
                    productOptions.length === 0
                  )
                    return "Define Option Types above first";

                  if (values.length !== productOptions.length)
                    return `Expected ${productOptions.length} value${
                      productOptions.length === 1 ? "" : "s"
                    } (one per Option Type), got ${values.length}`;

                  for (let i = 0; i < values.length; i++) {
                    const opt = productOptions[i];
                    const declared = opt?.values ?? [];
                    const optName = opt?.name || `Option ${i + 1}`;
                    if (!declared.includes(values[i]))
                      return `"${values[i]}" is not a value of ${optName}. Allowed: ${declared.join(", ")}`;
                  }
                  return true;
                }),
            }),
            defineField({
              name: "priceNGN",
              title: "Price (NGN)",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: "compareAtPriceNGN",
              title: "Compare-at Price (NGN)",
              type: "number",
              validation: (Rule) => Rule.min(0),
            }),
            defineField({
              name: "stock",
              type: "number",
              initialValue: 0,
              validation: (Rule) => Rule.integer().min(0),
            }),
            defineField({
              name: "image",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: {
              title: "title",
              optionValues: "optionValues",
              price: "priceNGN",
              stock: "stock",
              media: "image",
            },
            prepare: ({ title, optionValues, price, stock, media }) => {
              const label =
                title ||
                (Array.isArray(optionValues)
                  ? optionValues.join(" / ")
                  : "Variant");
              return {
                title: label,
                subtitle: `₦${price ?? "?"} • stock ${stock ?? 0}`,
                media,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      kind: "type",
      price: "priceNGN",
      img: "images",
      hasVariants: "hasVariants",
      variants: "variants",
    },
    prepare: ({ title, status, kind: type, price, img, hasVariants, variants }) => {
      const variantCount = Array.isArray(variants) ? variants.length : 0;
      const bits = [
        type === "digital" ? "Digital" : "Physical",
        type !== "digital" && hasVariants === true
          ? `${variantCount} variants`
          : price !== undefined && price !== null
            ? `₦${price}`
            : null,
        status,
      ].filter(Boolean);
      return { title, subtitle: bits.join(" • "), media: img?.[0] };
    },
  },
});
