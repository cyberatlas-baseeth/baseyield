// ============================================================
// YieldPulse — Chat API Route (Streaming)
// ============================================================

import { NextRequest } from "next/server";
import { getBaseYields, formatPoolsForContext } from "@/lib/defillama";
import { streamChatCompletion, GroqMessage } from "@/lib/groq";
import { buildSystemPrompt } from "@/lib/prompts";
import { ChatRequest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30; // Vercel free tier: 10s default, up to 60s

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return Response.json(
        { error: "Invalid request: messages array required" },
        { status: 400 }
      );
    }

    // 1. Fetch live Base yield data
    let yieldContext: string;
    try {
      const pools = await getBaseYields();
      yieldContext = formatPoolsForContext(pools);
    } catch {
      yieldContext =
        "⚠️ Yield data is temporarily unavailable. Please try again in a moment.";
    }

    // 2. Build the message array with system prompt + yield context
    const systemPrompt = buildSystemPrompt(yieldContext);
    const messages: GroqMessage[] = [
      { role: "system", content: systemPrompt },
      ...body.messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // 3. Stream the response from Groq
    const stream = await streamChatCompletion(messages);

    // 4. Create a ReadableStream for SSE
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const data = JSON.stringify({ content: chunk });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("[Chat API] Stream error:", error);
          const errorData = JSON.stringify({
            error: "Stream interrupted. Please try again.",
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[Chat API] Error:", error);

    // Handle Groq rate limiting
    if (error instanceof Error && error.message.includes("429")) {
      return Response.json(
        {
          error:
            "Rate limit reached. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
