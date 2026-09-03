import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ReCo is a fully client-side app — all pages are client components and
  // all health data lives in the browser's IndexedDB. The Next.js server
  // only serves static HTML/JS/CSS; it never receives or stores user data.
  // This reinforces our privacy story: there is no backend database.
  images: { unoptimized: true },
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};
