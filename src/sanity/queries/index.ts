import { defineQuery } from "next-sanity";
import { sanityFetch } from "../lib/live";
import { productImageFields } from "./fragments";

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

export const CATEGORY_ID_BY_SLUG_QUERY = defineQuery(/* groq */ `
    *[_type == "category" && slug.current == $slug][0]._id
  `);

export const PRODUCT_LIST_QUERY = defineQuery(/* groq */ `
    *[_type == "product" && status == "active"
      && ($categoryId == null || references($categoryId))
    ] | order(_createdAt desc) [$start...$end] {
      _id,
      title,
      "slug": slug.current,
      type,
      hasVariants,
      priceNGN,
      compareAtPriceNGN,
      "image": images[0]{ ${productImageFields} },
      variants[]{ priceNGN, compareAtPriceNGN }
    }
  `);

export const PRODUCT_LIST_COUNT_QUERY = defineQuery(/* groq */ `
    count(*[_type == "product" && status == "active"
      && ($categoryId == null || references($categoryId))
    ])
  `);

export const PRODUCT_BY_SLUG_QUERY = defineQuery(/* groq */ `
    *[_type == "product" && status == "active" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      shortDescription,
      description,
      type,
      hasVariants,
      priceNGN,
      compareAtPriceNGN,
      stock,
      shipping,
      specifications[]{ label, value },
      "images": images[]{ ${productImageFields} },
      "categories": categories[]->{ _id, title, "slug": slug.current },
      options[]{ name, values },
      variants[]{
        _key,
        title,
        optionValues,
        priceNGN,
        compareAtPriceNGN,
        stock
      }
    }
  `);

export const ACTIVE_CATEGORIES_QUERY = defineQuery(`
    *[_type == "category" && visibility == "active"]
      | order(coalesce(displayOrder, 9999) asc, title asc) {
      _id,
      title,
      "slug": slug.current
    }
  `);

export const ACTIVE_PRODUCT_SLUGS_QUERY = defineQuery(`
    *[_type == "product" && status == "active" && defined(slug.current)]{
      "slug": slug.current
    }
  `);

export const STORE_SETTINGS_QUERY = defineQuery(`
    *[_id == "storeSettings"][0]{
      baseCurrency,
      ratesToNGN[]{ code, rate },
      ratesUpdatedAt
    }
  `);

export const getStoreSettings = async () => {
  try {
    const { data } = await sanityFetch({ query: STORE_SETTINGS_QUERY });
    return data ?? null;
  } catch (error) {
    console.log("Error fetching store settings", error);
    return null;
  }
};
