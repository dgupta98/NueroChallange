import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import type { z } from "zod";

const GROQ_BASE = "https://api.groq.com/openai/v1";
const MODEL = "qwen/qwen3.8-27b";

function friendlyError(error: unknown): Error {
  if (error && typeof error === "object" && "message" in error) {
    const msg = String((error as { message: unknown }).message);
    if (msg.includes("429")) return new Error("Too many requests right now. Please wait a moment and try again.");
    if (msg.includes("401") || msg.includes("403")) return new Error("AI API key is not set up correctly.");
    if (msg.includes("model") && (msg.includes("not found") || msg.includes("deprecated") || msg.includes("invalid")))
      return new Error("The AI model isn't available right now. Please try again.");
  }
  if (error instanceof Error && error.name.includes("NoObjectGenerated")) {
    return new Error("Couldn't turn that into steps. Try saying it a different way.");
  }
  console.error("[ai.server] unrecognized error:", error);
  return new Error("Something went wrong breaking that down. Please try again.");
}

/** Ask the AI for a JSON object matching `schema`. Server-only. */
export async function generateJson<T>(schema: z.ZodType<T>, instructions: string, input: string): Promise<T> {
  const apiKey = process.env["GROQ_API_KEY"];
  if (!apiKey) throw new Error("AI is not set up for this app. Set GROQ_API_KEY.");

  // compatibility:'compatible' forces /v1/chat/completions — newer SDK versions default
  // to /v1/responses which Groq does not support.
  const provider = createOpenAI({ baseURL: GROQ_BASE, apiKey, compatibility: "compatible" });

  try {
    // Use generateText with an explicit JSON instruction — compatible with any model.
    // The /no_think prefix disables Qwen3 chain-of-thought reasoning.
    const { text } = await generateText({
      model: provider(MODEL),
      system: instructions + "\n\nRespond with ONLY a valid JSON object. No markdown, no explanation, no code blocks — raw JSON only.",
      prompt: "/no_think " + input,
      maxTokens: 1024,
    });

    // Strip any stray thinking tags or markdown fences the model might add
    const cleaned = text
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI returned an empty response.");

    const parsed = JSON.parse(jsonMatch[0]);
    return schema.parse(parsed) as T;
  } catch (error) {
    console.error("[ai.server] call failed:", error instanceof Error ? error.message : error);
    if (error instanceof Error && (error.message.includes("AI returned") || error.message.includes("parse"))) {
      throw new Error("Couldn't turn that into steps. Try saying it a different way.");
    }
    throw friendlyError(error);
  }
}
