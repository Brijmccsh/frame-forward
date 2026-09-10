/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    /**
     * Every next/image URL is built by lib/supabase/image-loader.ts, so the
     * browser fetches photos straight from Supabase's CDN and this server never
     * touches the bytes. The built-in optimizer was the main memory risk on
     * this small instance, and crawlers alone were enough to trip it.
     *
     * A custom loader switches the optimizer off entirely — /_next/image
     * returns 404 — so remotePatterns, formats and minimumCacheTTL are gone
     * too: only the optimizer read them.
     */
    loader: "custom",
    loaderFile: "./lib/supabase/image-loader.ts",
    /**
     * Nothing on the site renders wider than ~1200 CSS px, so the default
     * 1920/2048/3840 breakpoints only ever cost work. These still decide which
     * widths the loader is asked for, which matters once Supabase transforms
     * are switched on.
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async rewrites() {
    return [
      // The brand mark lives at app/icon.png; clients that request the
      // conventional /favicon.ico path get the same image.
      { source: "/favicon.ico", destination: "/icon.png" },
    ];
  },
};

export default nextConfig;
