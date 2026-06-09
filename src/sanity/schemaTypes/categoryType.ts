import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      description:
        "Lower numbers appear first in storefront nav. Leave empty to sort alphabetically.",
    }),
    defineField({
      name: "visibility",
      type: "string",
      initialValue: "active",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Hidden", value: "hidden" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      subtitle: "description",
      visibility: "visibility",
    },
    prepare: ({ title, media, subtitle, visibility }) => ({
      title,
      media,
      subtitle:
        visibility === "hidden"
          ? `Hidden${subtitle ? ` — ${subtitle}` : ""}`
          : subtitle,
    }),
  },
});
