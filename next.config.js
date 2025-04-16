/** @type {import('next').NextConfig} */
const nextConfig = {
  // Choose one approach for framer-motion: either transpile it or mark as external package
  // transpilePackages: ['framer-motion'],
  serverExternalPackages: ['framer-motion']
}

module.exports = nextConfig 