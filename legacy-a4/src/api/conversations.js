import {
  createConversationRecord,
  getConversationsSnapshot,
  resolveWithDelay,
} from "./mockDb.js";

export async function getConversations() {
  const conversations = [...getConversationsSnapshot()].sort(
    (leftItem, rightItem) => {
      return rightItem.updatedAt.localeCompare(leftItem.updatedAt);
    }
  );

  return resolveWithDelay(conversations);
}

export async function createConversation() {
  const conversation = createConversationRecord();
  return resolveWithDelay(conversation);
}
