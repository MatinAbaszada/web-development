import { NextResponse } from "next/server";
import prisma from "@/server/prisma";

type MessagesRouteContext = {
  params: Promise<{
    conversationId: string;
  }>;
};

export async function GET(_: Request, { params }: MessagesRouteContext) {
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

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return NextResponse.json(messages);
}
