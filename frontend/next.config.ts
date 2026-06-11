import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'http://43.157.248.229:8080/:path*',
      },
    ]
  },
  serverActions: {
    bodySizeLimit: '10mb',
  },
  allowedDevOrigins: ['192.168.100.195', 'localhost'],
};

export default nextConfig;
