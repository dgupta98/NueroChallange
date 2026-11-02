import { createOpenAI } from "@ai-sdk/openai";
import { Output, streamText } from "ai";
import type { z } from "zod";

const GROQ_BASE = "https://api.groq.com/openai/v1";
const MODEL = "qwen/qwen3.8-27b";

function friendlyError(error: unknown): Error {
  if (error && typeof error === "object" && "message" in error) {
    const msg = String((error as { message: unknown }).message);
    if (msg.includes("429")) return new Error("Too many requests right now. Please wait a moment and try again.");
    if (msg.includes("401") || msg.includes("403")) return new Error("AI API key is not set up correctly.");
  }
  if (error instanceof Error && error.name.includes("NoObjectGenerated")) {
    return new Error("Couldn't turn that into steps. Try saying it a different way.");
  }
  return new Error("Something went wrong breaking that down. Please try again.");
}

/** Ask the AI for a JSON object matching `schema`. Server-only. */
export async function generateJson<T>(schema: z.ZodType<T>, instructions: string, input: string): Promise<T> {
  const apiKey = process.env["GROQ_API_KEY"];
  if (!apiKey) throw new Error("AI is not set up for this app. Set GROQ_API_KEY.");

  const provider = createOpenAI({
    baseURL: GROQ_BASE,
    apiKey,
  });

  // /no_think disables Qwen3 chain-of-thought reasoning, saving tokens for the JSON output
  const result = streamText({
    model: provider(MODEL),
    system: instructions,
    prompt: "/no_think " + input,
    experimental_output: Output.object({ schema }),
  });

  try {
    const output = await result.experimental_output;
    if (output == null) throw new Error("AI returned an empty response.");
    return output as T;
  } catch (error) {
    console.error("AI call failed", error);
    throw friendlyError(error);
  }
}
