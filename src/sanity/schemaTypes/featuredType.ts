import { ProjectsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const featuredType = defineType({
  name: "featured",
  title: "Featured",
  type: "document",
  icon: ProjectsIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .max(30)
          .warning("Your title shouldn't be more than 30 characters."),
    }),
    defineField({
      name: "image",
      type: "image",
      validation: (Rule) => Rule.required(),
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "workUrl",
      title: "Work URL (optional)",
      type: "url",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
        }).warning("Only valid URLs will work properly."),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
});
