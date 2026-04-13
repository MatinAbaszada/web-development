import { NextResponse } from "next/server";
import { ChatStoreError, deleteConversation } from "@/server/chat-store";

type ConversationRouteContext = {
  params: Promise<{
    conversationId: string;
  }>;
};

export async function DELETE(_: Request, { params }: ConversationRouteContext) {
  const { conversationId } = await params;

  try {
    const conversation = await deleteConversation(conversationId);
    return NextResponse.json(conversation);
  } catch (error) {
    const status = error instanceof ChatStoreError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Request failed.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status,
      }
    );
  }
}
