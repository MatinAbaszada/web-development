import type {
  ChatMessage,
  Conversation,
  CreateMessageInput,
} from "@/types/chat";

const conversationsDb: Conversation[] = [
  {
    id: "conv-1",
    title: "Project Notes",
    updatedAt: "2026-03-23T09:45:00.000Z",
  },
  {
    id: "conv-2",
    title: "Trip Plan",
    updatedAt: "2026-03-22T16:10:00.000Z",
  },
];

const messagesDb: ChatMessage[] = [
  {
    id: "msg-1",
    conversationId: "conv-1",
    role: "assistant",
    text: "Hi, I can help you organize the notes for your project.",
    createdAt: "2026-03-23T09:35:00.000Z",
  },
  {
    id: "msg-2",
    conversationId: "conv-1",
    role: "user",
    text: "Can you summarize the next three things we should build?",
    createdAt: "2026-03-23T09:37:00.000Z",
  },
  {
    id: "msg-3",
    conversationId: "conv-1",
    role: "assistant",
    text: "Sure. I would start with the chat list, the message panel, and then the API integration.",
    createdAt: "2026-03-23T09:38:00.000Z",
  },
  {
    id: "msg-4",
    conversationId: "conv-2",
    role: "assistant",
    text: "Your trip plan already has flights. Do you want help with hotels next?",
    createdAt: "2026-03-22T16:02:00.000Z",
  },
  {
    id: "msg-5",
    conversationId: "conv-2",
    role: "user",
    text: "Yes, and maybe a short day-by-day itinerary too.",
    createdAt: "2026-03-22T16:06:00.000Z",
  },
  {
    id: "msg-6",
    conversationId: "conv-2",
    role: "assistant",
    text: "Perfect. I can suggest hotels by budget and then outline each day.",
    createdAt: "2026-03-22T16:08:00.000Z",
  },
];

let nextConversationNumber = 3;
let nextMessageNumber = 7;

function cloneValue<T>(value: T): T {
  return structuredClone(value);
}

export function hasConversationRecord(conversationId: string) {
  return conversationsDb.some(
    (conversation) => conversation.id === conversationId
  );
}

export function getConversationsSnapshot() {
  const conversations = [...conversationsDb].sort((leftItem, rightItem) => {
    return rightItem.updatedAt.localeCompare(leftItem.updatedAt);
  });

  return cloneValue(conversations);
}

export function getMessagesForConversation(conversationId: string) {
  const messages = messagesDb.filter((message) => {
    return message.conversationId === conversationId;
  });

  return cloneValue(messages);
}

export function createConversationRecord() {
  const currentDate = new Date().toISOString();
  const conversation: Conversation = {
    id: `conv-${nextConversationNumber}`,
    title: `New Chat ${nextConversationNumber}`,
    updatedAt: currentDate,
  };

  nextConversationNumber += 1;
  conversationsDb.unshift(conversation);

  return cloneValue(conversation);
}

export function createMessageRecord({
  conversationId,
  role,
  text,
}: CreateMessageInput) {
  const currentDate = new Date().toISOString();
  const message: ChatMessage = {
    id: `msg-${nextMessageNumber}`,
    conversationId,
    role,
    text,
    createdAt: currentDate,
  };

  nextMessageNumber += 1;
  messagesDb.push(message);

  const conversation = conversationsDb.find(
    (item) => item.id === conversationId
  );

  if (conversation) {
    conversation.updatedAt = currentDate;
  }

  return cloneValue(message);
}
