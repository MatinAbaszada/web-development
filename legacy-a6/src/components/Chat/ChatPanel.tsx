import MessageComposer from "@/components/Chat/MessageComposer";
import MessageList from "@/components/Chat/MessageList";
import type { ChatMessage } from "@/types/chat";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  hasActiveConversation: boolean;
  errorMessage: string;
}

export default function ChatPanel({
  messages,
  onSendMessage,
  isLoading,
  hasActiveConversation,
  errorMessage,
}: ChatPanelProps) {
  return (
    <div className="chat-main flex flex-1 flex-col bg-white">
      <header className="chat-header bg-slate-800 px-6 py-4 text-white">
        <h1 className="text-lg font-semibold">Assistant Chat</h1>
        <p className="mt-1 text-xs text-slate-300">
          Status: {isLoading ? "waiting for reply" : "connected"}
        </p>
      </header>

      <MessageList messages={messages} isLoading={isLoading} />

      {errorMessage ? (
        <div className="border-t border-amber-100 bg-amber-50 px-4 py-2 text-xs text-amber-600 md:px-6">
          {errorMessage}
        </div>
      ) : null}

      <MessageComposer
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        disabled={!hasActiveConversation}
      />
    </div>
  );
}
