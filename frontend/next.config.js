/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false, // Disable app directory for traditional pages router
  },
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://shazsabir-to-do-backend.hf.space/',
  },
}

module.exports = nextConfig