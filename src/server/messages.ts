import type { UIMessage } from "ai";
import { revalidatePath } from "next/cache";
import prisma from "@/server/db";
import type { ChatMessage, ChatUIMessage, MessageRole } from "@/types/chat";

export function getTextFromUIMessage(message: UIMessage) {
  return message.parts
    .filter((part) => {
      return part.type === "text";
    })
    .map((part) => {
      return part.text;
    })
    .join("")
    .trim();
}

export async function getMessages(conversationId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
  });

  if (!conversation) {
    return null;
  }

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return messages.map((message) => {
    return {
      id: message.id,
      conversationId: message.conversationId,
      role: message.role as MessageRole,
      text: message.text,
      createdAt: message.createdAt.toISOString(),
    } satisfies ChatMessage;
  });
}

export async function getUIMessages(conversationId: string) {
  const messages = await getMessages(conversationId);

  if (!messages) {
    return null;
  }

  return messages.map((message) => {
    return {
      id: message.id,
      role: message.role,
      metadata: {
        createdAt: message.createdAt,
      },
      parts: [
        {
          type: "text" as const,
          text: message.text,
        },
      ],
    } satisfies ChatUIMessage;
  });
}

export async function createMessage(input: {
  conversationId: string;
  role: MessageRole;
  text: string;
}) {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: input.conversationId,
    },
  });

  if (!conversation) {
    return null;
  }

  const text = input.text.trim();

  if (!text) {
    return null;
  }

  const message = await prisma.message.create({
    data: {
      conversationId: input.conversationId,
      role: input.role,
      text,
    },
  });

  await prisma.conversation.update({
    where: {
      id: input.conversationId,
    },
    data: {
      updatedAt: new Date(),
    },
  });

  revalidatePath("/");
  revalidatePath(`/chats/${input.conversationId}`);

  return {
    id: message.id,
    conversationId: message.conversationId,
    role: message.role as MessageRole,
    text: message.text,
    createdAt: message.createdAt.toISOString(),
  } satisfies ChatMessage;
}
