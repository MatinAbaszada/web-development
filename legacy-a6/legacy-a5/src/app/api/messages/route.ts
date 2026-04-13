import { NextResponse } from "next/server";
import { createMessageRecord, hasConversationRecord } from "@/server/mockDb";
import type { CreateMessageInput } from "@/types/chat";

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<CreateMessageInput>;

  if (!payload.conversationId || !payload.role || !payload.text?.trim()) {
    return NextResponse.json(
      {
        error: "conversationId, role, and text are required.",
      },
      {
        status: 400,
      }
    );
  }

  if (!hasConversationRecord(payload.conversationId)) {
    return NextResponse.json(
      {
        error: "Conversation not found.",
      },
      {
        status: 404,
      }
    );
  }

  const message = createMessageRecord({
    conversationId: payload.conversationId,
    role: payload.role,
    text: payload.text.trim(),
  });

  return NextResponse.json(message, {
    status: 201,
  });
}
