import { redirect } from "next/navigation";
import {
  createConversation,
  getLatestConversation,
} from "@/server/conversations";

export const dynamic = "force-dynamic";

export default async function Page() {
  const conversation = await getLatestConversation();

  if (conversation) {
    redirect(`/chats/${conversation.id}`);
  }

  const firstConversation = await createConversation();

  redirect(`/chats/${firstConversation.id}`);
}
