import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["unpdf", "pizzip", "docxtemplater"],
};

export default nextConfig;
