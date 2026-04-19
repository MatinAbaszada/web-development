import type { ChatMessage } from "@/types/chat";

interface AssistantReplyRequest {
  messages: ChatMessage[];
  model: string;
}

interface AssistantReplyResponse {
  text: string;
}

export async function requestAssistantReply(payload: AssistantReplyRequest) {
  const response = await fetch("/api/llm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as
    | AssistantReplyResponse
    | { error?: string };

  if (!response.ok) {
    const errorMessage =
      "error" in data && typeof data.error === "string"
        ? data.error
        : "Request failed.";

    throw new Error(errorMessage);
  }

  if (!("text" in data) || typeof data.text !== "string") {
    throw new Error("Request failed.");
  }

  return data.text;
}
