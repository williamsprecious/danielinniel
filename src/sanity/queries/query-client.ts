import { defineQuery } from "next-sanity";
import { client } from "../lib/client";
import { GALLERY_QUERYResult } from "../../../sanity.types";

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

export interface GalleryData {
  items: GALLERY_QUERYResult;
  totalCount: number;
  hasMore: boolean;
}

export const getGalleryData = async (
  category: string,
  filterParam?: string,
  start: number = 0,
  limit: number = 12
): Promise<GalleryData> => {
  try {
    const [items, totalCount] = await Promise.all([
      client.fetch(GALLERY_QUERY, {
        category,
        filterParam: filterParam || null,
        start,
        end: start + limit,
      }),
      client.fetch(GALLERY_COUNT_QUERY, {
        category,
        filterParam: filterParam || null,
      }),
    ]);

    const hasMore = start + limit < totalCount;

    return {
      items: items ?? [],
      totalCount: totalCount ?? 0,
      hasMore,
    };
  } catch (error) {
    console.error("Error fetching gallery data:", error);
    return {
      items: [],
      totalCount: 0,
      hasMore: false,
    };
  }
};
