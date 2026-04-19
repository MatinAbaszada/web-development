"use client";

import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEFAULT_MODEL_ID } from "@/lib/models";
import type { ChatUIMessage } from "@/types/chat";

export function useMessages(chatId: string, initialMessages: ChatUIMessage[]) {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    messages,
    sendMessage: sendChatMessage,
    status,
    error,
  } = useChat<ChatUIMessage>({
    id: chatId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages: nextMessages }) => {
        return {
          body: {
            conversationId: chatId,
            model: selectedModel,
            message: nextMessages[nextMessages.length - 1],
          },
        };
      },
    }),
    onFinish: () => {
      router.refresh();
    },
    onError: (nextError) => {
      setErrorMessage(
        nextError instanceof Error ? nextError.message : "Request failed."
      );
    },
  });
  const visibleErrorMessage =
    errorMessage ||
    (error ? (error instanceof Error ? error.message : "Request failed.") : "");
  const isLoading = status === "submitted" || status === "streaming";

  async function sendMessage(text: string) {
    if (!chatId || isLoading) {
      return;
    }

    setErrorMessage("");
    await sendChatMessage({
      text,
    });
  }

  return {
    errorMessage: visibleErrorMessage,
    isLoading,
    messages,
    selectedModel,
    sendMessage,
    setSelectedModel,
  };
}
