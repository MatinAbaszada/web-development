import type { Conversation } from "@/types/chat";

export async function getConversations() {
  const response = await fetch("/api/conversations", {
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Request failed."
    );
  }

  return data as Conversation[];
}

export async function createConversation() {
  const response = await fetch("/api/conversations", {
    method: "POST",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Request failed."
    );
  }

  return data as Conversation;
}
