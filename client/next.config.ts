import type { NextConfig } from "next";

const nextConfig: any = {
  typedRoutes: false,

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'academy-api-863772349164.asia-southeast1.run.app',
      },
      {
        protocol: 'https',
        hostname: 'academy-api-beta-863772349164.asia-southeast1.run.app',
      },
      {
        protocol: 'https',
        hostname: 'pub-d4a95eabdf153f73125f66e4c1557ab7.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'pub-84306d90a5714d098ed77c04f4c85df2.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'thelab.tulie.vn',
      },
      {
        protocol: 'https',
        hostname: 'beta.thelab.tulie.vn',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      }
    ],
  },
  async rewrites() {
    // Proxy /api to backend (Cloud Run or Localhost)
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

    // Defensive: strip /api if it was accidentally included in the env var
    // Standardize: Remove trailing slashes and /api suffix
    apiUrl = apiUrl.replace(/\/+$/, '').replace(/\/api$/, '');

    return [
      {
        source: '/uploads/:path*',
        destination: `${apiUrl}/uploads/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: '/socket.io/:path*',
        destination: `${apiUrl}/socket.io/:path*`,
      },
    ];
  },
  output: 'standalone',
};

export default nextConfig;

