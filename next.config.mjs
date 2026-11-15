/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the app is fully client-side, served as Cloudflare Workers static assets
  output: 'export',
  images: {
    // next/image optimization needs a server; static export requires this
    unoptimized: true,
  },
};

export default nextConfig;
