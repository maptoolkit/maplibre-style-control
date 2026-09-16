import { defineConfig } from "vite";

export default defineConfig({
  root: "demo",
  base: "./",
  optimizeDeps: { exclude: ["maplibre-gl"] },
  build: {
    outDir: "../demo-dist",
    emptyOutDir: true,
  },
});
