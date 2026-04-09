import { NextResponse } from "next/server";
import prisma from "@/server/prisma";
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

  const conversation = await prisma.conversation.findUnique({
    where: {
      id: payload.conversationId,
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

  const message = await prisma.message.create({
    data: {
      conversationId: payload.conversationId,
      role: payload.role,
      text: payload.text.trim(),
    },
  });

  await prisma.conversation.update({
    where: {
      id: payload.conversationId,
    },
    data: {
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(message, {
    status: 201,
  });
}
