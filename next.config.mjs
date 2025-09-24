/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Optimize common packages to reduce client bundle size
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
  headers: async () => {
    return [
      {
        // Aggressive caching for built JS and CSS assets
        source: '/:all*(css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
