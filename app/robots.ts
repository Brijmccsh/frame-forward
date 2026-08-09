import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Everything behind auth — no value in crawling, and it all redirects.
      disallow: ["/app", "/browse", "/profile", "/requests", "/onboarding", "/u", "/home", "/login"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
