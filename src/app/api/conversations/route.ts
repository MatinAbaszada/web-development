import { NextResponse } from "next/server";
import prisma from "@/server/prisma";

export async function GET() {
  const conversations = await prisma.conversation.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return NextResponse.json(conversations);
}

export async function POST() {
  const count = await prisma.conversation.count();
  const conversation = await prisma.conversation.create({
    data: {
      title: `New Chat ${count + 1}`,
    },
  });

  return NextResponse.json(conversation, {
    status: 201,
  });
}
