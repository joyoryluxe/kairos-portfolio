import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix: silence the "multiple lockfiles" workspace-root warning
  outputFileTracingRoot: path.join(__dirname, "../"),

  // Fix: tell Turbopack where the root is (also silences the warning)
  turbopack: {
    root: path.join(__dirname, "../"),
  },

  // Set the subfolder path for production
  basePath: '/admin_kairos',
  assetPrefix: '/admin_kairos',
  
  // Create folders for each route (e.g. /sections/index.html) 
  // This fixes 403 Forbidden errors on Hostinger/Apache
  trailingSlash: true,
  
  // Conditionally set output: export only for production builds, allowing redirects in dev mode
  output: process.env.NODE_ENV === 'development' ? undefined : 'export',
  
  images: {
    unoptimized: true,
  },

  // Redirect root to /admin_kairos/sections/ when clicking http://localhost:3000 in local dev
  async redirects() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/',
          destination: '/admin_kairos/sections/',
          basePath: false,
          permanent: false,
        },
      ];
    }
    return [];
  },
};



export default nextConfig;
