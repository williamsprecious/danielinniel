import { defineArrayMember, defineField, defineType } from "sanity";
import { BillIcon } from "@sanity/icons";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BillIcon,
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order Number",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      type: "string",
      initialValue: "confirmed", // "Confirmed" by default since the order document would be created upon a payment success webhook event.
      options: {
        list: [
          { title: "Confirmed", value: "confirmed" },
          { title: "Processing", value: "processing" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
          { title: "Refunded", value: "refunded" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── Customer ─────────────────────────────────────────────
    defineField({
      name: "customer",
      type: "object",
      readOnly: true,
      fields: [
        defineField({
          name: "firstName",
          title: "First Name",
          type: "string",
          validation: (Rule) => Rule.required().max(60),
        }),
        defineField({
          name: "lastName",
          title: "Last Name",
          type: "string",
          validation: (Rule) => Rule.required().max(60),
        }),
        defineField({
          name: "email",
          type: "string",
          validation: (Rule) => Rule.required().email(),
        }),
        defineField({ name: "phone", type: "string" }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "address",
      readOnly: true,
    }),
    defineField({
      name: "billingAddress",
      title: "Billing Address",
      type: "address",
      readOnly: true,
    }),

    // ── Items ────────────────────────────────────────────────
    defineField({
      name: "items",
      type: "array",
      readOnly: true,
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          name: "orderItem",
          fields: [
            defineField({
              name: "product",
              type: "reference",
              to: [{ type: "product" }],
              description:
                "Reference to the source product. May be null if the product is later deleted.",
            }),
            defineField({
              name: "variantKey",
              type: "string",
              description: "_key of the chosen variant, if any.",
            }),
            defineField({
              name: "title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "variantTitle", type: "string" }),
            defineField({
              name: "type",
              title: "Product Type",
              type: "string",
              options: {
                list: [
                  { title: "Physical", value: "physical" },
                  { title: "Digital", value: "digital" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "image", type: "image" }),
            defineField({
              name: "unitPrice",
              title: "Unit Price",
              type: "number",
              description:
                "Per-unit price snapshotted at order creation, in the order's currency (see parent order's 'currency' field).",
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: "quantity",
              type: "number",
              validation: (Rule) => Rule.required().integer().min(1),
            }),
            defineField({
              name: "lineTotal",
              title: "Line Total",
              type: "number",
              description:
                "Line total snapshotted at order creation, in the order's currency (see parent order's 'currency' field).",
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
          preview: {
            select: {
              title: "title",
              variant: "variantTitle",
              qty: "quantity",
              total: "lineTotal",
              media: "image",
            },
            prepare: ({ title, variant, qty, total, media }) => ({
              title: variant ? `${title} — ${variant}` : title,
              subtitle: `×${qty} • ₦${total}`,
              media,
            }),
          },
        }),
      ],
    }),

    // ── Totals ───────────────────────────────────────────────
    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
      readOnly: true,
      description:
        "Items subtotal snapshotted at order creation, in the order's currency (see 'currency' field).",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "shippingFee",
      title: "Shipping Fee",
      type: "number",
      readOnly: true,
      description:
        "Shipping fee snapshotted at order creation, in the order's currency (see 'currency' field). For NGN-settled orders this equals the matching shipping zone's feeNGN. 0 means free.",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "total",
      title: "Total",
      type: "number",
      readOnly: true,
      description:
        "Order grand total snapshotted at order creation, in the order's currency (see 'currency' field).",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "NGN",
      readOnly: true,
      description:
        "The currency the customer used at checkout. Settlement is always NGN.",
    }),
    defineField({
      name: "rateToNaira",
      title: "Rate to Naira",
      type: "number",
      readOnly: true,
      description:
        "Exchange rate locked at checkout — how many Naira equals 1 unit of the order currency at the time of order.",
    }),

    // ── Payment ──────────────────────────────────────────────
    defineField({
      name: "payment",
      type: "object",
      fields: [
        defineField({
          name: "provider",
          title: "Payment Provider",
          type: "string",
          readOnly: true,
          initialValue: "paystack",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "reference",
          type: "string",
          readOnly: true,
          description: "Provider transaction reference.",
        }),
        defineField({
          name: "amountNGN",
          title: "Amount (NGN)",
          type: "number",
          readOnly: true,
          validation: (Rule) => Rule.min(0),
        }),
        defineField({
          name: "paidAt",
          title: "Paid At",
          type: "datetime",
          readOnly: true,
        }),
        defineField({
          name: "gatewayResponse",
          title: "Gateway Response",
          type: "text",
          readOnly: true,
          rows: 4,
          description: "Raw gateway message / debug payload.",
        }),
      ],
    }),

    // ── Fulfillment (admin-only, optional) ───────────────────
    defineField({
      name: "fulfillment",
      title: "Fulfillment",
      type: "object",
      description:
        "Optional. Fill in once the order has been shipped so the team can track delivery later.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "carrier", title: "Carrier", type: "string" }),
        defineField({
          name: "trackingNumber",
          title: "Tracking Number",
          type: "string",
        }),
        defineField({
          name: "trackingUrl",
          title: "Tracking URL",
          type: "url",
        }),
        defineField({
          name: "shippedAt",
          title: "Shipped At",
          type: "datetime",
        }),
        defineField({
          name: "deliveredAt",
          title: "Delivered At",
          type: "datetime",
        }),
      ],
    }),

    defineField({
      name: "adminNotes",
      title: "Admin Notes",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Newest",
      name: "newestFirst",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "Status",
      name: "byStatus",
      by: [{ field: "status", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      orderNumber: "orderNumber",
      status: "status",
      firstName: "customer.firstName",
      lastName: "customer.lastName",
      total: "total",
      shipping: "shippingFee",
      createdAt: "createdAt",
    },
    prepare: ({
      orderNumber,
      status,
      firstName,
      lastName,
      total,
      shipping,
      createdAt,
    }) => {
      const name = [firstName, lastName].filter(Boolean).join(" ");
      const shippingSegment =
        typeof shipping === "number"
          ? ` (ship ${shipping === 0 ? "Free" : `₦${shipping.toLocaleString()}`})`
          : "";
      return {
        title: `${orderNumber || "Order"} • ${name || "Guest"}`,
        subtitle: `${status} • ₦${total ?? 0}${shippingSegment}${
          createdAt ? ` • ${new Date(createdAt).toLocaleDateString()}` : ""
        }`,
      };
    },
  },
});
