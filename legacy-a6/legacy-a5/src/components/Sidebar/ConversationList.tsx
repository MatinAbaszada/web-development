import ConversationItem from "@/components/Sidebar/ConversationItem";
import type { Conversation } from "@/types/chat";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string;
  onConversationSelect: (conversationId: string) => void;
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onConversationSelect,
}: ConversationListProps) {
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
