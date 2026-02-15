import { describe, expect, it } from "vitest";

describe('Initialization/sanity check', () => {
    it('Should pass if vitest is properly initialized and vitest knows math', () => {
        expect(1 + 1).toBe(2);
    })
});