import { URL, fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    base: `${process.env.VITE_PATH ?? "/"}`,
    build: {
      outDir: mode === "staging" ? "dist-staging" : "dist",
      emptyOutDir: true,
    },
  };
});
