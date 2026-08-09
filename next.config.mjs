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
