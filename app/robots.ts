import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/photos",
        "/photo",
        "/photographers",
        /**
         * `Disallow: /app` below is a prefix match, so it also swallows
         * /apple-icon.png (app/apple-icon.png). Crawlers resolve conflicts by
         * longest match, and this rule is longer than "/app", so the icon stays
         * fetchable. An explicit Allow is used rather than "/app$" because the
         * `$` anchor is a Google/Bing extension, not part of the standard.
         */
        "/apple-icon.png",
      ],
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
