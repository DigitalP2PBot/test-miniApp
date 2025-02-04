import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // ✅ GitHub Pages works better with "dist"
  },
  base: "/digitalp2pbot.github.io/", // ✅ Must match GitHub Pages repo name
  server: {
    port: 5174,
  },
});
