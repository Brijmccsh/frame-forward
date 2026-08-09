/** @type {import('next').NextConfig} */
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    /**
     * Nothing on the site renders wider than ~1200 CSS px, so the default
     * 1920/2048/3840 breakpoints only ever cost work. Trimming them means
     * fewer variants to generate — this app runs on a small instance where
     * a burst of image optimizations is the main memory risk.
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
    // Optimized output is regenerated on every cold start (ephemeral disk),
    // so keep it in the browser cache for a good while.
    minimumCacheTTL: 60 * 60 * 24 * 30,
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
