// next.config.ts  (or .js / .mjs – any one of them)
//
// If you’re using TypeScript the type import is optional;
// Next will infer the correct shape.
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['images.unsplash.com'],
  },

  // ⬇️  Stop Next from forwarding custom CLI flags to ESLint
  //     during `next build` on Vercel.
  eslint: {
    ignoreDuringBuilds: true, // removes `useEslintrc` / `extensions` errors
  },
};

export default nextConfig;
