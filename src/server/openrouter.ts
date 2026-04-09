import type { ChatMessage } from "@/types/chat";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

export async function requestOpenRouterCompletion(
  messages: ChatMessage[],
  model: string
) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OpenRouter API key is missing.");
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: messages.map((message) => {
        return {
          role: message.role,
          content: message.text,
        };
      }),
    }),
  });

  const data = (await response
    .json()
    .catch(() => null)) as OpenRouterResponse | null;

  if (!response.ok) {
    const errorMessage = data?.error?.message || "OpenRouter request failed.";
    throw new Error(errorMessage);
  }

  const replyText = data?.choices?.[0]?.message?.content?.trim();

  if (!replyText) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return replyText;
}
