import { execa } from "execa";
import { expect, it } from "vitest";
import path from "path";

it("index.js", async () => {
  const result = await execa("node", ["index.js"], {
    cwd: path.resolve(__dirname, "./node"),
  });

  expect(result.stdout).toMatchInlineSnapshot(
    `"Uint32Array(2) [ 31373, 995 ]"`
  );
});

it("index.cjs", async () => {
  const result = await execa("node", ["index.cjs"], {
    cwd: path.resolve(__dirname, "./node"),
  });

  expect(result.stdout).toMatchInlineSnapshot(
    `"Uint32Array(2) [ 31373, 995 ]"`
  );
});

it("index.mjs", async () => {
  const result = await execa("node", ["index.mjs"], {
    cwd: path.resolve(__dirname, "./node"),
  });

  expect(result.stdout).toMatchInlineSnapshot(
    `"Uint32Array(2) [ 31373, 995 ]"`
  );
});
