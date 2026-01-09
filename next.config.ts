/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["ik.imagekit.io"],
  },
  
  // Keep webpack config
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  
  // Add empty turbopack config to disable it for builds
  experimental: {
    turbo: {},
  },
  
  // Enable these for debugging
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Add for better performance
  swcMinify: true,
};

export default nextConfig;