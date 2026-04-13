import { NextResponse } from "next/server";
import {
  createConversationRecord,
  getConversationsSnapshot,
} from "@/server/mockDb";

export async function GET() {
  return NextResponse.json(getConversationsSnapshot());
}

export async function POST() {
  return NextResponse.json(createConversationRecord(), {
    status: 201,
  });
}
