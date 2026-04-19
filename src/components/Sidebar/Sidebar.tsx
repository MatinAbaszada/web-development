import ConversationList from "@/components/Sidebar/ConversationList";
import { getConversations } from "@/server/conversations";

interface SidebarProps {
  activeChatId: string;
}

export default async function Sidebar({ activeChatId }: SidebarProps) {
  const conversations = await getConversations();
  const conversationListKey = `${activeChatId}:${conversations
    .map((conversation) => {
      return `${conversation.id}:${conversation.updatedAt}`;
    })
    .join("|")}`;

  return (
    <aside className="sidebar flex w-64 flex-col border-r border-slate-200 bg-slate-50">
      <ConversationList
        key={conversationListKey}
        activeChatId={activeChatId}
        initialConversations={conversations}
      />
    </aside>
  );
}
