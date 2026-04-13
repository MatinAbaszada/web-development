"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConversationList from "@/components/Sidebar/ConversationList";
import ModelSelector from "@/components/Sidebar/ModelSelector";
import {
  createConversation,
  deleteConversation,
} from "@/lib/api/conversations";
import { AVAILABLE_MODELS } from "@/lib/models";
import type { Conversation } from "@/types/chat";

interface SidebarProps {
  activeConversationId: string;
  initialConversations: Conversation[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export default function Sidebar({
  activeConversationId,
  initialConversations,
  selectedModel,
  onModelChange,
}: SidebarProps) {
  const router = useRouter();
  const [conversations, setConversations] = useState(initialConversations);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingConversationId, setDeletingConversationId] = useState("");

  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  function handleConversationSelect(conversationId: string) {
    router.push(`/conversations/${conversationId}`);
  }

  async function handleCreateConversation() {
    const previousConversations = conversations;
    const temporaryConversation: Conversation = {
      id: `temp-${Date.now()}`,
      title: "New Chat",
      updatedAt: new Date().toISOString(),
    };

    setIsCreating(true);
    setConversations((currentConversations) => {
      return [temporaryConversation, ...currentConversations];
    });

    try {
      const conversation = await createConversation();
      router.push(`/conversations/${conversation.id}`);
      router.refresh();
    } catch (error) {
      setConversations(previousConversations);
      throw error;
    } finally {
      setIsCreating(false);
    }
  }

  async function handleConversationDelete(conversationId: string) {
    const previousConversations = conversations;
    const nextConversations = conversations.filter((conversation) => {
      return conversation.id !== conversationId;
    });

    setDeletingConversationId(conversationId);
    setConversations(nextConversations);

    try {
      await deleteConversation(conversationId);

      if (activeConversationId === conversationId) {
        if (nextConversations.length > 0) {
          router.push(`/conversations/${nextConversations[0].id}`);
        } else {
          router.push("/");
        }
      }

      router.refresh();
    } catch (error) {
      setConversations(previousConversations);
      throw error;
    } finally {
      setDeletingConversationId("");
    }
  }

  return (
    <aside className="sidebar flex w-64 flex-col border-r border-slate-200 bg-slate-50">
      <button
        type="button"
        className="new-chat-btn m-4 rounded-md bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        disabled={isCreating}
        onClick={handleCreateConversation}
      >
        {isCreating ? "Creating..." : "New Chat"}
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
        deletingConversationId={deletingConversationId}
      />
    </aside>
  );
}
