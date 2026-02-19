import { defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons";

export const galleryType = defineType({
  name: "gallery",
  title: "Gallery",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "galleryType",
      title: "Gallery Type",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "image",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
      },
    }),
    defineField({
      name: "videoType",
      title: "Video Type",
      type: "string",
      hidden: ({ parent }) => parent?.galleryType !== "video",
      options: {
        list: [
          { title: "Video URL", value: "url" },
          { title: "Video File", value: "file" },
        ],
        layout: "radio",
      },
      initialValue: "url",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "cover-art",
      options: {
        list: [
          { title: "Concept & Design", value: "concept-and-design" },
          { title: "Cover Art", value: "cover-art" },
        ],
      },
    }),
    defineField({
      name: "conceptType",
      title: "Concept Type",
      type: "string",
      hidden: ({ parent }) => parent?.category !== "concept-and-design",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = (context as { parent?: { category?: string } })
            ?.parent;
          if (parent?.category === "concept-and-design" && !value) {
            return "Concept type is required when category is Concept & Design";
          }
          return true;
        }),
      options: {
        list: [
          { title: "Concept Art", value: "concept-art" },
          { title: "Logo", value: "logo" },
          { title: "Character Design", value: "character-design" },
          { title: "Fashion Illustration", value: "fashion-illustration" },
        ],
      },
    }),
    defineField({
      name: "grade",
      type: "string",
      hidden: ({ parent }) => parent?.category !== "cover-art",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = (context as { parent?: { category?: string } })
            ?.parent;
          if (parent?.category === "cover-art" && !value) {
            return "Grade is required when category is Cover Art";
          }
          return true;
        }),
      options: {
        list: [
          { title: "Essential", value: "essential" },
          { title: "Advanced", value: "advanced" },
        ],
      },
    }),
    defineField({
      name: "image",
      type: "image",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = (
            context as { parent?: { galleryType?: string; videoType?: string } }
          )?.parent;
          const galleryType = parent?.galleryType;
          const videoType = parent?.videoType;

          const isFileVideo = galleryType === "video" && videoType === "file";

          // For file-based videos, image is optional
          if (isFileVideo) {
            return true;
          }

          // For non-video items and URL-based videos, image is required
          return value
            ? true
            : "Image is required for this gallery item (except file-based videos)";
        }),
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "description",
      title: "Description (optional)",
      type: "string",
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL (Youtube or Vimeo)",
      type: "url",
      hidden: ({ parent }) =>
        parent?.galleryType !== "video" || parent?.videoType !== "url",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https", "youtube", "vimeo"],
        }).custom((value, context) => {
          const parent = (
            context as { parent?: { galleryType?: string; videoType?: string } }
          )?.parent;
          if (
            parent?.galleryType === "video" &&
            parent?.videoType === "url" &&
            !value
          ) {
            return "Video URL is required when gallery type is Video and video type is URL";
          }
          return true;
        }),
    }),
    defineField({
      name: "video",
      title: "Video File (Full video)",
      type: "file",
      hidden: ({ parent }) =>
        parent?.galleryType !== "video" || parent?.videoType !== "file",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = (
            context as { parent?: { galleryType?: string; videoType?: string } }
          )?.parent;
          if (
            parent?.galleryType === "video" &&
            parent?.videoType === "file" &&
            !value
          ) {
            return "Full video file is required when gallery type is Video and video type is File";
          }
          return true;
        }),
      options: {
        accept: "video/*",
      },
    }),
    defineField({
      name: "videoPreview",
      title: "Video Preview (A shorter version of the video)",
      type: "file",
      hidden: ({ parent }) =>
        parent?.galleryType !== "video" || parent?.videoType !== "file",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = (
            context as { parent?: { galleryType?: string; videoType?: string } }
          )?.parent;
          if (
            parent?.galleryType === "video" &&
            parent?.videoType === "file" &&
            !value
          ) {
            return "Video preview file is required when gallery type is Video and video type is File";
          }
          return true;
        }),
      options: {
        accept: "video/*",
      },
    }),
    defineField({
      name: "createdAt",
      title: "Creation Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      category: "category",
      grade: "grade",
      conceptType: "conceptType",
      media: "image",
      description: "description",
    },
    prepare({ category, grade, conceptType, media, description }) {
      // Format category: remove dashes and capitalize words
      const categoryMap: Record<string, string> = {
        "cover-art": "Cover Art",
        "concept-and-design": "Concept & Design",
      };

      const formattedCategory = category
        ? categoryMap[category] ||
          category
            .split("-")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : "";

      // Get the secondary value based on category
      let secondaryValue = "";
      if (category === "cover-art" && grade) {
        // Format grade: capitalize first letter
        secondaryValue = grade.charAt(0).toUpperCase() + grade.slice(1);
      } else if (category === "concept-and-design" && conceptType) {
        // Format conceptType: capitalize words
        secondaryValue = conceptType
          .split("-")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      // Build title: category + secondary value (if exists)
      const title = secondaryValue
        ? `${formattedCategory} (${secondaryValue})`
        : formattedCategory;

      return {
        title,
        media,
        subtitle: description || "",
      };
    },
  },
});
