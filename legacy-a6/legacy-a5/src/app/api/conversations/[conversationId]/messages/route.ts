import { NextResponse } from "next/server";
import {
  getMessagesForConversation,
  hasConversationRecord,
} from "@/server/mockDb";

type MessagesRouteContext = {
  params: Promise<{
    conversationId: string;
  }>;
};

export async function GET(_: Request, { params }: MessagesRouteContext) {
  const { conversationId } = await params;

  if (!hasConversationRecord(conversationId)) {
    return NextResponse.json(
      {
        error: "Conversation not found.",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(getMessagesForConversation(conversationId));
}
