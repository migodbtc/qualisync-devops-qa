import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: './src/tests/e2e',
    outputDir: './src/tests/e2e/results'
})