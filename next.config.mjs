import genkitLoader from '@genkit-ai/next/loader.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, {}) => {
    config.module.rules.push({
      test: /\.prompt$/,
      use: [
        {
          loader: genkitLoader,
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
