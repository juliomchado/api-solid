import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environmentMatchGlobs: [
      [
        "src/http/controllers/**",
        "./prisma/vitest-environment-prisma/prisma-test-environment.ts",
      ],
    ],
    dir: "src", // Essa linha
    coverage: {
      all: false,
    },
  },
});
