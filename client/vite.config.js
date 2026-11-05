import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import siteUrl from "./scripts/site-url.js";

export default defineConfig({
  plugins: [react()],
  define: { __SITE_URL__: JSON.stringify(siteUrl()) },   // public URL baked in at build time (canonical / OG tags)
  server: { proxy: { "/api": "http://localhost:5000" } },
  build: { chunkSizeWarningLimit: 1500 }
});
