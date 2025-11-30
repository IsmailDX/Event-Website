import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // allow cache
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // add this to avoid unnecessary re-renders and make components
  // faster without you manually sprinkling memoization hooks everywhere.
  // reactCompiler: true,

  // for faster builds in development mode
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ];
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
