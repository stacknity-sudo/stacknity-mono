import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  skipNodeModulesBundle: true,
  esbuildOptions(options) {
    options.conditions = ["module"];
    // Handle CSS files correctly
    options.loader = {
      ...options.loader,
      ".css": "text",
    };
  },
});
