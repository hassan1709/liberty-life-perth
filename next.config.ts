import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/studio/:path*",
        headers: [
          { key: "X-Frame-Options", value: "ALLOW-FROM https://www.sanity.io" },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://www.sanity.io",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
