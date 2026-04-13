"use client";

import { useEffect, useState } from "react";
import ChatPanel from "@/components/Chat/ChatPanel";
import Sidebar from "@/components/Sidebar/Sidebar";
import { createMessage, getMessagesByConversationId } from "@/lib/api/messages";
import { requestAssistantReply } from "@/lib/api/llm";
import { DEFAULT_MODEL_ID } from "@/lib/models";
import type { ChatMessage } from "@/types/chat";

interface ChatAppProps {
  activeConversationId: string;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Request failed.";
}

export default function ChatApp({ activeConversationId }: ChatAppProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [conversationRefreshKey, setConversationRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadMessages() {
      try {
        const nextMessages =
          await getMessagesByConversationId(activeConversationId);

        if (!ignore) {
          setMessages(nextMessages);
          setErrorMessage("");
        }
      } catch (error) {
        if (!ignore) {
          setMessages([]);
          setErrorMessage(getErrorMessage(error));
        }
      }
    }

    void loadMessages();

    return () => {
      ignore = true;
    };
  }, [activeConversationId]);

  async function handleSendMessage(text: string) {
    if (!activeConversationId || isLoading) {
      return;
    }

    setErrorMessage("");

    const temporaryUserId = `temp-user-${Date.now()}`;
    const temporaryUserMessage: ChatMessage = {
      id: temporaryUserId,
      conversationId: activeConversationId,
      role: "user",
      text,
      createdAt: new Date().toISOString(),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      temporaryUserMessage,
    ]);
    setIsLoading(true);

    let savedUserMessage: ChatMessage | null = null;

    try {
      savedUserMessage = await createMessage({
        conversationId: activeConversationId,
        role: "user",
        text,
      });

      setMessages((currentMessages) =>
        currentMessages.map((message) => {
          if (message.id === temporaryUserId) {
            return savedUserMessage as ChatMessage;
          }

          return message;
        })
      );
      setConversationRefreshKey((currentValue) => currentValue + 1);

      const assistantText = await requestAssistantReply({
        messages: [...messages, savedUserMessage],
        model: selectedModel,
      });

      const assistantMessage = await createMessage({
        conversationId: activeConversationId,
        role: "assistant",
        text: assistantText,
      });

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
      setConversationRefreshKey((currentValue) => currentValue + 1);
    } catch (error) {
      if (!savedUserMessage) {
        setMessages((currentMessages) =>
          currentMessages.filter((message) => message.id !== temporaryUserId)
        );
      }

      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="app-container mx-auto flex h-[92vh] w-full max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Sidebar
          activeConversationId={activeConversationId}
          refreshKey={conversationRefreshKey}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          hasActiveConversation={Boolean(activeConversationId)}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
}
