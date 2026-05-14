import { defineQuery } from "next-sanity";
import { sanityFetch } from "../lib/live";

const FEATURE_QUERY = defineQuery(
  `*[_type == "featured"] | order(_createdAt desc){ _id, title, image, workUrl }`
);

export const GALLERY_QUERY = defineQuery(`
    *[_type == "gallery" && category == $category &&
      ($filterParam == null ||
       (category == "cover-art" && grade == $filterParam) ||
       (category == "concept-and-design" && conceptType == $filterParam))
    ] | order(createdAt desc) [$start...$end] {
      _id,
      galleryType,
      videoType,
      category,
      conceptType,
      grade,
      image {
        asset-> {
          _id,
          url,
          metadata {
            lqip,
            dimensions
          }
        }
      },
      description,
      videoUrl,
      video {
        asset-> {
          _id,
          url,
          mimeType
        }
      },
      videoPreview {
        asset-> {
          _id,
          url,
          mimeType
        }
      },
      createdAt
    }
  `);

export const GALLERY_COUNT_QUERY = defineQuery(`
    count(*[_type == "gallery" && category == $category &&
      ($filterParam == null ||
       (category == "cover-art" && grade == $filterParam) ||
       (category == "concept-and-design" && conceptType == $filterParam))
    ])
  `);

export const getFeaturedWorks = async () => {
  try {
    const { data } = await sanityFetch({ query: FEATURE_QUERY });

    return data ?? [];
  } catch (error) {
    console.log("Error fetching featured works data", error);
    return [];
  }
};
