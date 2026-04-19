import { NextResponse } from "next/server";
import { deleteConversation } from "@/server/conversations";

type ConversationRouteContext = {
  params: Promise<{
    conversationId: string;
  }>;
};

export async function DELETE(_: Request, { params }: ConversationRouteContext) {
  const { conversationId } = await params;

  try {
    const conversation = await deleteConversation(conversationId);

    if (!conversation) {
      return NextResponse.json(
        {
          error: "Conversation not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(conversation);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}
