"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Conversation } from "@/types/chat";

async function createConversationRequest() {
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

async function deleteConversationRequest(conversationId: string) {
  const response = await fetch(`/api/conversations/${conversationId}`, {
    method: "DELETE",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data?.error === "string" ? data.error : "Request failed."
    );
  }

  return data as Conversation;
}

export function useConversations(
  activeChatId: string,
  initialConversations: Conversation[]
) {
  const router = useRouter();
  const [conversations, setConversations] = useState(initialConversations);
  const [errorMessage, setErrorMessage] = useState("");

  function selectChat(chatId: string) {
    router.push(`/chats/${chatId}`);
  }

  const createConversationMutation = useMutation({
    mutationFn: createConversationRequest,
    onMutate: () => {
      const previousConversations = conversations;
      const temporaryConversationId = `temp-${Date.now()}`;
      const temporaryConversation: Conversation = {
        id: temporaryConversationId,
        title: "New Chat",
        updatedAt: new Date().toISOString(),
      };

      setErrorMessage("");
      setConversations((currentConversations) => {
        return [temporaryConversation, ...currentConversations];
      });

      return {
        previousConversations,
        temporaryConversationId,
      };
    },
    onError: (error, _, context) => {
      setConversations(context?.previousConversations ?? initialConversations);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to create conversation."
      );
    },
    onSuccess: (conversation, _, context) => {
      setConversations((currentConversations) => {
        if (!context?.temporaryConversationId) {
          return [conversation, ...currentConversations];
        }

        let replacedConversation = false;
        const nextConversations = currentConversations.map(
          (currentConversation) => {
            if (currentConversation.id !== context.temporaryConversationId) {
              return currentConversation;
            }

            replacedConversation = true;
            return conversation;
          }
        );

        return replacedConversation
          ? nextConversations
          : [conversation, ...currentConversations];
      });
      router.push(`/chats/${conversation.id}`);
    },
    onSettled: () => {
      router.refresh();
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: deleteConversationRequest,
    onMutate: (chatId: string) => {
      const previousConversations = conversations;
      const nextConversations = previousConversations.filter((conversation) => {
        return conversation.id !== chatId;
      });

      setErrorMessage("");
      setConversations(nextConversations);

      return {
        nextConversations,
        previousConversations,
      };
    },
    onError: (error, _, context) => {
      setConversations(context?.previousConversations ?? initialConversations);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to delete conversation."
      );
    },
    onSuccess: (_, chatId, context) => {
      if (activeChatId !== chatId) {
        return;
      }

      if (context?.nextConversations.length) {
        router.push(`/chats/${context.nextConversations[0].id}`);
        return;
      }

      router.push("/");
    },
    onSettled: () => {
      router.refresh();
    },
  });

  return {
    conversations,
    createConversation: () => createConversationMutation.mutate(),
    deleteConversation: (chatId: string) =>
      deleteConversationMutation.mutate(chatId),
    deletingChatId:
      deleteConversationMutation.isPending &&
      typeof deleteConversationMutation.variables === "string"
        ? deleteConversationMutation.variables
        : "",
    errorMessage,
    isCreating: createConversationMutation.isPending,
    selectChat,
  };
}
