"use client";

import type { Conversation } from "@/types/chat";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
  isDeleting: boolean;
}

function formatUpdatedAt(updatedAt: string) {
  const date = new Date(updatedAt);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export default function ConversationItem({
  conversation,
  isActive,
  onClick,
  onDelete,
  isDeleting,
}: ConversationItemProps) {
  const itemClassName = isActive
    ? "conversation-item active flex-1 rounded-md px-3 py-2 text-left"
    : "conversation-item flex-1 rounded-md px-3 py-2 text-left";

  return (
    <div className="mb-2 flex items-start gap-2">
      <button
        type="button"
        className={itemClassName}
        onClick={() => onClick(conversation.id)}
      >
        <div className="truncate">{conversation.title}</div>
        <div className="mt-1 text-xs text-slate-500">
          {formatUpdatedAt(conversation.updatedAt)}
        </div>
      </button>
      <button
        type="button"
        className="rounded-md border border-slate-200 px-2 py-2 text-xs text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isDeleting}
        onClick={() => onDelete(conversation.id)}
      >
        {isDeleting ? "..." : "X"}
      </button>
    </div>
  );
}
