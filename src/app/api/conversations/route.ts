import { NextResponse } from "next/server";
import { createConversation, getConversations } from "@/server/conversations";

export async function GET() {
  return NextResponse.json(await getConversations());
}

export async function POST() {
  const conversation = await createConversation();
  return NextResponse.json(conversation, {
    status: 201,
  });
}
