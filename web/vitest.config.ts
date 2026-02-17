import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    // test environment, files, globals setting
    test: {
        setupFiles: ['./src/tests/component/setup.ts'],
        include: ['./src/tests/component/*.test.ts', './src/tests/component/*.test.tsx'],
        environment: 'jsdom',
        globals: true,
    },
    // resolve custom path (@)
    resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ← fixes your @/ imports
    },
  },
});