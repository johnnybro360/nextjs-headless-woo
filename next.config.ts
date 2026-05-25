import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.68.52'],
  images: {
    // remotePatterns: [
    //   {
    //     protocol: "http",
    //     hostname: "headless-woo.local",
    //     pathname: "/wp-content/uploads/**",
    //   },
    // ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
