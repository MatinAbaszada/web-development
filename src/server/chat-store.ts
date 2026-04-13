import type { UIMessage } from "ai";
import prisma from "@/server/prisma";
import type {
  ChatMessage,
  ChatUIMessage,
  Conversation,
  MessageRole,
} from "@/types/chat";

type PrismaConversation = {
  id: string;
  title: string;
  updatedAt: Date;
};

type PrismaMessage = {
  id: string;
  conversationId: string;
  role: string;
  text: string;
  createdAt: Date;
};

export class ChatStoreError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

function toConversation(conversation: PrismaConversation): Conversation {
  return {
    id: conversation.id,
    title: conversation.title,
    updatedAt: conversation.updatedAt.toISOString(),
  };
}

function toChatMessage(message: PrismaMessage): ChatMessage {
  return {
    id: message.id,
    conversationId: message.conversationId,
    role: message.role as MessageRole,
    text: message.text,
    createdAt: message.createdAt.toISOString(),
  };
}

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

export function toUIMessage(message: ChatMessage): ChatUIMessage {
  return {
    id: message.id,
    role: message.role,
    metadata: {
      createdAt: message.createdAt,
    },
    parts: [
      {
        type: "text",
        text: message.text,
      },
    ],
  };
}

export async function getConversations() {
  const conversations = await prisma.conversation.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return conversations.map(toConversation);
}

export async function getConversationById(conversationId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
  });

  return conversation ? toConversation(conversation) : null;
}

export async function getLatestConversation() {
  const conversation = await prisma.conversation.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return conversation ? toConversation(conversation) : null;
}

export async function createConversation() {
  const count = await prisma.conversation.count();
  const conversation = await prisma.conversation.create({
    data: {
      title: `New Chat ${count + 1}`,
    },
  });

  return toConversation(conversation);
}

export async function deleteConversation(conversationId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
  });

  if (!conversation) {
    throw new ChatStoreError("Conversation not found.", 404);
  }

  const deletedConversation = await prisma.conversation.delete({
    where: {
      id: conversationId,
    },
  });

  return toConversation(deletedConversation);
}

export async function getMessagesByConversationId(conversationId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: {
      id: conversationId,
    },
  });

  if (!conversation) {
    throw new ChatStoreError("Conversation not found.", 404);
  }

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return messages.map(toChatMessage);
}

export async function getUIMessagesByConversationId(conversationId: string) {
  const messages = await getMessagesByConversationId(conversationId);

  return messages.map(toUIMessage);
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
    throw new ChatStoreError("Conversation not found.", 404);
  }

  const text = input.text.trim();

  if (!text) {
    throw new ChatStoreError(
      "conversationId, role, and text are required.",
      400
    );
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

  return toChatMessage(message);
}
