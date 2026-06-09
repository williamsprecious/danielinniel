"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/admin/studio` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const SINGLETON_TYPES = new Set(["storeSettings"]);
const SINGLETON_BLOCKED_ACTIONS = new Set([
  "delete",
  "duplicate",
  "unpublish",
]);

export default defineConfig({
  basePath: "/admin/studio",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter(
            ({ action }) => !action || !SINGLETON_BLOCKED_ACTIONS.has(action)
          )
        : prev,
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((tpl) => !SINGLETON_TYPES.has(tpl.templateId))
        : prev,
  },
});
