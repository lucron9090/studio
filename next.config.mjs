<<<<<<< HEAD
/** @type {import('next').NextConfig} */
const nextConfig = {};
=======
import { withGenkit } from '@genkit-ai/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
>>>>>>> 70718b0 (The app isn't starting. Please investigate what could be wrong based on)

export default withGenkit(nextConfig);
