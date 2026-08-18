import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { listAllPublicForSitemap } from "@/lib/queries/public";

/** Rebuilt hourly so new photos and photographers get indexed on their own. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/photos`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/photographers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  try {
    const { photos, photographers, categories } =
      await listAllPublicForSitemap();

    categories.forEach((category) => {
      entries.push({
        url: `${base}/photos/${category.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });

    photographers.forEach((photographer) => {
      entries.push({
        url: `${base}/photographers/${photographer.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });

    photos.forEach((photo) => {
      entries.push({
        url: `${base}/photo/${photo.slug}`,
        lastModified: photo.updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    });
  } catch {
    // A database hiccup shouldn't produce a broken sitemap — serve the
    // static entries rather than a 500.
  }

  return entries;
}
