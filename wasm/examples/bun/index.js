const { get_encoding } = require("tiktoken");

console.log(get_encoding("gpt2").encode("hello world"));
