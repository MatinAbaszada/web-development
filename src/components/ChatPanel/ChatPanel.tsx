"use client";

import MessageComposer from "@/components/ChatPanel/MessageComposer";
import MessageList from "@/components/ChatPanel/MessageList";
import ModelSelector from "@/components/ChatPanel/ModelSelector";
import { AVAILABLE_MODELS } from "@/lib/models";
import { useMessages } from "@/hooks/messages";
import type { ChatUIMessage } from "@/types/chat";

interface ChatPanelProps {
  chatId: string;
  initialMessages: ChatUIMessage[];
}

export default function ChatPanel({ chatId, initialMessages }: ChatPanelProps) {
  const {
    errorMessage,
    isLoading,
    messages,
    selectedModel,
    sendMessage,
    setSelectedModel,
  } = useMessages(chatId, initialMessages);

  return (
    <div className="chat-main flex flex-1 flex-col bg-white">
      <header className="chat-header flex flex-col gap-4 bg-slate-800 px-6 py-4 text-white md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Assistant Chat</h1>
          <p className="mt-1 text-xs text-slate-300">
            Status: {isLoading ? "waiting for reply" : "connected"}
          </p>
        </div>
        <ModelSelector
          models={AVAILABLE_MODELS}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </header>

      {errorMessage ? (
        <div className="border-t border-amber-100 bg-amber-50 px-4 py-2 text-xs text-amber-600 md:px-6">
          {errorMessage}
        </div>
      ) : null}

      <MessageComposer
        onSendMessage={sendMessage}
        isLoading={isLoading}
        disabled={!chatId}
      />
    </div>
  );
}
