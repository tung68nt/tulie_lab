import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
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
        hostname: 'pub-d4a95eabdf153f73125f66e4c1557ab7.r2.dev',
      }
    ],
  },
  async rewrites() {
    // Proxy /api to backend (Cloud Run or Localhost)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

    return [
      {
        source: '/uploads/:path*',
        destination: `${apiUrl}/uploads/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  output: 'standalone',
};

export default nextConfig;
