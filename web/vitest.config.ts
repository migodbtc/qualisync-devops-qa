import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {

        // instead of importing vitest functions one-by-one
        // just set this to true and by default, vitest keywords
        // dont need any import
        globals: true, 

        // for the mock dom to be used for testing
        // jsdom will be the mock dom
        setupFiles: ['./src/tests/setup.ts'],
        environment: 'jsdom',
    }
});