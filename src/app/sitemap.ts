import type { MetadataRoute } from "next";
import { expectedDesignParams, expectedGradeParams } from "@/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const gradeEnteries: MetadataRoute.Sitemap = expectedGradeParams.map(
    (grade) => ({
      url: `https://danielinniel.com/cover-art/${grade.value}`,
      changeFrequency: "monthly",
      priority: 0.9,
    })
  );

  const designEnteries: MetadataRoute.Sitemap = expectedDesignParams.map(
    (design) => ({
      url: `https://danielinniel.com/design/${design.value}`,
      changeFrequency: "monthly",
      priority: 0.9,
    })
  );

  return [
    {
      url: "https://danielinniel.com",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://danielinniel.com/works",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://danielinniel.com/shop",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://danielinniel.com/about",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://danielinniel.com/cover-art",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...gradeEnteries,
    ...designEnteries,
  ];
}
