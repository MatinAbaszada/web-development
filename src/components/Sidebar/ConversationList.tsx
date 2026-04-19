"use client";

import ConversationItem from "@/components/Sidebar/ConversationItem";
import { useConversations } from "@/hooks/conversations";
import type { Conversation } from "@/types/chat";

interface ConversationListProps {
  initialConversations: Conversation[];
  activeChatId: string;
}

export default function ConversationList({
  initialConversations,
  activeChatId,
}: ConversationListProps) {
  const {
    conversations,
    createConversation,
    deleteConversation,
    deletingChatId,
    errorMessage,
    isCreating,
    selectChat,
  } = useConversations(activeChatId, initialConversations);

  return (
    <>
      <button
        type="button"
        className="new-chat-btn m-4 rounded-md bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isCreating}
        onClick={createConversation}
      >
        {isCreating ? "Creating..." : "New Chat"}
      </button>

      {errorMessage ? (
        <div className="mx-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {errorMessage}
        </div>
      ) : null}

      <nav className="conversations-list flex-1 overflow-y-auto p-3 pt-0">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === activeChatId}
            onClick={selectChat}
            onDelete={deleteConversation}
            isDeleting={deletingChatId === conversation.id}
          />
        ))}
      </nav>
    </>
  );
}
