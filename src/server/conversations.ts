import { revalidatePath } from "next/cache";
import prisma from "@/server/db";
import type { Conversation } from "@/types/chat";

export async function getConversations() {
  const conversations = await prisma.conversation.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return conversations.map((conversation) => {
    return {
      id: conversation.id,
      title: conversation.title,
      updatedAt: conversation.updatedAt.toISOString(),
    } satisfies Conversation;
  });
}

export async function getConversationById(chatId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: chatId,
    },
  });

  if (!conversation) {
    return null;
  }

  return {
    id: conversation.id,
    title: conversation.title,
    updatedAt: conversation.updatedAt.toISOString(),
  } satisfies Conversation;
}

export async function getLatestConversation() {
  const conversation = await prisma.conversation.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!conversation) {
    return null;
  }

  return {
    id: conversation.id,
    title: conversation.title,
    updatedAt: conversation.updatedAt.toISOString(),
  } satisfies Conversation;
}

export async function createConversation() {
  const count = await prisma.conversation.count();
  const conversation = await prisma.conversation.create({
    data: {
      title: `New Chat ${count + 1}`,
    },
  });

  revalidatePath("/");
  revalidatePath(`/chats/${conversation.id}`);

  return {
    id: conversation.id,
    title: conversation.title,
    updatedAt: conversation.updatedAt.toISOString(),
  } satisfies Conversation;
}

export async function deleteConversation(chatId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: chatId,
    },
  });

  if (!conversation) {
    return null;
  }

  const deletedConversation = await prisma.conversation.delete({
    where: {
      id: chatId,
    },
  });

  revalidatePath("/");
  revalidatePath(`/chats/${chatId}`);

  return {
    id: deletedConversation.id,
    title: deletedConversation.title,
    updatedAt: deletedConversation.updatedAt.toISOString(),
  } satisfies Conversation;
}
