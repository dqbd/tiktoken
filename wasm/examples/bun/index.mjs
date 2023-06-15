import { get_encoding } from "tiktoken";

console.log(get_encoding("gpt2").encode("hello world"));
