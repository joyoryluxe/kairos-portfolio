import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Fix: silence the "multiple lockfiles" workspace-root warning
  outputFileTracingRoot: path.join(__dirname, "../"),

  // Fix: tell Turbopack where the root is (also silences the warning)
  turbopack: {
    root: path.join(__dirname, "../"),
  },
};

export default nextConfig;
