import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  // Modern approach: Use optimizePackageImports instead of barrel exports
  experimental: {
    optimizePackageImports: ["@stacknity/shared-ui", "@stacknity/shared-utils"],
  },
  // Enable React 19 features
  reactStrictMode: true,
  // Enable new Next.js 15 features
  turbopack: {
    // Enable advanced optimizations
  },
};

// Bundle analyzer for production performance measurement
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default bundleAnalyzer(nextConfig);
