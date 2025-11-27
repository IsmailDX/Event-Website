import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // add this to avoid unnecessary re‑renders and make components 
  // faster without you manually sprinkling memoization hooks everywhere.
  // reactCompiler: true,

  // for faster builds in development mode
  experimental: {
    turbopackFileSystemCacheForDev: true
  }
};

export default nextConfig;
