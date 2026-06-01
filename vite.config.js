import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
//
// DEPLOY NOTE:
//  - Vercel / Netlify / GitHub *user* pages (username.github.io):  base = "/"
//  - GitHub *project* pages (username.github.io/REPO):             base = "/REPO/"
//    e.g. base: "/yeshwant-portfolio/"
// All asset paths in this project use import.meta.env.BASE_URL (see src/lib/asset.js),
// so they automatically respect whatever you set below.
export default defineConfig({
  base: "/yesh.portfolio/",
  plugins: [react()],
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          r3f: ["@react-three/fiber", "@react-three/drei"],
          motion: ["framer-motion", "gsap"],
        },
      },
    },
  },
});
