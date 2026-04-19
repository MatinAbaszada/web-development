import ChatPanel from "@/components/ChatPanel/ChatPanel";
import Sidebar from "@/components/Sidebar/Sidebar";
import { getConversationById } from "@/server/conversations";
import { getUIMessages } from "@/server/messages";
import { redirect } from "next/navigation";

type ChatPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;
  const conversation = await getConversationById(id);

  if (!conversation) {
    redirect("/");
  }

  const initialMessages = (await getUIMessages(id)) ?? [];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="app-container mx-auto flex h-[92vh] w-full max-w-6xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <Sidebar activeChatId={id} />
        <ChatPanel key={id} chatId={id} initialMessages={initialMessages} />
      </div>
    </div>
  );
}
