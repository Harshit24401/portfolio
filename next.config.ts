import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tests set NEXT_DIST_DIR so their dev server doesn't share .next with yours.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  cacheComponents: true,
  partialPrefetching: true,
  // Album covers for the Spotify card.
  images: { remotePatterns: [{ protocol: 'https', hostname: 'i.scdn.co' }] },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
