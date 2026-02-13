import { test, expect } from '@playwright/test';

test('Initialization/Sanity Check', async () => {
    await expect(1+1).toBe(2);
})