import { defineField, defineType } from "sanity";
import { PinIcon } from "@sanity/icons";

export const addressType = defineType({
  name: "address",
  title: "Address",
  type: "object",
  icon: PinIcon,
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
      name: "line1",
      title: "Address Line 1",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "line2",
      title: "Address Line 2 (optional)",
      type: "string",
    }),
    defineField({
      name: "city",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "state",
      title: "State / Region",
      type: "string",
      description:
        "State or province. Optional — only applies to countries that use regional administrative divisions (e.g. NG, US, CA). United Kingdom orders have no state.",
    }),
    defineField({
      name: "postalCode",
      title: "Postal Code",
      type: "string",
    }),
    defineField({
      name: "country",
      type: "string",
      initialValue: "Nigeria",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      type: "string",
    }),
  ],
  preview: {
    select: {
      firstName: "firstName",
      lastName: "lastName",
      city: "city",
      country: "country",
    },
    prepare: ({ firstName, lastName, city, country }) => {
      const name = [firstName, lastName].filter(Boolean).join(" ");
      return {
        title: name || "Unnamed",
        subtitle: [city, country].filter(Boolean).join(", "),
      };
    },
  },
});
