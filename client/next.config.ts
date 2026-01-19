import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: false,
  },

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
        hostname: 'academy-api-qcmix2qxca-as.a.run.app',
      },
      {
        protocol: 'https',
        hostname: 'academy-api-beta-qcmix2qxca-as.a.run.app',
      },
      {
        protocol: 'https',
        hostname: 'pub-d4a95eabdf153f73125f66e4c1557ab7.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'thelab.tulie.vn',
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
        protocol: 'https',
        hostname: 'img.youtube.com',
      }
    ],
  },
  async rewrites() {
    // Proxy /api to backend (Cloud Run or Localhost)
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

    // Defensive: strip /api if it was accidentally included in the env var
    if (apiUrl.endsWith('/api')) {
      apiUrl = apiUrl.slice(0, -4);
    }
    // Remove trailing slash
    apiUrl = apiUrl.replace(/\/$/, '');

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

// Forced restart trigger: 1

