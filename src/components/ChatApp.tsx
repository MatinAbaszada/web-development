"use client";

import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ChatPanel from "@/components/Chat/ChatPanel";
import Sidebar from "@/components/Sidebar/Sidebar";
import { DEFAULT_MODEL_ID } from "@/lib/models";
import type { ChatUIMessage, Conversation } from "@/types/chat";

interface ChatAppProps {
  activeConversationId: string;
  initialConversations: Conversation[];
  initialMessages: ChatUIMessage[];
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Request failed.";
}

export default function ChatApp({
  activeConversationId,
  initialConversations,
  initialMessages,
}: ChatAppProps) {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID);
  const [errorMessage, setErrorMessage] = useState("");
  const { messages, sendMessage, status, error } = useChat<ChatUIMessage>({
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages: nextMessages }) => {
        return {
          body: {
            conversationId: activeConversationId,
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
      setErrorMessage(getErrorMessage(nextError));
    },
  });
  const visibleErrorMessage =
    errorMessage || (error ? getErrorMessage(error) : "");
  const isLoading = status === "submitted" || status === "streaming";

  async function handleSendMessage(text: string) {
    if (!activeConversationId || isLoading) {
      return;
    }

    setErrorMessage("");
    await sendMessage({
      text,
    });
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="app-container mx-auto flex h-[92vh] w-full max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Sidebar
          activeConversationId={activeConversationId}
          initialConversations={initialConversations}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          hasActiveConversation={Boolean(activeConversationId)}
          errorMessage={visibleErrorMessage}
        />
      </div>
    </div>
  );
}
