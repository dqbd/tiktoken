import { test, expect, describe, afterAll } from "vitest";
import { get_encoding } from "../../wasm/dist";
import { getEncoding } from "../src/index";
import { EVIL_STRING } from "./fixtures/evil-string";

describe("Tokenizer resolves in acceptable time", () => {
    const full = get_encoding("cl100k_base");

    afterAll(() => full.free());

    test("Test wasm performance", () => {
        const start = Date.now();
        const result = full.encode(EVIL_STRING);
        const end = Date.now();
        expect(end - start).toBeLessThanOrEqual(5000);
    });

    const lite = getEncoding("cl100k_base");
    
    test("Test wasm performance", () => {
        const start = Date.now();
        const result = lite.encode(EVIL_STRING);
        const end = Date.now();
        expect(end - start).toBeLessThanOrEqual(5000);
    });
});