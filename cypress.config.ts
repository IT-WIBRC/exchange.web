import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "b2ptor",
  e2e: {
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,ts}",
    baseUrl: "http://localhost:4173/",
  },
});
