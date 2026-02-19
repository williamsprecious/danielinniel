import { type SchemaTypeDefinition } from "sanity";

import { featuredType } from "./featuredType";
import { galleryType } from "./galleryType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [featuredType, galleryType],
};
