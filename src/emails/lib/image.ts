/**
 * Email-local Sanity image URL builder.
 *
 * Mirrors `src/sanity/lib/image.ts` but reads project/dataset from the
 * environment WITHOUT the hard assertion in `@/sanity/env`. The React Email
 * preview server (`npm run email`) doesn't load `.env.local`, and importing the
 * asserting module would throw at module-load time and break the preview — even
 * though thumbnails aren't rendered there (preview items have no asset ref).
 */
import { createImageUrlBuilder, SanityImageSource } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "";

const builder = createImageUrlBuilder({ projectId, dataset });

export const emailImageUrl = (source: SanityImageSource) =>
  builder.image(source);
