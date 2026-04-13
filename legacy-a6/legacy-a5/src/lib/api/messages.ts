import type { ChatMessage, CreateMessageInput } from "@/types/chat";

export async function getMessagesByConversationId(conversationId: string) {
  const response = await fetch(
    `/api/conversations/${conversationId}/messages`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Request failed."
    );
  }

  return data as ChatMessage[];
}

export async function createMessage(payload: CreateMessageInput) {
  const response = await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Request failed."
    );
  }

  return data as ChatMessage;
}
