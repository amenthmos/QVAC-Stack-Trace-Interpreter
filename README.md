# QVAC Stack Trace Interpreter

Paste a cryptic error message or stack trace line, and an on-device AI gives a plain-English explanation of what it likely means and a general direction to investigate. Not a guaranteed fix — just a starting point. No cloud call, no API key.

## Run

```bash
npm install
npm start
```

Then open http://localhost:32004

## Example

Input:

> TypeError: Cannot read properties of undefined (reading 'map')

Output:

> This error typically means that the code is trying to access a property or method of an object that does not exist. In this case, it's likely that the code is trying to call a method named `map` on an object, but the object is `undefined`. This could be due to a missing import statement, a null or undefined reference, or an incorrect function call. A good place to start looking is the code snippet that called the `map` function, to identify where the error occurred.

## QVAC SDK version

`@qvac/sdk` ^0.19.0 (see `package.json`).

## How it works

Built on [Tether's QVAC SDK](https://www.npmjs.com/package/@qvac/sdk) — all inference runs on-device, no cloud call, no API key. The app loads `LLAMA_3_2_1B_INST_Q4_0` locally with `loadModel()`, generates with `completion()` (streamed via `tokenStream`), and releases the model with `unloadModel()` on shutdown.

## License

MIT
