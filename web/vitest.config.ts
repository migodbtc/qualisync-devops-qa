import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        // for the mock dom to be used for testing
        // jsdom will be the mock dom
        setupFiles: ['./src/tests/setup.ts'],
        environment: 'jsdom',
        globals: true,
    }
});