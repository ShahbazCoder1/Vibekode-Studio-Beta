import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
    {
      protocol: 'https',
      hostname: 'lh3.googleusercontent.com',
    },
  ],
  },
  // Enable experimental features for better SEO
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Remove static export as it conflicts with dynamic features
  trailingSlash: false,
  // Compress responses for better performance
  compress: true,
  // Add security headers
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  // Redirects for SEO
  redirects: async () => {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
