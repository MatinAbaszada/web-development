function formatUpdatedAt(updatedAt) {
  const date = new Date(updatedAt);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = date.toDateString() === today.toDateString();
  const previousDay = date.toDateString() === yesterday.toDateString();

  if (sameDay) {
    return "Today";
  }

  if (previousDay) {
    return "Yesterday";
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export default function ConversationItem({ conversation, isActive, onClick }) {
  const itemClassName = isActive
    ? "conversation-item active px-3 py-2 rounded-md mb-2"
    : "conversation-item px-3 py-2 rounded-md mb-2";

  return (
    <button
      type="button"
      className={`${itemClassName} text-left w-full`}
      onClick={() => onClick(conversation.id)}
    >
      <div className="truncate">{conversation.title}</div>
      <div className="text-xs text-slate-500 mt-1">
        {formatUpdatedAt(conversation.updatedAt)}
      </div>
    </button>
  );
}
