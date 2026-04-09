export type MessageRole = "user" | "assistant";

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  text: string;
  createdAt: string;
}

export interface ModelOption {
  id: string;
  name: string;
}

export interface CreateMessageInput {
  conversationId: string;
  role: MessageRole;
  text: string;
}
