import MessageList from "./MessageList.jsx";
import MessageComposer from "./MessageComposer.jsx";

export default function ChatPanel({
  messages,
  onSendMessage,
  isLoading,
  showLoadingIndicator,
  hasActiveConversation,
  errorMessage,
}) {
  return (
    <div className="chat-main flex-1 flex flex-col bg-white">
      <header className="chat-header bg-slate-800 text-white px-6 py-4">
        <h1 className="text-lg font-semibold">Assistant Chat</h1>
        <p className="text-xs text-slate-300 mt-1">
          Status: {isLoading ? "waiting for reply" : "connected"}
        </p>
      </header>

      <MessageList messages={messages} isLoading={showLoadingIndicator} />

      {errorMessage ? (
        <div className="px-4 md:px-6 py-2 text-xs text-amber-600 border-t border-amber-100 bg-amber-50">
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
