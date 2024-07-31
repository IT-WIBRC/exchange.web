import { configDefaults, defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";
import viteConfig from "./vite.config";

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        environment: "jsdom",
        root: fileURLToPath(new URL("./", import.meta.url)),
        exclude: [
          ...configDefaults.exclude,
          "e2e/*",
          "**/*.config.*",
          "**/*.d.ts",
          "**/*.cjs",
          "**/src/main.ts",
        ],
        coverage: {
          enabled: true,
          provider: "v8",
          reporter: ["text", "json-summary", "json"],
          reportOnFailure: true,
          thresholds: {
            lines: 70,
            branches: 80,
            functions: 70,
            statements: 80,
          },
          cleanOnRerun: true,
          exclude: [
            "**/src/infra/api/services/**",
            "**/src/infra/router/*.ts",
            "**/__mocks__/**",
            "**/*.config.*",
            "**/src/main.ts",
          ],
        },
      },
    })
  )
);
