import type { NextConfig } from "next";

const nextConfig: any = {
  typescript: {
    ignoreBuildErrors: true, // Required: Excalidraw v0.18 and Mantine v8 have type export issues with TS5+
  },
  eslint: {
    ignoreDuringBuilds: true, // Speed up Docker builds - lint is run separately in CI
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
        hostname: 'thelab.tulie.vn',
      },
      {
        protocol: 'https',
        hostname: 'betathelab.tulie.vn',
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
    // Proxy /api to backend
    // In production on VPS, Nginx handles this. In dev, proxy to local backend.
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

    // Defensive: strip /api if it was accidentally included in the env var
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
  reactCompiler: true,
  output: 'standalone',
};

export default nextConfig;
