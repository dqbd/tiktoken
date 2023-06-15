import { get_encoding } from "tiktoken";

const encoding = get_encoding("gpt2");
const tokens = encoding.encode("hello world");
encoding.free();

console.log(tokens);
