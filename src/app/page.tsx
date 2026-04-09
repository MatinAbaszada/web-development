import { redirect } from "next/navigation";
import prisma from "@/server/prisma";

export const dynamic = "force-dynamic";

export default async function Page() {
  const conversation = await prisma.conversation.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (conversation) {
    redirect(`/conversations/${conversation.id}`);
  }

  const count = await prisma.conversation.count();
  const firstConversation = await prisma.conversation.create({
    data: {
      title: `New Chat ${count + 1}`,
    },
  });

  redirect(`/conversations/${firstConversation.id}`);
}
