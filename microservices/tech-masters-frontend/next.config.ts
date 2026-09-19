import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.trycloudflare.com", "localhost:3000"],
  async rewrites() {
    return [
      {
        source: "/api/ads/:path*",
        destination: "http://localhost:4000/api/ads/:path*",
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
