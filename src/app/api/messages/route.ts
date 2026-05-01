import { convertToModelMessages, generateText, type UIMessage } from "ai";
import { NextResponse } from "next/server";
import { DEFAULT_MODEL_ID } from "@/lib/models";
import {
  createMessage,
  getMessages,
  getTextFromUIMessage,
  getUIMessages,
} from "@/server/messages";
import { getOpenRouterChatModel } from "@/server/openrouter";

export const runtime = "nodejs";

type GetMessagesRequest = {
  conversationId?: string;
};

type CreateMessageRequest = {
  conversationId?: string;
  model?: string;
  text?: string;
  message?: UIMessage;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const conversationId: GetMessagesRequest["conversationId"] =
    url.searchParams.get("conversationId") ?? undefined;

  if (!conversationId) {
    return NextResponse.json(
      {
        error: "conversationId is required.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const messages = await getMessages(conversationId);

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

    return NextResponse.json(messages);
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

export async function POST(request: Request) {
  const payload = (await request.json()) as CreateMessageRequest;
  const conversationId = payload.conversationId;
  const text =
    payload.text ??
    (payload.message ? getTextFromUIMessage(payload.message) : "");
  const model = payload.model ?? DEFAULT_MODEL_ID;

  if (!conversationId || !text.trim()) {
    return NextResponse.json(
      {
        error: "conversationId and text are required.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const userMessage = await createMessage({
      conversationId,
      role: "user",
      text,
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

    const uiMessages = await getUIMessages(conversationId);

    if (!uiMessages) {
      return NextResponse.json(
        {
          error: "Conversation not found.",
        },
        {
          status: 404,
        }
      );
    }

    const modelMessages = await convertToModelMessages(uiMessages);
    const result = await generateText({
      model: getOpenRouterChatModel(model),
      messages: modelMessages,
    });
    const assistantMessage = await createMessage({
      conversationId,
      role: "assistant",
      text: result.text,
    });

    return NextResponse.json(
      {
        userMessage,
        assistantMessage,
      },
      {
        status: 201,
      }
    );
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
