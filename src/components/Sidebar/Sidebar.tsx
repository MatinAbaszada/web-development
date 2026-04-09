"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import ConversationList from "@/components/Sidebar/ConversationList";
import ModelSelector from "@/components/Sidebar/ModelSelector";
import {
  createConversation,
  deleteConversation,
  getConversations,
} from "@/lib/api/conversations";
import { AVAILABLE_MODELS } from "@/lib/models";

interface SidebarProps {
  activeConversationId: string;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export default function Sidebar({
  activeConversationId,
  selectedModel,
  onModelChange,
}: SidebarProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const conversationsQuery = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });
  const conversations = conversationsQuery.data ?? [];
  const createConversationMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: async (conversation) => {
      await queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
      router.push(`/conversations/${conversation.id}`);
    },
  });
  const deleteConversationMutation = useMutation({
    mutationFn: deleteConversation,
    onSuccess: async (_, conversationId) => {
      const nextConversation = conversations.find((conversation) => {
        return conversation.id !== conversationId;
      });

      await queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });

      if (activeConversationId === conversationId) {
        if (nextConversation) {
          router.push(`/conversations/${nextConversation.id}`);
        } else {
          router.push("/");
        }
      }
    },
  });

  function handleConversationSelect(conversationId: string) {
    router.push(`/conversations/${conversationId}`);
  }

  async function handleCreateConversation() {
    await createConversationMutation.mutateAsync();
  }

  function handleConversationDelete(conversationId: string) {
    deleteConversationMutation.mutate(conversationId);
  }

  return (
    <aside className="sidebar flex w-64 flex-col border-r border-slate-200 bg-slate-50">
      <button
        type="button"
        className="new-chat-btn m-4 rounded-md bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        disabled={createConversationMutation.isPending}
        onClick={handleCreateConversation}
      >
        {createConversationMutation.isPending ? "Creating..." : "New Chat"}
      </button>

      <ModelSelector
        models={AVAILABLE_MODELS}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
      />

      <ConversationList
        conversations={conversations}
        activeConversationId={activeConversationId}
        onConversationSelect={handleConversationSelect}
        onConversationDelete={handleConversationDelete}
        deletingConversationId={deleteConversationMutation.variables ?? ""}
      />
    </aside>
  );
}
