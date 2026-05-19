import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  turbopack: {},
  // Allow phone on local network to connect without HMR blocked errors
  allowedDevOrigins: ["192.168.1.33"],
};

export default withPWA(nextConfig);
