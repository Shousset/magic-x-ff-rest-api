import path from 'node:path';
import type { NextConfig } from 'next';

const nestApiOrigin = (
  process.env.NEST_API_ORIGIN ?? 'http://localhost:3002'
).replace(/\/$/, '');

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cards.scryfall.io',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const apiPaths = [
      '/auth',
      '/cards',
      '/card-types',
      '/collections',
      '/rarities',
      '/users',
    ];

    return apiPaths.flatMap((apiPath) => [
      {
        source: apiPath,
        destination: `${nestApiOrigin}${apiPath}`,
      },
      {
        source: `${apiPath}/:path*`,
        destination: `${nestApiOrigin}${apiPath}/:path*`,
      },
    ]);
  },
};

export default nextConfig;
