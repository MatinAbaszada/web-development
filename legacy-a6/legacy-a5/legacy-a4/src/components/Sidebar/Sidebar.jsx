import { useEffect, useState } from "react";
import {
  createConversation,
  getConversations,
} from "../../api/conversations.js";
import { getAvailableModels } from "../../api/llm.js";
import ConversationList from "./ConversationList.jsx";
import ModelSelector from "./ModelSelector.jsx";

export default function Sidebar({
  activeConversationId,
  onConversationSelect,
  refreshKey,
  selectedModel,
  onModelChange,
}) {
  const [conversations, setConversations] = useState([]);
  const [models, setModels] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function loadSidebarData() {
      const [conversationItems, modelItems] = await Promise.all([
        getConversations(),
        getAvailableModels(),
      ]);

      if (ignore) {
        return;
      }

      setConversations(conversationItems);
      setModels(modelItems);

      if (!activeConversationId && conversationItems.length > 0) {
        onConversationSelect(conversationItems[0].id);
      }
    }

    loadSidebarData();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      onConversationSelect(conversations[0].id);
    }
  }, [activeConversationId, conversations, onConversationSelect]);

  useEffect(() => {
    let ignore = false;

    async function refreshConversations() {
      const conversationItems = await getConversations();

      if (!ignore) {
        setConversations(conversationItems);
      }
    }

    if (refreshKey > 0) {
      refreshConversations();
    }

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  async function handleCreateConversation() {
    const conversation = await createConversation();

    setConversations((currentConversations) => [
      conversation,
      ...currentConversations,
    ]);
    onConversationSelect(conversation.id);
  }

  return (
    <aside className="sidebar w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
      <button
        type="button"
        className="new-chat-btn m-4 px-4 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors"
        onClick={handleCreateConversation}
      >
        New Chat
      </button>

      <ModelSelector
        models={models}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
      />

      <ConversationList
        conversations={conversations}
        activeConversationId={activeConversationId}
        onConversationSelect={onConversationSelect}
      />
    </aside>
  );
}
