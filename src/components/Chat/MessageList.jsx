import { useEffect, useRef } from "react";
import Message from "./Message.jsx";
import LoadingIndicator from "./LoadingIndicator.jsx";

export default function MessageList({ messages, isLoading }) {
  const messageListRef = useRef(null);

  useEffect(() => {
    if (!messageListRef.current) {
      return;
    }

    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [messages, isLoading]);

  return (
    <main
      ref={messageListRef}
      className="message-list flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6"
      aria-live="polite"
    >
      {messages.length === 0 ? (
        <div className="text-sm text-slate-500 border border-dashed border-slate-200 rounded-lg px-4 py-6 bg-slate-50">
          Select a conversation or start a new chat to begin.
        </div>
      ) : null}

      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}

      {isLoading ? <LoadingIndicator /> : null}
    </main>
  );
}
