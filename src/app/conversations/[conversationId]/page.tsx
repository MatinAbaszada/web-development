import ChatApp from "@/components/ChatApp";
import {
  getConversationById,
  getConversations,
  getUIMessagesByConversationId,
} from "@/server/chat-store";
import { redirect } from "next/navigation";

type ConversationPageProps = {
  params: Promise<{
    conversationId: string;
  }>;
};

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const { conversationId } = await params;
  const conversation = await getConversationById(conversationId);

  if (!conversation) {
    redirect("/");
  }

  const [conversations, initialMessages] = await Promise.all([
    getConversations(),
    getUIMessagesByConversationId(conversationId),
  ]);

  return (
    <ChatApp
      key={conversationId}
      activeConversationId={conversationId}
      initialConversations={conversations}
      initialMessages={initialMessages}
    />
  );
}
