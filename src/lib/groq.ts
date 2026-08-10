// ============================================================
// YieldPulse — Groq LLM Client
// ============================================================

import Groq from "groq-sdk";

// Singleton Groq client
let groqClient: Groq | null = null;

function getGroqClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY environment variable is not set");
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

/** Models available on Groq free tier */
export const GROQ_MODELS = {
  fast: "llama-3.1-8b-instant" as const,
  quality: "llama-3.3-70b-versatile" as const,
};

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Stream a chat completion from Groq.
 * Returns an async iterable of content chunks.
 */
export async function streamChatCompletion(
  messages: GroqMessage[],
  model: string = GROQ_MODELS.fast
): Promise<AsyncIterable<string>> {
  const client = getGroqClient();

  const stream = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.3,
    max_tokens: 1024,
    stream: true,
  });

  return {
    async *[Symbol.asyncIterator]() {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    },
  };
}

/**
 * Non-streaming chat completion (for simpler use cases).
 */
export async function chatCompletion(
  messages: GroqMessage[],
  model: string = GROQ_MODELS.fast
): Promise<string> {
  const client = getGroqClient();

  const response = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.3,
    max_tokens: 1024,
    stream: false,
  });

  return response.choices[0]?.message?.content || "";
}
