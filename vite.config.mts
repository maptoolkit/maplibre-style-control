import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ bundleTypes: true, tsconfigPath: "./tsconfig.json" })],
  build: {
    sourcemap: true,
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      name: "MaplibreStyleControl",
      fileName: (format) => (format === "umd" ? "maplibre-style-control.js" : "maplibre-style-control.mjs"),
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["maplibre-gl"],
      output: {
        globals: {
          "maplibre-gl": "maplibregl",
        },
      },
    },
  },
});
