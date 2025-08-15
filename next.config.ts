import type { NextConfig } from 'next';
import type { Configuration as WebpackConfig } from 'webpack';
import webpack from 'webpack';
import dotenv from 'dotenv';

dotenv.config();

const nextConfig = {
   reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentExternalPackages: ['bilberrydb'] 
    // Usually nextjs app doesnt bundle nodejs pkgs into server components
    // Criteria: 
    // - Include this package when rendering on the server 
    // Error Status: Build failed
    // serverComponentExternalPackages module
    // How it works?
    // Tree-shake apprach amnd optimize server components.
    // Whether the server-side pkgs have any dependencies node api or build setups - when the nextjs can't automatically handle server component optimization
    // - To ensure nextjs bundles it properly in the server-side build process
  },
  webpack: (config: WebpackConfig) => {
    config.plugins?.push(new webpack.EnvironmentPlugin(process.env));
    return config;
  },
}

export default nextConfig;