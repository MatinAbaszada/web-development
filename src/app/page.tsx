import { redirect } from "next/navigation";
import { createConversation, getLatestConversation } from "@/server/chat-store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const conversation = await getLatestConversation();

  if (conversation) {
    redirect(`/conversations/${conversation.id}`);
  }

  const firstConversation = await createConversation();

  redirect(`/conversations/${firstConversation.id}`);
}
