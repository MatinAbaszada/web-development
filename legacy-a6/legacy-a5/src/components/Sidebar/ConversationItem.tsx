"use client";

import type { Conversation } from "@/types/chat";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: (conversationId: string) => void;
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
}: ConversationItemProps) {
  const itemClassName = isActive
    ? "conversation-item active mb-2 w-full rounded-md px-3 py-2 text-left"
    : "conversation-item mb-2 w-full rounded-md px-3 py-2 text-left";

  return (
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
  );
}
