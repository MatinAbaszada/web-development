"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
  const queryClient = useQueryClient();
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL_ID);
  const [errorMessage, setErrorMessage] = useState("");
  const messagesQuery = useQuery({
    queryKey: ["messages", activeConversationId],
    queryFn: () => getMessagesByConversationId(activeConversationId),
    enabled: Boolean(activeConversationId),
  });
  const messages = messagesQuery.data ?? [];
  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const currentMessages =
        queryClient.getQueryData<ChatMessage[]>([
          "messages",
          activeConversationId,
        ]) ?? [];
      const realMessages = currentMessages.filter((message) => {
        return message.id.startsWith("temp-user-") === false;
      });
      const savedUserMessage = await createMessage({
        conversationId: activeConversationId,
        role: "user",
        text,
      });
      const assistantText = await requestAssistantReply({
        messages: [...realMessages, savedUserMessage],
        model: selectedModel,
      });

      await createMessage({
        conversationId: activeConversationId,
        role: "assistant",
        text: assistantText,
      });
    },
    onMutate: async (text: string) => {
      setErrorMessage("");
      await queryClient.cancelQueries({
        queryKey: ["messages", activeConversationId],
      });

      const temporaryUserMessage: ChatMessage = {
        id: `temp-user-${Date.now()}`,
        conversationId: activeConversationId,
        role: "user",
        text,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<ChatMessage[]>(
        ["messages", activeConversationId],
        (currentMessages) => {
          return [...(currentMessages ?? []), temporaryUserMessage];
        }
      );
    },
    onError: (error) => {
      setErrorMessage(getErrorMessage(error));
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["messages", activeConversationId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
  const queryErrorMessage = messagesQuery.error
    ? getErrorMessage(messagesQuery.error)
    : "";
  const visibleErrorMessage = errorMessage || queryErrorMessage;
  const isLoading = messagesQuery.isLoading || sendMessageMutation.isPending;

  async function handleSendMessage(text: string) {
    if (!activeConversationId || sendMessageMutation.isPending) {
      return;
    }

    await sendMessageMutation.mutateAsync(text);
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="app-container mx-auto flex h-[92vh] w-full max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Sidebar
          activeConversationId={activeConversationId}
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
