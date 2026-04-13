"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConversationList from "@/components/Sidebar/ConversationList";
import ModelSelector from "@/components/Sidebar/ModelSelector";
import { createConversation, getConversations } from "@/lib/api/conversations";
import { AVAILABLE_MODELS } from "@/lib/models";
import type { Conversation } from "@/types/chat";

interface SidebarProps {
  activeConversationId: string;
  refreshKey: number;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export default function Sidebar({
  activeConversationId,
  refreshKey,
  selectedModel,
  onModelChange,
}: SidebarProps) {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    let ignore = false;

    async function loadConversations() {
      const conversationItems = await getConversations();

      if (!ignore) {
        setConversations(conversationItems);
      }
    }

    void loadConversations();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (refreshKey === 0) {
      return;
    }

    let ignore = false;

    async function refreshConversations() {
      const conversationItems = await getConversations();

      if (!ignore) {
        setConversations(conversationItems);
      }
    }

    void refreshConversations();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  function handleConversationSelect(conversationId: string) {
    router.push(`/conversations/${conversationId}`);
  }

  async function handleCreateConversation() {
    const conversation = await createConversation();

    setConversations((currentConversations) => [
      conversation,
      ...currentConversations,
    ]);
    router.push(`/conversations/${conversation.id}`);
  }

  return (
    <aside className="sidebar flex w-64 flex-col border-r border-slate-200 bg-slate-50">
      <button
        type="button"
        className="new-chat-btn m-4 rounded-md bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        onClick={handleCreateConversation}
      >
        New Chat
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
      />
    </aside>
  );
}
