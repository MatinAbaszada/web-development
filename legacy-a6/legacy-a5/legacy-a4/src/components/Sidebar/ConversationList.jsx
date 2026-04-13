import ConversationItem from "./ConversationItem.jsx";

export default function ConversationList({
  conversations,
  activeConversationId,
  onConversationSelect,
}) {
  return (
    <nav className="conversations-list flex-1 overflow-y-auto p-3">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeConversationId}
          onClick={onConversationSelect}
        />
      ))}
    </nav>
  );
}
