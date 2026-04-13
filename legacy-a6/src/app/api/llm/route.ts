import { NextResponse } from "next/server";
import { requestOpenRouterCompletion } from "@/server/openrouter";
import type { ChatMessage } from "@/types/chat";

export const runtime = "nodejs";

interface AssistantReplyPayload {
  messages?: ChatMessage[];
  model?: string;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as AssistantReplyPayload;

  if (!payload.messages?.length || !payload.model) {
    return NextResponse.json(
      {
        error: "messages and model are required.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const text = await requestOpenRouterCompletion(
      payload.messages,
      payload.model
    );

    return NextResponse.json({
      text,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "OpenRouter request failed.";

    return NextResponse.json(
      {
        error: errorMessage,
      },
      {
        status: 500,
      }
    );
  }
}
