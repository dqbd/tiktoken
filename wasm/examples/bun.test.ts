import { execa } from "execa";
import { expect, it } from "vitest";
import path from "path";

console.log(path.resolve(__dirname, "./bun"));
it("index.js", async () => {
  const result = await execa("bun", ["index.js"], {
    cwd: path.resolve(__dirname, "./bun"),
  });

  expect(result.stdout).toMatchInlineSnapshot(
    `"Uint32Array(2) [ 31373, 995 ]"`
  );
});

it("index.cjs", async () => {
  const result = await execa("bun", ["index.cjs"], {
    cwd: path.resolve(__dirname, "./bun"),
  });

  expect(result.stdout).toMatchInlineSnapshot(
    `"Uint32Array(2) [ 31373, 995 ]"`
  );
});

it("index.mjs", async () => {
  const result = await execa("bun", ["index.mjs"], {
    cwd: path.resolve(__dirname, "./bun"),
  });

  expect(result.stdout).toMatchInlineSnapshot(
    `"Uint32Array(2) [ 31373, 995 ]"`
  );
});
