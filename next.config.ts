/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // if (process.env.NODE_ENV === 'development') {
        return [
        {
            source: '/:path*',
            destination: 'http://localhost:9099/:path*',
        },
        ];
    // }
    // return [];
  },
};

export default nextConfig;
