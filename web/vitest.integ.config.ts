import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const env = loadEnv("test", path.resolve(__dirname), "");

export default defineConfig({
  plugins: [react()],
  test: {
    env: {
      ...process.env,
      ...env,
    },
    setupFiles: ["./src/tests/component/setup.ts"],
    include: ["./src/tests/integration/**/*.integ.test.{ts,tsx}"],
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
