import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { NextResponse } from "next/server";
import {
  createMessage,
  getTextFromUIMessage,
  getUIMessages,
} from "@/server/messages";
import { getOpenRouterChatModel } from "@/server/openrouter";
import type { ChatUIMessage } from "@/types/chat";

export const runtime = "nodejs";

type ChatRoutePayload = {
  conversationId?: string;
  model?: string;
  message?: UIMessage;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as ChatRoutePayload;

  if (!payload.conversationId || !payload.model || !payload.message) {
    return NextResponse.json(
      {
        error: "conversationId, model, and message are required.",
      },
      {
        status: 400,
      }
    );
  }

  const userText = getTextFromUIMessage(payload.message);

  if (!userText) {
    return NextResponse.json(
      {
        error: "Message text is required.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const userMessage = await createMessage({
      conversationId: payload.conversationId,
      role: "user",
      text: userText,
    });

    if (!userMessage) {
      return NextResponse.json(
        {
          error: "Conversation not found.",
        },
        {
          status: 404,
        }
      );
    }

    const messages = await getUIMessages(payload.conversationId);

    if (!messages) {
      return NextResponse.json(
        {
          error: "Conversation not found.",
        },
        {
          status: 404,
        }
      );
    }

    const modelMessages = await convertToModelMessages(messages);
    const result = streamText({
      model: getOpenRouterChatModel(payload.model),
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse<ChatUIMessage>({
      originalMessages: messages,
      onFinish: async ({ messages: nextMessages }) => {
        const lastMessage = nextMessages[nextMessages.length - 1];

        if (!lastMessage || lastMessage.role !== "assistant") {
          return;
        }

        const assistantText = getTextFromUIMessage(lastMessage);

        if (!assistantText) {
          return;
        }

        await createMessage({
          conversationId: payload.conversationId as string,
          role: "assistant",
          text: assistantText,
        });
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}
