/**
 * Canonical site URL, used for metadataBase, OG tags, sitemap and robots.
 * Set NEXT_PUBLIC_SITE_URL in production to your custom domain.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  // Render sets this automatically for web services.
  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL.replace(/\/+$/, "");
  }

  // Vercel sets a bare host, no protocol.
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return "http://localhost:3000";
}
