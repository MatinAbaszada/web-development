import ChatApp from "@/components/ChatApp";

type ConversationPageProps = {
  params: Promise<{
    conversationId: string;
  }>;
};

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const { conversationId } = await params;

  return <ChatApp activeConversationId={conversationId} />;
}
