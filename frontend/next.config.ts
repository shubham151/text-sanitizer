import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // API routes are handled in src/app/api/...
  allowedDevOrigins: ['192.168.1.100'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
