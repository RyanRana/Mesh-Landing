import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ This disables /app and uses /pages routing
  experimental: {
    appDir: false,
  },
};

export default nextConfig;
