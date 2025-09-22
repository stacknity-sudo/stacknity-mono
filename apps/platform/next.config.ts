import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  // Modern approach: Use optimizePackageImports for automatic tree-shaking
  // This transforms barrel imports to direct imports at build time
  experimental: {
    optimizePackageImports: [
      "@stacknity/shared-ui",
      "@stacknity/shared-utils",
      "@stacknity/shared-theme",
      "react-icons", // Also optimize react-icons imports
    ],
  },

  // Enable React 19 features
  reactStrictMode: true,

  // Additional performance optimizations
  compiler: {
    // Remove console.logs in production
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Transpile internal packages so CSS modules & TS compile correctly
  transpilePackages: ["@stacknity/shared-ui", "@stacknity/shared-theme"],

  // (webpack config removed to avoid Turbopack warning; rely on defaults)
  // swcMinify deprecated under Turbopack path; removed.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

// Bundle analyzer for production performance measurement
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default bundleAnalyzer(nextConfig);
