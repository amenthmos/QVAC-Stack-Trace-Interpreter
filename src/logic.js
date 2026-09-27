// QVAC Stack Trace Interpreter — core logic.
// completion() does the actual generation; a small set of deterministic
// guards catch unusable model output (refusals, empty text, preamble).

import { completion } from "@qvac/sdk";

function looksUnusable(text) {
  if (!text || text.trim().length === 0) return true;
  if (text.length > 1200) return true;
  const bad = ["i cannot", "i can't", "as an ai", "i'm not able", "i am not able", "i apologize"];
  const lower = text.toLowerCase();
  return bad.some((phrase) => lower.includes(phrase));
}

function stripPreamble(text) {
  return text
    .trim()
    .replace(/^here'?s?[^:\n]*:\s*/i, "")
    .replace(/^sure[,!]?\s*/i, "")
    .trim()
    .replace(/^["'`]+|["'`]+$/g, "")
    .trim();
}

const FALLBACK = (v) =>
      `This looks like an error related to: "${v.slice(0, 150)}". As a starting point, check the code near where this error is thrown and confirm the values involved are what you expect them to be.`;

export async function generate(modelId, error) {
  const run = completion({
    modelId,
    history: [
      {
        role: "system",
        content: "You are an error-message interpreter. Given an error message or stack trace line, explain in plain English what it likely means, grounded strictly in the actual error text given — do not invent file names, line numbers, or causes not implied by the text. Then suggest one general direction to investigate. Explicitly frame this as a starting point, not a guaranteed fix (e.g. 'this usually means...' / 'a good place to start looking is...'). Keep it to 2-4 sentences. Reply with ONLY the explanation, no preamble.",
      },
      { role: "user", content: `Error: ${error}` },
    ],
    stream: true,
    completionOpts: { temperature: 0.4, maxTokens: 220 },
  });

  let text = "";
  for await (const token of run.tokenStream) text += token;
  text = stripPreamble(text);

  const output = looksUnusable(text) ? FALLBACK(error) : text;
  return { result: output };
}
