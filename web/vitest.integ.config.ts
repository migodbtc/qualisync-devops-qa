import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    test: {
        setupFiles: ['./src/tests/component/setup.ts'],
        include: ['./src/tests/integration/**/*.integ.test.{ts,tsx}'],
        environment: 'jsdom',
        globals: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});