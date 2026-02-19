import { defineQuery } from "next-sanity";
import { sanityFetch } from "../lib/live";

const FEATURE_QUERY = defineQuery(
  `*[_type == "featured"] | order(_createdAt desc){ _id, title, image, workUrl }`
);

export const getFeaturedWorks = async () => {
  try {
    const { data } = await sanityFetch({ query: FEATURE_QUERY });

    return data ?? [];
  } catch (error) {
    console.log("Error fetching featured works data", error);
    return [];
  }
};
