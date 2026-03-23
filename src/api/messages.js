import { createMessageRecord, getMessagesSnapshot, resolveWithDelay } from "./mockDb.js";

export async function getMessagesByConversationId(conversationId) {
  const messages = getMessagesSnapshot().filter((message) => {
    return message.conversationId === conversationId;
  });

  return resolveWithDelay(messages);
}

export async function createMessage({ conversationId, role, text }) {
  const message = createMessageRecord({
    conversationId,
    role,
    text,
  });

  return resolveWithDelay(message);
}
