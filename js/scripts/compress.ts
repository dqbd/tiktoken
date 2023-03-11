import fs from "node:fs/promises";
import { createReadStream, createWriteStream } from "node:fs";

import zlib from "zlib";

async function main() {
  for (const filename of [
    "cl100k_base",
    "gpt2",
    // "p50k_base",
    // "p50k_edit",
    "r50k_base",
  ]) {
    const file = await fs.readFile(`ranks/${filename}.tiktoken`, {
      encoding: "utf-8",
    });

    const bufferSizes = new Set<number>();

    const items = file
      .split("\n")
      .filter((line) => !!line.trim())
      .map((line, i) => {
        const [base64, idx] = line
          .trim()
          .split(" ")
          .map((x) => x.trim());

        const buff = Buffer.from(base64, "base64");
        bufferSizes.add(buff.length);

        if (Number.parseInt(idx, 10) !== i) {
          throw new Error(`Not matching index ${idx} != ${i} for ${filename}`);
        }

        return [buff, idx] as const;
      });

    const tokens = items.map((x) => x[0]).sort((a, b) => a.compare(b));

    const compressed = tokens.reduce((memo, item) => {
      return Buffer.concat([memo, Buffer.from([0]), item]);
    }, Buffer.from([]));

    compressed;

    fs.writeFile(`ranks/${filename}.tiktoken.compressed`, compressed);

    console.log(tokens.filter((x) => x.includes(0)));

    await new Promise<void>((resolve, reject) => {
      const readStream = createReadStream(`ranks/${filename}.tiktoken`);
      const writeStream = createWriteStream(`ranks/${filename}.tiktoken.gzip`);

      const gzip = zlib.createGzip();

      readStream.pipe(gzip).pipe(writeStream);

      writeStream.on("finish", () => {
        console.log("File has been compressed.");
        resolve();
      });
    });

    await new Promise<void>((resolve, reject) => {
      const readStream = createReadStream(
        `ranks/${filename}.tiktoken.compressed`
      );
      const writeStream = createWriteStream(
        `ranks/${filename}.tiktoken.compressed.gzip`
      );

      const gzip = zlib.createGzip();

      readStream.pipe(gzip).pipe(writeStream);

      writeStream.on("finish", () => {
        console.log("File has been compressed.");
        resolve();
      });
    });
  }
}

main();
