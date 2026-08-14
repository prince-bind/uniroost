import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal .next/standalone folder with only the files needed
  // to run the app -- what the Docker image copies into the runner stage.
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
