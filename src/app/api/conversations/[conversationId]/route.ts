import { NextResponse } from "next/server";
import prisma from "@/server/prisma";

type ConversationRouteContext = {
  params: Promise<{
    conversationId: string;
  }>;
};

export async function DELETE(_: Request, { params }: ConversationRouteContext) {
  const { conversationId } = await params;
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
  });

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

  await prisma.conversation.delete({
    where: {
      id: conversationId,
    },
  });

  return NextResponse.json(conversation);
}
