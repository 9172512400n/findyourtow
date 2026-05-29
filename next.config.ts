import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "findyourtow.vercel.app",
          },
        ],
        destination: "https://roadassistnow.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
