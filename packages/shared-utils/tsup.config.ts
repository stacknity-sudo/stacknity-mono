import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["@tanstack/react-query", "zod"],
  skipNodeModulesBundle: true,
  esbuildOptions(options) {
    options.conditions = ["module"];
  },
});
