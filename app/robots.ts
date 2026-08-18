import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/photos", "/photo", "/photographers"],
      // Behind auth: no value in crawling, and it all redirects to /login.
      disallow: [
        "/app",
        "/browse",
        "/profile",
        "/requests",
        "/onboarding",
        "/pending",
        "/admin",
        "/u",
        "/home",
        "/login",
      ],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
