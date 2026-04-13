import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export function getOpenRouterChatModel(model: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OpenRouter API key is missing.");
  }

  const openrouter = createOpenRouter({
    apiKey,
  });

  return openrouter.chat(model);
}
