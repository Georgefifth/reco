import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ReCo is a fully client-side app — all pages are client components and
  // all health data lives in the browser's IndexedDB. The Next.js server
  // only serves static HTML/JS/CSS; it never receives or stores user data.
  // This reinforces our privacy story: there is no backend database.
  images: { unoptimized: true },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "no-referrer" },
      ],
    }];
  },
};

export default nextConfig;
