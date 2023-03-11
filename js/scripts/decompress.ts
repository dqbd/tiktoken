import fs from "fs";

async function main() {
  const buffer = await fs.promises.readFile(
    "ranks/cl100k_base.tiktoken.compressed"
  );

  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }

  console.log(
    [...view].map((i, idx) => (i === 0 ? idx : 0)).filter((x) => x !== 0)
  );
}

main();
